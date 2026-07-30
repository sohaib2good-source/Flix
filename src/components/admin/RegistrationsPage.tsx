import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Anchor, Trash2, Search, AlertTriangle, Clock, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import RegistrationDetails from '../RegistrationDetails';
import { parseFirebaseDate, formatFirebaseDate } from '../../utils/dateUtils';
interface Props {
  recordId?: string | null;
}

export default function RegistrationsPage({ recordId }: Props) {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Deletion Protection State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteCountdown, setDeleteCountdown] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'registration_requests'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort oldest first for sequential numbering, then reverse for display
      data.sort((a: any, b: any) => {
        const dateA = parseFirebaseDate(a.system?.serverTimestamp) || parseFirebaseDate(a.createdAt);
        const dateB = parseFirebaseDate(b.system?.serverTimestamp) || parseFirebaseDate(b.createdAt);
        const timeA = dateA ? dateA.getTime() : 0;
        const timeB = dateB ? dateB.getTime() : 0;
        return timeA - timeB;
      });
      // Assign Client IDs: CYYMMDD#PL
      const dayCounts: Record<string, number> = {};
      data.forEach((r: any) => {
        const d = parseFirebaseDate(r.system?.serverTimestamp) || parseFirebaseDate(r.createdAt);
        if (d) {
          const key = `${String(d.getFullYear()).slice(-2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
          dayCounts[key] = (dayCounts[key] || 0) + 1;
          r.clientId = `C${key}${dayCounts[key]}PL`;
        } else {
          r.clientId = `C000000${Object.keys(dayCounts).length + 1}PL`;
        }
      });
      // Reverse for display (newest first)
      data.reverse();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerDelete = (id: string) => {
    setDeleteConfirmId(id);
    setDeleteCountdown(5);
  };

  useEffect(() => {
    let timer: any;
    if (deleteCountdown > 0) {
      timer = setTimeout(() => setDeleteCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [deleteCountdown]);

  const confirmDelete = async () => {
    if (!deleteConfirmId || deleteCountdown > 0) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'registration_requests', deleteConfirmId));
      setRegistrations(registrations.filter(r => r.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting registration:", error);
      alert("Failed to delete registration");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
    setDeleteCountdown(0);
  };

  const handleUpdateRegistration = async (id: string, updatedData: any) => {
    try {
      await updateDoc(doc(db, 'registration_requests', id), updatedData);
      setRegistrations(registrations.map(r => r.id === id ? { ...r, ...updatedData } : r));
    } catch (error) {
      console.error("Error updating registration:", error);
      alert("Failed to update registration");
    }
  };

  const filtered = registrations.filter(r => {
    const name = `${r.entity?.primaryOwner?.details?.firstName || r.personal?.details?.firstName || ''} ${r.entity?.primaryOwner?.details?.lastName || r.personal?.details?.lastName || ''}`.toLowerCase();
    const email = (r.entity?.primaryOwner?.details?.email || r.personal?.details?.email || '').toLowerCase();
    const vessel = (r.registration?.vessel?.name || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || email.includes(term) || vessel.includes(term);
  });

  // ── Detail View (URL: /admin/registrations/:id) ──
  if (recordId) {
    const selectedRegistration = registrations.find(r => r.id === recordId);

    if (loading) {
      return (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-2 border-navy/20 border-t-navy rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading record...</p>
        </div>
      );
    }

    if (!selectedRegistration) {
      return (
        <div className="p-16 text-center">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-muted-foreground font-bold mb-1">Record not found</p>
          <p className="text-sm text-gray-400 mb-6">The registration ID "{recordId}" does not exist.</p>
          <Button onClick={() => navigate('/admin/registrations')} className="bg-navy text-white">
            Back to Registrations
          </Button>
        </div>
      );
    }

    return (
      <RegistrationDetails
        registration={selectedRegistration}
        onBack={() => navigate('/admin/registrations')}
        onUpdate={(data: any) => handleUpdateRegistration(selectedRegistration.id, data)}
      />
    );
  }

  // ── List View (URL: /admin/registrations) ──
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center">
            <Anchor className="w-6 h-6 text-navy" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-navy tracking-tight uppercase">Registration Requests</h1>
            <p className="text-muted-foreground font-medium">
              Client submissions from the registration form — view, manage, and export records.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Requests</p>
          <p className="text-3xl font-black text-navy">{registrations.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <p className="text-3xl font-black text-green-600">
            {registrations.reduce((sum, r) => sum + (parseFloat(r.financial?.total) || 0), 0).toLocaleString()}€
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">This Month</p>
          <p className="text-3xl font-black text-navy">
            {registrations.filter(r => {
              const d = parseFirebaseDate(r.system?.serverTimestamp) || parseFirebaseDate(r.createdAt);
              if (!d) return false;
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Showing</p>
          <p className="text-3xl font-black text-navy">{filtered.length}</p>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          <input
            type="text"
            placeholder="Search by client name, email, or vessel name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-navy/10 focus:border-navy/20 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[2rem] shadow-2xl shadow-navy/5 border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-navy/20 border-t-navy rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">Loading registrations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold mb-1">No registrations found</p>
            <p className="text-sm text-gray-400">
              {searchTerm ? 'Try a different search term' : 'Registrations will appear here when clients submit forms'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Client ID</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Client</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Contact</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Type</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Price</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Date</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-navy/[0.02] transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/registrations/${r.id}`)}
                  >
                    <td className="p-5">
                      <span className="font-mono font-bold text-navy text-sm">{r.clientId}</span>
                    </td>
                    <td className="p-5">
                      <span className="font-medium text-navy block">
                        {r.entity?.primaryOwner?.details?.firstName || r.personal?.details?.firstName || 'Unknown'}{' '}
                        {r.entity?.primaryOwner?.details?.lastName || r.personal?.details?.lastName || ''}
                      </span>
                      {r.registration?.vessel?.name && (
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Anchor className="w-3 h-3" /> {r.registration.vessel.name}
                        </span>
                      )}
                    </td>
                    <td className="p-5">
                      <span className="block text-sm">{r.entity?.primaryOwner?.details?.email || r.personal?.details?.email}</span>
                      <span className="block text-xs text-gray-400">{r.entity?.primaryOwner?.details?.phone || r.personal?.details?.phone}</span>
                    </td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold capitalize">
                        {r.registration?.serviceId?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-5 font-bold text-green-600">{r.financial?.total}€</td>
                    <td className="p-5 text-sm text-gray-400">
                      {formatFirebaseDate(r.system?.serverTimestamp || r.createdAt)}
                    </td>
                    <td className="p-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="border-navy text-navy hover:bg-navy/5 font-bold" onClick={() => navigate(`/admin/registrations/${r.id}`)}>
                          View
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => triggerDelete(r.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Deletion Security Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-red-100"
            >
              <div className="bg-red-50 p-6 flex items-center gap-4 border-b border-red-100">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-900 uppercase tracking-tight">Security Protocol</h3>
                  <p className="text-red-600/70 text-xs font-bold uppercase tracking-widest">Authorized Access Only</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-700 font-medium mb-6 leading-relaxed">
                  You are about to <span className="text-red-600 font-bold underline">permanently erase</span> this registration record. This data cannot be recovered once purged.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 font-medium text-sm uppercase tracking-wider">
                    <Clock className="w-4 h-4" /> Security Timer
                  </div>
                  <div className={`text-2xl font-black ${deleteCountdown > 0 ? 'text-navy' : 'text-green-600'} transition-colors`}>
                    0:0{deleteCountdown}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={confirmDelete}
                    disabled={deleteCountdown > 0 || isDeleting}
                    variant="destructive"
                    className="w-full h-12 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-red-200 disabled:opacity-50 disabled:grayscale transition-all"
                  >
                    {isDeleting ? 'PURGING DATA...' : (deleteCountdown > 0 ? `WAIT ${deleteCountdown}S` : 'CONFIRM DELETION')}
                  </Button>
                  <Button
                    onClick={cancelDelete}
                    variant="ghost"
                    className="w-full h-12 rounded-xl font-bold text-gray-400 hover:text-navy hover:bg-gray-50 transition-all"
                  >
                    ABORT REQUEST
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
