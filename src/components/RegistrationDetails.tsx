import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Mail, 
  FileText, 
  ChevronDown, 
  History, 
  Menu, 
  ShoppingCart, 
  User, 
  Shield, 
  Globe, 
  Calendar,
  X,
  FileCode,
  FileType,
  Clock
} from 'lucide-react';
import { Button } from './ui/button';
import { Dropdown, DropdownItem } from './ui/custom-dropdown';
import { doc, updateDoc, onSnapshot, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Logo from './Logo';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { parseFirebaseDate, formatFirebaseDate } from '../utils/dateUtils';

const statusOptions = [
  'submitted',
  'processing',
  'approved',
  'rejected',
  'DOCUMENTATION_SUBMITTED',
  'REVIEW_PENDING',
  'AWAITING_PAYMENT',
  'COMPLETED'
];

const paymentStatusOptions = [
  'pending',
  'paid',
  'refunded',
  'WAITING_PAYMENT_LINK',
  'PAYMENT_RECEIVED'
];

// Reusable table row helper - Defined outside to prevent re-mounting and focus loss during typing
const Row = ({ 
  label, 
  value, 
  path, 
  isEditing, 
  editData, 
  setEditData, 
  type = 'text',
  options 
}: { 
  label: string; 
  value: any; 
  path?: string; 
  isEditing?: boolean; 
  editData?: any; 
  setEditData?: (data: any) => void;
  type?: string;
  options?: { label: string, value: string }[]
}) => {
  const isEditable = !!path && isEditing;
  
  const handleChange = (e: any) => {
    if (!path) return;
    const parts = path.split('.');
    const newData = { ...editData };
    let current = newData;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current[parts[i]] = { ...current[parts[i]] };
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = e.target.value;
    setEditData(newData);
  };

  const getEditValue = () => {
    if (!path || !editData) return value;
    const parts = path.split('.');
    let val = editData;
    for (const part of parts) {
      val = val?.[part];
    }
    return val ?? '';
  };

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
      <td className="py-1 px-3 text-[10px] font-bold text-gray-400 bg-gray-50/30 w-[30%] whitespace-nowrap uppercase tracking-tighter">{label}</td>
      <td className="py-1 px-3 text-xs font-bold text-navy truncate">
        {isEditable ? (
          options ? (
            <select
              value={getEditValue()}
              onChange={handleChange}
              className="w-full px-1.5 py-0.5 border rounded font-bold text-navy bg-yellow-50/50 focus:bg-white border-gray-200 outline-none text-xs"
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input 
              type={type}
              value={getEditValue()}
              onChange={handleChange}
              className="w-full px-1.5 py-0.5 border rounded font-bold text-navy bg-yellow-50/50 focus:bg-white border-gray-200 outline-none text-xs"
              autoFocus={false}
            />
          )
        ) : (
          value || '—'
        )}
      </td>
    </tr>
  );
};

export default function RegistrationDetails({ registration, onBack, onUpdate }: { 
  registration: any, 
  onBack: () => void,
  onUpdate: (data: any) => void 
}) {

  const [isSaving, setIsSaving] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const orderId = registration.id?.substring(0, 8).toUpperCase() || 'ORDER';
  
  // Calculate clientId if not provided (fallback for deep-linking)
  const getFallbackClientId = () => {
    const d = parseFirebaseDate(registration.system?.serverTimestamp) || parseFirebaseDate(registration.createdAt);
    if (d) {
      const key = `${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
      return `C${key}${registration.id?.substring(0,2).toUpperCase()}PL`; // Uses 2 chars of ID as unique sequence if full sequence unknown
    }
    return `C000000${orderId.substring(0,2)}PL`;
  };
  
  const clientId = registration.clientId || getFallbackClientId();
  const isCompany = registration.entity?.type === 'company';
  const rawTimestamp = registration.system?.serverTimestamp || registration.createdAt;
  const dateStr = formatFirebaseDate(rawTimestamp);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [adminComments, setAdminComments] = useState(registration.system?.adminComments || '');

  const primary = registration.entity?.primaryOwner?.details || {};
  const vessel = registration.registration?.vessel || {};
  const engines = registration.registration?.engines || [];
  const handleEdit = () => {
    // Deep clone to prevent accidental mutations during editing
    setEditData(JSON.parse(JSON.stringify(registration)));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleSave = async () => {
    if (!editData) return;
    setIsSaving(true);
    try {
      const payload = { ...editData };
      delete payload.id; // Don't try to update the document ID

      if (!payload.system) payload.system = {};
      payload.system.adminComments = adminComments;
      payload.system.lastUpdated = new Date().toISOString();

      // Send to Firestore directly
      await updateDoc(doc(db, 'registration_requests', registration.id), {
        ...payload,
        history: arrayUnion({
          timestamp: new Date().toISOString(),
          changes: "Administrative record update completed"
        })
      });
      
      setIsEditing(false);
      setEditData(null);
      alert("Changes saved successfully!");
      window.location.reload(); // Refresh to ensure parent list gets newest data
    } catch (err) {
      console.error("Failed to save changes:", err);
      alert("Error saving changes. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveAdminComments = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'registration_requests', registration.id), {
        'system.adminComments': adminComments
      });
    } catch (err) {
      console.error("Failed to save comments:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const generateOwnershipDoc = async () => {
    setIsSaving(true);
    try {
      // Fetch the template from the public folder
      const response = await fetch('/templates/polish_registration_template.docx');
      if (!response.ok) throw new Error('Template not found');
      
      const arrayBuffer = await response.arrayBuffer();
      const zip = new PizZip(arrayBuffer);
      
      const doc = new Docxtemplater(zip, {
        delimiters: { start: '{{', end: '}}' },
        paragraphLoop: true,
        linebreaks: true
      });

      const primary = registration.entity?.primaryOwner?.details || {};
      const vessel = registration.registration?.vessel || {};

      const renderData = {
        firstName: primary.firstName || '',
        lastName: primary.lastName || '',
        email: primary.email || '',
        phone: primary.phone || '',
        mobile: primary.mobile || '',
        address: primary.address || '',
        postCode: primary.postCode || '',
        town: primary.town || '',
        country: primary.country || '',
        
        dobDay: primary.birth?.day || '',
        dobMonth: primary.birth?.month || '',
        dobYear: primary.birth?.year || '',
        placeOfBirth: primary.birth?.place || '',
        dobPlace: `${primary.birth?.day || ''}-${primary.birth?.month || ''}-${primary.birth?.year || ''} ${primary.birth?.place || ''}`.trim() || 'N/A',
        
        nationality: primary.identity?.nationality || '',
        passportNumber: primary.identity?.passportNumber || '',
        passportIssuingCountry: primary.identity?.issuingCountry || '',
        passportId: primary.identity?.passportNumber || 'N/A',
        
        correspondenceAddress: primary.differentDelivery === 'yes' 
          ? `${primary.deliveryAddress || ''}, ${primary.deliveryPostCode || ''} ${primary.deliveryTown || ''}, ${primary.deliveryCountry || ''}`
          : `${primary.address || ''}, ${primary.postCode || ''} ${primary.town || ''}, ${primary.country || ''}`,
          
        contactInfo: `${primary.email || 'N/A'} / ${primary.phone || 'N/A'}`,
        
        boatName: vessel.name || 'N/A',
        vesselName: vessel.name || 'N/A',
        homePort: vessel.portOfChoice || 'N/A',
        portOfChoice: vessel.portOfChoice || 'N/A',
        maxPassengers: vessel.capacity || 'N/A',
        boatLength: vessel.length || 'N/A',
        registrationNumber: vessel.hin || 'N/A',
        hullNumber: vessel.hin || 'N/A',
        boatCategory: vessel.category || '',
        designCategory: vessel.category || '',
        comments: vessel.comments || '',
        
        skipperName: `${primary.firstName || ''} ${primary.lastName || ''}`.trim(),
        skipperAddress: `${primary.address || ''}, ${primary.postCode || ''} ${primary.town || ''}, ${primary.country || ''}`,
        skipperDobPlace: `${primary.birth?.day || ''}-${primary.birth?.month || ''}-${primary.birth?.year || ''} ${primary.birth?.place || ''}`.trim() || 'N/A',
        skipperPassport: primary.identity?.passportNumber || 'N/A',
        
        docNumber: registration.clientId || 'N/A',
        currentDate: new Date().toLocaleDateString('pl-PL'),

        'firstName ': primary.firstName || '',
        'lastName ': primary.lastName || '',
        'email ': primary.email || '',
        'passportNumber ': primary.identity?.passportNumber || '',
        ' postCode': primary.postCode || '',
        'town ': primary.town || '',
        'year ': primary.birth?.year || '',
        'month ': primary.birth?.month || '',
        'day': primary.birth?.day || '',
        'street': primary.address || '',
      };

      doc.render(renderData);

      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        compression: 'DEFLATE'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ownership_Form_${clientId}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("DOC Generation failed:", err);
      alert("Failed to generate document.");
    } finally {
      setIsSaving(false);
    }
  };

  const generateOwnershipPdf = generateOwnershipDoc;

  const downloadWord = () => {
    const primary = registration.entity?.primaryOwner?.details || {};
    const vessel = registration.registration?.vessel || {};
    const orderId = registration.id?.substring(0, 8).toUpperCase() || 'ORDER';

    const engines = registration.registration?.engines || [];
    const content = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 50px; color: #0A1F44; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #C9A24A; padding-bottom: 20px;">
          <h1 style="color: #0A1F44; margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">Official Registration Dossier</h1>
          <p style="color: #666; margin: 10px 0 0 0; font-weight: bold;">OCEAN YACHT REGISTRATION SERVICES - ADMIN COPY</p>
        </div>

        <div style="margin-bottom: 30px; display: flex;">
          <div style="background: #f8f9fa; padding: 20px; border-left: 5px solid #0A1F44; flex: 1;">
            <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; font-weight: bold;">Order Reference Number</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: 900; color: #0A1F44;">#${orderId}PL</p>
          </div>
          <div style="padding: 20px; text-align: right;">
            <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; font-weight: bold;">Date Generated</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-weight: bold;">${new Date().toLocaleString('en-GB')}</p>
          </div>
        </div>
        
        <h2 style="background: #0A1F44; color: #fff; padding: 12px 20px; font-size: 14px; text-transform: uppercase; margin-top: 40px; letter-spacing: 1px;">SECTION 1: Ownership & Legal Identity</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; width: 35%; font-weight: bold; background: #fafafa; font-size: 12px;">Entity Type</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">${registration.entity?.type?.toUpperCase() || 'PRIVATE'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Full Legal Name</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px; font-weight: bold;">${primary.firstName} ${primary.lastName || ''}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Nationality</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">${primary.identity?.nationality || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Passport / Reg ID</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">${primary.identity?.passportNumber || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Place of Birth</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">${primary.birth?.place || 'N/A'} (DOB: ${primary.birth?.day}/${primary.birth?.month}/${primary.birth?.year})</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Full Address</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">${primary.address || ''}, ${primary.postCode || ''} ${primary.town || ''}, ${primary.country || ''}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Contact Methods</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">Email: ${primary.email || 'N/A'} | Phone: ${primary.phone || 'N/A'} | Mob: ${primary.mobile || 'N/A'}</td>
          </tr>
        </table>

        <h2 style="background: #0A1F44; color: #fff; padding: 12px 20px; font-size: 14px; text-transform: uppercase; margin-top: 30px; letter-spacing: 1px;">SECTION 2: Vessel Technical Specifications</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; width: 35%; font-weight: bold; background: #fafafa; font-size: 12px;">Vessel Name</td>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: 900; font-size: 14px; color: #0A1F44;">${vessel.name?.toUpperCase() || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Port of Choice</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">${vessel.portOfChoice || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">HIN / CIN Number</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px; font-weight: bold;">${vessel.hin || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Vessel Category</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">${vessel.category || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Hull Material</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">${vessel.hullMaterial || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Build Year / Country</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">Built in ${vessel.buildYear || 'N/A'} (${vessel.buildCountry || 'N/A'})</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Dimensions (m)</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">LOA: ${vessel.length}m | Beam: ${vessel.beam}m | Draft: ${vessel.draft}m</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Max Capacity</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px;">${vessel.capacity || 'N/A'} Persons</td>
          </tr>
        </table>

        <h2 style="background: #0A1F44; color: #fff; padding: 12px 20px; font-size: 14px; text-transform: uppercase; margin-top: 30px; letter-spacing: 1px;">SECTION 3: Propulsion & Engines</h2>
        ${engines.length > 0 ? engines.map((eng: any, idx: number) => `
          <div style="margin-top: 10px; border: 1px solid #eee; padding: 15px; background: #fafafa;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #C9A24A; font-size: 11px; text-transform: uppercase;">Engine Unit #${idx+1}</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 25%; font-size: 11px; color: #888;">Brand: <strong>${eng.brand}</strong></td>
                <td style="width: 35%; font-size: 11px; color: #888;">Serial: <strong>${eng.serialNumber}</strong></td>
                <td style="width: 20%; font-size: 11px; color: #888;">Power: <strong>${eng.power} HP</strong></td>
                <td style="width: 20%; font-size: 11px; color: #888;">Fuel: <strong>${eng.fuelType}</strong></td>
              </tr>
            </table>
          </div>
        `).join('') : '<p style="font-size: 12px; color: #888;">No engine data recorded for this vessel.</p>'}

        <h2 style="background: #0A1F44; color: #fff; padding: 12px 20px; font-size: 14px; text-transform: uppercase; margin-top: 30px; letter-spacing: 1px;">SECTION 4: Administrative & Financial Summary</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; width: 35%; font-weight: bold; background: #fafafa; font-size: 12px;">Service Tier</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px; font-weight: bold; color: #C9A24A;">${registration.registration?.speed?.toUpperCase()} PROCESSING</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Total Fee (EUR)</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 16px; font-weight: bold;">${registration.financial?.total} EUR</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Payment Status</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px; font-weight: bold; color: ${registration.financial?.status === 'paid' ? '#10b981' : '#f59e0b'};">
              ${registration.financial?.status?.toUpperCase() || 'PENDING'}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #eee; font-weight: bold; background: #fafafa; font-size: 12px;">Urgent Status</td>
            <td style="padding: 10px; border: 1px solid #eee; font-size: 12px; font-weight: bold; color: ${registration.system?.isUrgent ? '#ef4444' : '#888'};">
              ${registration.system?.isUrgent ? 'URGENT' : 'NORMAL'}
            </td>
          </tr>
        </table>

        <div style="margin-top: 60px; border-top: 2px solid #0A1F44; padding-top: 20px; text-align: center; font-size: 10px; color: #aaa; font-weight: bold;">
          THIS DOCUMENT IS A LEGALLY BINDING RECORD GENERATED BY OCEAN YACHT REGISTRATION SERVICES.<br/>
          CONFIDENTIALITY NOTICE: FOR ADMINISTRATIVE USE ONLY.
        </div>
      </div>
    `;

    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Export Word</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header+content+footer;
    
    const blob = new Blob([sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const fileDownload = document.createElement("a");
    fileDownload.href = url;
    fileDownload.download = `Registration_${orderId}.doc`;
    document.body.appendChild(fileDownload);
    fileDownload.click();
    setTimeout(() => {
      document.body.removeChild(fileDownload);
      URL.revokeObjectURL(url);
    }, 0);
  };

  const getCleanJson = () => {
    const primary = registration.entity?.primaryOwner?.details || {};
    const vessel = registration.registration?.vessel || {};
    return {
      recordInfo: {
        registrationId: registration.id,
        clientId: clientId,
        submissionDate: dateStr,
        processStatus: registration.registration?.status || 'PENDING'
      },
      owner: {
        firstName: primary.firstName || '',
        lastName: primary.lastName || '',
        nationality: primary.identity?.nationality || '',
        birth: {
          day: primary.birth?.day || '',
          month: primary.birth?.month || '',
          year: primary.birth?.year || '',
          placeOfBirth: primary.birth?.place || ''
        },
        identity: {
          passportNumber: primary.identity?.passportNumber || '',
          issueDate: primary.identity?.issueDate || '',
          expiryDate: primary.identity?.expiryDate || '',
          placeOfIssue: primary.identity?.placeOfIssue || ''
        },
        contact: {
          email: primary.email || '',
          phone: primary.phone || '',
          mobile: primary.mobile || ''
        },
        address: {
          street: primary.address || '',
          postCode: primary.postCode || '',
          town: primary.town || '',
          country: primary.country || ''
        }
      },
      vessel: {
        name: vessel.name || '',
        manufacturer: vessel.manufacturer || '',
        model: vessel.model || '',
        portOfChoice: vessel.portOfChoice || '',
        homePort: vessel.homePort || '',
        category: vessel.category || '',
        identification: {
          hin: vessel.hin || '',
          mmsi: vessel.mmsi || '',
          callsign: vessel.callsign || '',
          engineNumber: vessel.engineNumber || '',
          engines: engines.map((eng: any) => ({
            brand: eng.brand || '',
            serialNumber: eng.serialNumber || '',
            power: eng.power || '',
            fuelType: eng.fuelType || ''
          }))
        },
        specifications: {
          hullMaterial: vessel.hullMaterial || '',
          hullColor: vessel.hullColor || '',
          length: vessel.length || '',
          beam: vessel.beam || '',
          draft: vessel.draft || '',
          grossTonnage: vessel.grossTonnage || '',
          netTonnage: vessel.netTonnage || '',
          buildYear: vessel.buildYear || '',
          buildCountry: vessel.buildCountry || '',
          maxPassengers: vessel.capacity || ''
        }
      },
      financial: {
        totalFee: registration.financial?.total || 0,
        currency: 'EUR',
        paymentStatus: registration.financial?.status || 'unpaid'
      }
    };
  };

  const exportJson = (clean = false) => {
    const data = clean ? getCleanJson() : registration;
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", `Registration_${clean ? 'Clean_' : ''}${registration.id?.substring(0,8)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    setTimeout(() => {
      downloadAnchorNode.remove();
      URL.revokeObjectURL(url);
    }, 0);
  };

  const handleFullPrint = () => {
    window.print();
  };

  const handleEmailClient = () => {
    const primary = registration.entity?.primaryOwner?.details || {};
    const email = primary.email || '';
    const subject = `Update regarding your Boat Registration: #${orderId}PL`;
    const body = `Dear ${primary.firstName || 'Client'},\n\nWe are currently processing your registration request for the vessel "${registration.registration?.vessel?.name || 'N/A'}".\n\nBest regards,\nOcean Yacht Registration Team`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'registration_requests', registration.id), {
        'registration.status': newStatus,
        history: arrayUnion({
          timestamp: new Date().toISOString(),
          changes: `Process Status changed to: ${newStatus}`
        })
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePaymentStatusChange = async (newStatus: string) => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'registration_requests', registration.id), {
        'financial.status': newStatus,
        history: arrayUnion({
          timestamp: new Date().toISOString(),
          changes: `Payment Status changed to: ${newStatus}`
        })
      });
    } catch (err) {
      console.error("Failed to update payment status:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkUrgent = async () => {
    setIsSaving(true);
    const newVal = !registration.system?.isUrgent;
    try {
      await updateDoc(doc(db, 'registration_requests', registration.id), {
        'system.isUrgent': newVal,
        history: arrayUnion({
          timestamp: new Date().toISOString(),
          changes: newVal ? "Marked as URGENT" : "Urgent status removed"
        })
      });
    } catch (err) {
      console.error("Failed to update urgency:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  const handleActualPrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#f0f2f5] min-h-screen font-sans">
      <div className="bg-white border-b px-4 py-2 flex items-center gap-3 shadow-sm sticky top-0 z-50">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy font-bold text-[10px] uppercase tracking-widest rounded transition-all group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <span className="hover:text-navy cursor-pointer text-xs text-gray-400" onClick={onBack}>Registrations</span>
        <span className="text-gray-300 text-xs">/</span>
        <span className="text-navy font-bold text-xs">{clientId}</span>
        <span className="text-[10px] text-gray-300 ml-auto font-mono">{dateStr}</span>
      </div>

      <div className="w-full mx-auto p-4 flex flex-col lg:flex-row gap-6">
        {/* Main Content (Left) */}
        <div className="flex-1 space-y-4">
          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
            <div className="flex flex-wrap gap-2">
              <div onClick={handlePrint} className="bg-navy text-white px-5 py-2 text-xs font-bold rounded cursor-pointer hover:bg-navy/90 flex items-center gap-2"><Printer className="w-4 h-4" /> PRINT PREVIEW</div>
              <div onClick={handleEmailClient} className="bg-[#424242] text-white px-5 py-2 text-xs font-bold rounded cursor-pointer hover:bg-[#333] flex items-center gap-2"><Mail className="w-4 h-4" /> EMAIL CLIENT</div>
              <Dropdown trigger={<div className="bg-gold text-navy px-5 py-2 font-bold text-xs rounded cursor-pointer hover:bg-gold/90 flex items-center gap-2"><Download className="w-4 h-4" /> EXPORT <ChevronDown className="w-3 h-3" /></div>}>
                <DropdownItem onClick={downloadWord}><FileType className="w-4 h-4 text-blue-600" /> Word (.doc)</DropdownItem>
                <DropdownItem onClick={handlePrint}><FileCode className="w-4 h-4 text-red-600" /> PDF (Print)</DropdownItem>
                <DropdownItem onClick={() => exportJson(false)}><FileText className="w-4 h-4 text-gray-600" /> Full System JSON</DropdownItem>
                <DropdownItem onClick={() => exportJson(true)}><FileCode className="w-4 h-4 text-purple-600" /> Clean Record JSON</DropdownItem>
              </Dropdown>
              <div onClick={generateOwnershipPdf} className="bg-navy text-white px-5 py-2 text-xs font-bold rounded cursor-pointer hover:bg-navy/90 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" /> GENERATE PDF
              </div>
              <div onClick={generateOwnershipDoc} className="bg-blue-700 text-white px-5 py-2 text-xs font-bold rounded cursor-pointer hover:bg-blue-800 flex items-center gap-2">
                <FileType className="w-4 h-4 text-white" /> GENERATE WORD
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs gap-2">
                    <FileText className="w-4 h-4" /> SAVE CHANGES
                  </Button>
                  <Button onClick={handleCancel} variant="ghost" className="text-gray-500 font-bold text-xs underline">
                    CANCEL
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit} variant="ghost" className="text-gold hover:text-gold/80 font-bold text-xs tracking-widest gap-2">
                  <FileText className="w-4 h-4" /> EDIT RECORD
                </Button>
              )}
            </div>
          </div>

        {/* Client Information */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="bg-[#5a6a5a] text-white px-3 py-1.5 text-[10px] font-bold tracking-widest flex justify-between">
            <span>CLIENT DATA — {isCompany ? 'COMPANY ENTITY' : 'PRIVATE'}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{clientId}</span>
          </div>
          <table className="w-full border-collapse"><tbody>
            <Row label={isCompany ? "First Name / Company" : "First Name"} value={primary.firstName} path="entity.primaryOwner.details.firstName" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Last Name" value={primary.lastName} path="entity.primaryOwner.details.lastName" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Nationality" value={primary.identity?.nationality} path="entity.primaryOwner.details.identity.nationality" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Passport / ID" value={primary.identity?.passportNumber} path="entity.primaryOwner.details.identity.passportNumber" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="DOB Day" value={primary.birth?.day} path="entity.primaryOwner.details.birth.day" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="DOB Month" value={primary.birth?.month} path="entity.primaryOwner.details.birth.month" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="DOB Year" value={primary.birth?.year} path="entity.primaryOwner.details.birth.year" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Place of Birth" value={primary.birth?.place} path="entity.primaryOwner.details.birth.place" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Address" value={primary.address} path="entity.primaryOwner.details.address" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Post Code" value={primary.postCode} path="entity.primaryOwner.details.postCode" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Town" value={primary.town} path="entity.primaryOwner.details.town" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Country" value={primary.country} path="entity.primaryOwner.details.country" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Email" value={primary.email} path="entity.primaryOwner.details.email" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Telephone" value={primary.phone} path="entity.primaryOwner.details.phone" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Mobile" value={primary.mobile} path="entity.primaryOwner.details.mobile" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Job Title" value={primary.jobTitle} path="entity.primaryOwner.details.jobTitle" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="ID Issue Date" value={primary.identity?.issueDate} path="entity.primaryOwner.details.identity.issueDate" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="ID Expiry Date" value={primary.identity?.expiryDate} path="entity.primaryOwner.details.identity.expiryDate" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Place of Issue" value={primary.identity?.placeOfIssue} path="entity.primaryOwner.details.identity.placeOfIssue" isEditing={isEditing} editData={editData} setEditData={setEditData} />
          </tbody></table>
        </div>

        {/* Registration Information */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="bg-[#5a6a5a] text-white px-3 py-1.5 text-[10px] font-bold tracking-widest flex justify-between">
            <span>REGISTRATION INFORMATION</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{registration.registration?.serviceId?.toUpperCase() || 'NEW FLAG'}</span>
          </div>
          <table className="w-full border-collapse"><tbody>
            <Row 
              label="Service Type" 
              value={[
                { label: 'New Flag Registration', value: 'new_flag' },
                { label: 'Change of Ownership (350 EUR)', value: 'change_owner' },
                { label: 'Modification Polish Reg (249 EUR)', value: 'modification' },
                { label: 'Polish Deletion Certificate (249 EUR)', value: 'deletion' },
                { label: 'Duplicate Polish registration (249 EUR)', value: 'duplicate' }
              ].find(o => o.value === registration.registration?.serviceId)?.label || registration.registration?.serviceId || 'New Flag'} 
              path="registration.serviceId" 
              isEditing={isEditing} 
              editData={editData} 
              setEditData={setEditData}
              options={[
                { label: 'New Flag Registration', value: 'new_flag' },
                { label: 'Change of Ownership (350 EUR)', value: 'change_owner' },
                { label: 'Modification Polish Reg (249 EUR)', value: 'modification' },
                { label: 'Polish Deletion Certificate (249 EUR)', value: 'deletion' },
                { label: 'Duplicate Polish registration (249 EUR)', value: 'duplicate' }
              ]}
            />
            <Row 
              label="Boat Size" 
              value={[
                { label: '0 to 7 Meters (350 EUR)', value: '0_to_7' },
                { label: '7.1 to 12 Meters (450 EUR)', value: '7_to_12' },
                { label: '12.1 to 24 Meters (550 EUR)', value: '12_to_24' }
              ].find(o => o.value === registration.registration?.logistics?.vesselClass)?.label || registration.registration?.logistics?.vesselClass} 
              path="registration.logistics.vesselClass" 
              isEditing={isEditing} 
              editData={editData} 
              setEditData={setEditData}
              options={[
                { label: '0 to 7 Meters (350 EUR)', value: '0_to_7' },
                { label: '7.1 to 12 Meters (450 EUR)', value: '7_to_12' },
                { label: '12.1 to 24 Meters (550 EUR)', value: '12_to_24' }
              ]}
            />
            <Row 
              label="Registration Time" 
              value={[
                { label: 'Standard (0 EUR)', value: 'standard' },
                { label: 'Fast (50 EUR)', value: 'fast' },
                { label: 'Express (90 EUR)', value: 'express' }
              ].find(o => o.value === registration.registration?.logistics?.speed)?.label || registration.registration?.logistics?.speed} 
              path="registration.logistics.speed" 
              isEditing={isEditing} 
              editData={editData} 
              setEditData={setEditData}
              options={[
                { label: 'Standard (0 EUR)', value: 'standard' },
                { label: 'Fast (50 EUR)', value: 'fast' },
                { label: 'Express (90 EUR)', value: 'express' }
              ]}
            />
            <Row 
              label="Registration Type" 
              value={[
                { label: 'Private / Recreational', value: 'private' },
                { label: 'Bareboat', value: 'bareboat' },
                { label: 'Commercial', value: 'commercial' }
              ].find(o => o.value === registration.registration?.logistics?.usageIntent)?.label || registration.registration?.logistics?.usageIntent} 
              path="registration.logistics.usageIntent" 
              isEditing={isEditing} 
              editData={editData} 
              setEditData={setEditData}
              options={[
                { label: 'Private / Recreational', value: 'private' },
                { label: 'Bareboat', value: 'bareboat' },
                { label: 'Commercial', value: 'commercial' }
              ]}
            />
            <Row 
              label="Delivery Info" 
              value={[
                { label: 'Standard Mail (15 EUR)', value: 'standard' },
                { label: 'DHL Express (50 EUR)', value: 'dhl' }
              ].find(o => o.value === registration.registration?.logistics?.shippingMethod)?.label || registration.registration?.logistics?.shippingMethod} 
              path="registration.logistics.shippingMethod" 
              isEditing={isEditing} 
              editData={editData} 
              setEditData={setEditData}
              options={[
                { label: 'Standard Mail (15 EUR)', value: 'standard' },
                { label: 'DHL Express (50 EUR)', value: 'dhl' }
              ]}
            />
            <Row 
              label="Optional Service" 
              value={[
                { label: 'Without MMSI (0 EUR)', value: 'none' },
                { label: 'MMSI - Has License (149 EUR)', value: 'mmsi_license' },
                { label: 'MMSI - Appointed (149 EUR)', value: 'mmsi_appointed' },
                { label: 'MMSI - Company (149 EUR)', value: 'mmsi_company' }
              ].find(o => o.value === registration.registration?.logistics?.mmsiConfig)?.label || registration.registration?.logistics?.mmsiConfig} 
              path="registration.logistics.mmsiConfig" 
              isEditing={isEditing} 
              editData={editData} 
              setEditData={setEditData}
              options={[
                { label: 'Without MMSI (0 EUR)', value: 'none' },
                { label: 'MMSI - Has License (149 EUR)', value: 'mmsi_license' },
                { label: 'MMSI - Appointed (149 EUR)', value: 'mmsi_appointed' },
                { label: 'MMSI - Company (149 EUR)', value: 'mmsi_company' }
              ]}
            />
          </tbody></table>
        </div>

        {/* Vessel Information */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="bg-[#5a6a5a] text-white px-3 py-1.5 text-[10px] font-bold tracking-widest flex justify-between">
            <span>VESSEL OVERVIEW — {vessel.name || 'N/A'}</span>
            <span className="bg-gold/80 text-navy px-2 py-0.5 rounded text-[10px] font-bold">ACTIVE REGISTRATION</span>
          </div>
          <table className="w-full border-collapse"><tbody>
            <Row label="Boat Name" value={vessel.name} path="registration.vessel.name" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Manufacturer" value={vessel.manufacturer} path="registration.vessel.manufacturer" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Model" value={vessel.model} path="registration.vessel.model" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row 
              label="Port of Choice" 
              value={vessel.portOfChoice} 
              path="registration.vessel.portOfChoice" 
              isEditing={isEditing} 
              editData={editData} 
              setEditData={setEditData}
              options={[
                { label: 'GDANSK', value: 'GDANSK' },
                { label: 'Gdynia', value: 'Gdynia' },
                { label: 'Świnoujście', value: 'Świnoujście' },
                { label: 'Szczecin', value: 'Szczecin' },
                { label: 'Kołobrzeg', value: 'Kołobrzeg' },
                { label: 'Sopot', value: 'Sopot' },
                { label: 'Wolin', value: 'Wolin' },
                { label: 'Hel', value: 'Hel' },
                { label: 'Jastarnia', value: 'Jastarnia' },
                { label: 'Darłowo', value: 'Darłowo' },
                { label: 'Dąbki', value: 'Dąbki' },
                { label: 'Krynica Morska', value: 'Krynica Morska' },
                { label: 'Dziwnów', value: 'Dziwnów' },
                { label: 'Chałupy', value: 'Chałupy' }
              ]}
            />
            <Row label="Home Port" value={vessel.homePort} path="registration.vessel.homePort" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Vessel Category" value={vessel.category} path="registration.vessel.category" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Hull Material" value={vessel.hullMaterial} path="registration.vessel.hullMaterial" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Hull Color" value={vessel.hullColor} path="registration.vessel.hullColor" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Length (m)" value={vessel.length} path="registration.vessel.length" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Beam (m)" value={vessel.beam} path="registration.vessel.beam" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Draft (m)" value={vessel.draft} path="registration.vessel.draft" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Gross Tonnage" value={vessel.grossTonnage} path="registration.vessel.grossTonnage" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Net Tonnage" value={vessel.netTonnage} path="registration.vessel.netTonnage" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Build Year" value={vessel.buildYear} path="registration.vessel.buildYear" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Country of Build" value={vessel.buildCountry} path="registration.vessel.buildCountry" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Max Passengers" value={vessel.capacity} path="registration.vessel.capacity" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="HIN / CIN" value={vessel.hin} path="registration.vessel.hin" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="MMSI Number" value={vessel.mmsi} path="registration.vessel.mmsi" isEditing={isEditing} editData={editData} setEditData={setEditData} />
            <Row label="Radio Callsign" value={vessel.callsign} path="registration.vessel.callsign" isEditing={isEditing} editData={editData} setEditData={setEditData} />
          </tbody></table>
        </div>

        {/* Engines */}
        {engines.length > 0 && (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="bg-[#5a6a5a] text-white px-4 py-2.5 text-xs font-bold tracking-widest">ENGINES & PROPULSION</div>
            {engines.map((eng: any, i: number) => (
              <div key={i} className={i > 0 ? "border-t-2" : ""}>
                <div className="bg-gold/10 px-4 py-1.5 text-[10px] font-bold text-gold uppercase tracking-widest">Engine #{i+1}</div>
                <table className="w-full border-collapse"><tbody>
                  <Row label="Brand" value={eng.brand} />
                  <Row label="Serial Number" value={eng.serialNumber} />
                  <Row label="Power (HP)" value={eng.power} />
                  <Row label="Fuel Type" value={eng.fuelType} />
                </tbody></table>
              </div>
            ))}
          </div>
        )}

        {/* Financial */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="bg-[#5a6a5a] text-white px-4 py-2.5 text-xs font-bold tracking-widest">FINANCIAL SUMMARY</div>
          <table className="w-full border-collapse"><tbody>
            <Row label="Service Package" value={`${registration.registration?.speed || ''} Processing`} />
            <Row label="Payment Status" value={<span className={`text-xs font-bold px-2 py-0.5 rounded ${registration.financial?.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{registration.financial?.status?.toUpperCase()}</span>} />
          </tbody></table>
          <div className="bg-green-50 px-4 py-3 flex justify-between items-center border-t">
            <span className="text-sm font-black text-navy uppercase">Total Amount</span>
            <span className="text-xl font-black text-green-700">{registration.financial?.total} EUR</span>
          </div>
        </div>

        </div>

        {/* Admin Panel (Right) */}
        <div className="w-full lg:w-80 shrink-0 space-y-4 print:hidden">
          {/* Order Controls */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="bg-navy text-white px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase">Order Control</div>
            <div className="p-4 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Process Status</span>
                <select 
                  disabled={!isEditing}
                  value={registration.registration?.status} 
                  onChange={(e) => handleStatusChange(e.target.value)} 
                  className={`block w-full text-xs font-bold p-2 border rounded bg-white text-navy ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {statusOptions.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Payment Status</span>
                <select 
                  disabled={!isEditing}
                  value={registration.financial?.status} 
                  onChange={(e) => handlePaymentStatusChange(e.target.value)} 
                  className={`block w-full text-xs font-bold p-2 border rounded bg-white text-navy ${!isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {paymentStatusOptions.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <Button 
                onClick={handleMarkUrgent} 
                disabled={isSaving || !isEditing} 
                className={`w-full ${registration.system?.isUrgent ? 'bg-navy' : 'bg-red-600'} text-white text-[10px] font-bold h-8 ${!isEditing ? 'opacity-50' : ''}`}
              >
                {registration.system?.isUrgent ? 'REMOVE URGENT' : 'MARK URGENT'}
              </Button>
            </div>
          </div>

          {/* Admin Comments */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="bg-navy text-white px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase flex justify-between items-center">
              <span>Admin Comments</span>
              {isEditing && (
                <button onClick={saveAdminComments} className="text-[9px] bg-gold text-navy px-2 py-0.5 rounded hover:bg-gold/90 transition-colors">SAVE NOTE</button>
              )}
            </div>
            <div className="p-4">
              <textarea 
                disabled={!isEditing}
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                placeholder={isEditing ? "Type internal notes here..." : "No internal notes yet."}
                className={`w-full h-32 p-3 text-xs font-medium border rounded-lg bg-gray-50 outline-none transition-all resize-none ${!isEditing ? 'opacity-70 text-gray-400' : 'focus:bg-white focus:ring-1 focus:ring-navy/20'}`}
              />
            </div>
          </div>

          {/* Record Data JSON Preview */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 text-[10px] font-bold text-gray-600 tracking-widest uppercase flex justify-between items-center">
              <span>Data Preview (JSON)</span>
              <button 
                onClick={() => navigator.clipboard.writeText(JSON.stringify(getCleanJson(), null, 2))}
                className="text-[9px] text-navy hover:underline"
              >
                COPY
              </button>
            </div>
            <div className="p-3 bg-navy/[0.02]">
              <pre className="text-[10px] font-mono text-gray-600 overflow-x-auto">
                {JSON.stringify(getCleanJson(), null, 2)}
              </pre>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border shadow-sm p-4 space-y-3">
             <div className="flex justify-between items-center pb-2 border-b">
               <span className="text-[9px] font-bold text-gray-400 uppercase">Revenue</span>
               <span className="text-sm font-black text-green-600">{registration.financial?.total}€</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-[9px] font-bold text-gray-400 uppercase">Record Date</span>
               <span className="text-[10px] font-bold text-navy">{dateStr}</span>
             </div>
          </div>

          {/* History Panel */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col">
            <div className="bg-navy text-white px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-gold" />
              <span>Edit History Log</span>
            </div>
            <div className="p-4 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
              {registration.history?.length > 0 ? (
                <div className="space-y-4">
                  {[...registration.history].reverse().map((e: any, i: number) => (
                    <div key={i} className="relative pl-5 border-l-2 border-gray-100 last:border-0 pb-1">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-gold ring-4 ring-white" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-navy uppercase opacity-60">
                          {new Date(e.timestamp).toLocaleString('en-GB', { 
                            day: '2-digit', 
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <p className="text-[11px] font-medium text-gray-700 leading-tight mt-0.5">
                          {e.changes}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-gray-100 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-gray-300 uppercase">No history records yet</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-2.5 border-t text-center">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Automated Audit Trail Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 print:p-0 print:static print:bg-white print:backdrop-none overflow-y-auto">
          <div className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative flex flex-col print:shadow-none print:w-full print:m-0">
            {/* Modal Controls */}
            <div className="sticky top-0 bg-navy text-white p-4 flex justify-between items-center z-10 print:hidden">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gold" />
                <span className="font-bold tracking-tight">Official Document Preview</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleActualPrint} className="bg-gold hover:bg-gold/90 text-navy font-bold gap-2">
                  <Printer className="w-4 h-4" /> PRINT NOW
                </Button>
                <Button onClick={() => setShowPrintPreview(false)} variant="ghost" className="text-white hover:bg-white/10">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Document Content */}
            <div id="print-document-content" className="p-[20mm] text-black bg-white flex-1 font-sans">
               {/* Formal Header */}
               <div className="flex justify-between items-start border-b-2 border-navy pb-8 mb-10">
                  <div>
                    <Logo className="h-16 w-auto mb-4" />
                    <h1 className="text-2xl font-black text-navy uppercase tracking-tighter">Registration Certificate</h1>
                    <p className="text-sm text-gray-600 font-bold">Ocean Yacht Registration Services</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-navy text-white px-4 py-2 font-bold mb-2">OFFICIAL RECORD</div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Order Reference</p>
                    <p className="text-lg font-black text-navy">{orderId}</p>
                    <p className="text-xs text-gray-400 mt-1">Date Issued: {new Date().toLocaleDateString('en-GB')}</p>
                  </div>
               </div>

               {/* Section: Ownership */}
               <div className="mb-12">
                  <div className="flex items-center gap-2 mb-4 border-l-4 border-gold pl-3">
                    <User className="w-5 h-5 text-navy" />
                    <h2 className="text-sm font-black text-navy uppercase tracking-widest">Ownership & Legal Entity</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12 ml-4">
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Entity Type</p>
                       <p className="text-sm font-bold border-b border-gray-100 pb-1">{registration.entity?.type?.toUpperCase() || 'PRIVATE'}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{isCompany ? 'Company Name' : 'Primary Owner'}</p>
                       <p className="text-sm font-bold border-b border-gray-100 pb-1">
                          {registration.entity?.primaryOwner?.details?.firstName} {registration.entity?.primaryOwner?.details?.lastName}
                       </p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Nationality</p>
                       <p className="text-sm font-bold border-b border-gray-100 pb-1">{registration.entity?.primaryOwner?.details?.identity?.nationality || 'Not specified'}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Passport / Reg Number</p>
                       <p className="text-sm font-bold border-b border-gray-100 pb-1">{registration.entity?.primaryOwner?.details?.identity?.passportNumber || 'N/A'}</p>
                    </div>
                  </div>
               </div>

               {/* Section: Contact */}
               <div className="mb-12">
                  <div className="flex items-center gap-2 mb-4 border-l-4 border-gold pl-3">
                    <FileText className="w-5 h-5 text-navy" />
                    <h2 className="text-sm font-black text-navy uppercase tracking-widest">Contact & Logistics</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12 ml-4">
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Email Address</p>
                       <p className="text-sm font-bold border-b border-gray-100 pb-1">{registration.entity?.primaryOwner?.details?.email}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Phone Number</p>
                       <p className="text-sm font-bold border-b border-gray-100 pb-1">{registration.entity?.primaryOwner?.details?.phone}</p>
                    </div>
                    <div className="col-span-2">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Full Legal Address</p>
                       <p className="text-sm font-bold border-b border-gray-100 pb-1">
                          {registration.entity?.primaryOwner?.details?.address}, {registration.entity?.primaryOwner?.details?.postCode} {registration.entity?.primaryOwner?.details?.town}, {registration.entity?.primaryOwner?.details?.country}
                       </p>
                    </div>
                  </div>
               </div>

               {/* Section: Vessel */}
               <div className="mb-12">
                  <div className="flex items-center gap-2 mb-4 border-l-4 border-gold pl-3">
                    <Shield className="w-5 h-5 text-navy" />
                    <h2 className="text-sm font-black text-navy uppercase tracking-widest">Vessel Specification</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-y-6 gap-x-8 ml-4">
                    <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Vessel Name</p>
                       <p className="text-base font-black text-navy">{registration.registration?.vessel?.name}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Port of Choice</p>
                       <p className="text-base font-black text-navy">{registration.registration?.vessel?.portOfChoice}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">HIN / Hull ID</p>
                       <p className="text-base font-black text-navy">{registration.registration?.vessel?.hin}</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Length Overall</p>
                       <p className="text-base font-black text-navy">{registration.registration?.vessel?.length} Meters</p>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Personnel Limit</p>
                       <p className="text-base font-black text-navy">{registration.registration?.vessel?.capacity} Person(s)</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Status</p>
                       <p className="text-base font-black text-green-600">{registration.registration?.status?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
               </div>

               {/* Formal Footer */}
               <div className="mt-auto pt-10 border-t border-gray-100 flex justify-between items-end">
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                     Verified Digital Copy â€¢ Ocean Yacht Registration Services
                  </div>
                  <div className="w-24 h-24 bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-300 text-center p-2">
                     OFFICIAL STAMP AREA
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
