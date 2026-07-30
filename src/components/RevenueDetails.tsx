import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function RevenueDetails({ registration, onBack }: { registration: any, onBack: () => void }) {
  const defaultRev = registration.revenue || {};
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string}|null>(null);

  const defaultTotal = registration.totalPriceEur || 525;

  const [rev, setRev] = useState({
    dealer: defaultRev.dealer || '',
    dealerCommission: defaultRev.dealerCommission || 0,
    commissionStatus: defaultRev.commissionStatus || 'Pending',
    paymentMethod: defaultRev.paymentMethod || 'PayPal',
    amount: defaultRev.amount ?? defaultTotal,
    partnerCommission: defaultRev.partnerCommission || 0,
    flagCost: defaultRev.flagCost || 0,
    dhlCost: defaultRev.dhlCost || 0,
    extraCost: defaultRev.extraCost || 0,
    serviceFees: defaultRev.serviceFees || 0,
    bankCommission: defaultRev.bankCommission || 0,
    facFees: defaultRev.facFees || 0,
    paypalFees: defaultRev.paypalFees || 0,
    total: defaultRev.total ?? defaultTotal,
  });

  const handleSave = async () => {
    setIsSaving(true);
    setMsg(null);
    try {
      // Enterprise safety logic: Timeout after 10s if db hangs
      const saveReq = updateDoc(doc(db, 'registration_requests', registration.id), {
        revenue: rev
      });
      await Promise.race([
        saveReq,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout: Could not save to database. Check internet.')), 10000))
      ]);
      setMsg({ type: 'success', text: 'Revenue metrics properly updated and synced with database.' });
      setTimeout(() => setMsg(null), 3000);
    } catch(err: any) {
      setMsg({ type: 'error', text: 'Save failed: ' + err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (key: string, val: string | number) => {
    setRev(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="bg-[#f5f5f5] min-h-full font-sans p-2 sm:p-6 rounded-lg -m-8">
      <div className="bg-white p-4 border-b mb-6 flex items-center gap-4 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-navy/5 hover:bg-navy/10 text-navy font-bold text-xs uppercase tracking-widest rounded-lg transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-navy cursor-pointer transition-colors" onClick={onBack}>Revenue</span>
          <span>/</span>
          <span className="text-navy font-bold">{registration.id.substring(0,8).toUpperCase()}PL</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {msg && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-medium border shadow-sm ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {msg.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Left Block */}
          <div className="w-full lg:w-[350px] bg-[#ebebeb] p-1 rounded">
             <div className="bg-[#e0e0e0] p-4 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-4 mt-2">
                  <span className="text-gray-500 text-sm tracking-wide">Dealer</span>
                  <select className="border-gray-200 rounded text-sm w-32 bg-white shadow-inner h-8 px-1" value={rev.dealer} onChange={e => updateField('dealer', e.target.value)}>
                    <option value="">None</option>
                  </select>
                </div>

                <div className="w-full flex items-center justify-between mb-4">
                  <span className="text-gray-500 text-sm tracking-wide">Dealer Commission</span>
                  <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm" value={rev.dealerCommission} onChange={e => updateField('dealerCommission', parseFloat(e.target.value) || 0)} />
                </div>
                
                <div className="w-full flex items-center justify-between mb-4 border-b border-gray-300 pb-4">
                  <span className="text-gray-500 text-sm tracking-wide">Commission Status</span>
                  <select className="border-gray-200 rounded text-sm w-24 bg-white shadow-inner h-8 px-1" value={rev.commissionStatus} onChange={e => updateField('commissionStatus', e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div className="w-full flex items-center justify-between mb-8">
                  <span className="text-gray-700 text-sm font-medium">Total Commission</span>
                  <span className="text-gray-500 font-medium">{Number(rev.dealerCommission).toFixed(2)} EUR</span>
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white w-24 rounded-sm tracking-wide font-medium shadow-sm h-9 self-start px-0">
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
             </div>
          </div>

          {/* Right Block */}
          <div className="flex-1 w-full bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <div className="bg-[#424242] text-white px-4 py-3 flex justify-between items-center text-sm font-semibold tracking-wide">
               <span>Revenue</span>
               <span className="text-gray-300 font-normal hover:text-white cursor-pointer uppercase text-xs">edit</span>
            </div>

            <div className="p-8 pb-12 max-w-2xl bg-white">
              <div className="space-y-4">
                
                <div className="flex items-center pb-2 border-b border-gray-100">
                   <div className="w-[200px] text-gray-500 text-sm">Payment Method:</div>
                   <select className="border border-gray-200 rounded p-1 text-sm bg-white shadow-inner w-32" value={rev.paymentMethod} onChange={e => updateField('paymentMethod', e.target.value)}>
                     <option value="PayPal">PayPal</option>
                     <option value="Stripe">Stripe</option>
                     <option value="Bank">Bank</option>
                     <option value="Cash">Cash</option>
                   </select>
                </div>

                <div className="flex items-center pb-2 border-b border-gray-100">
                   <div className="w-[200px] text-gray-500 text-sm">Amount:</div>
                   <div className="flex items-center gap-4 w-40">
                     <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm" value={rev.amount} onChange={e => updateField('amount', parseFloat(e.target.value) || 0)} />
                     <span className="text-sm text-gray-500">EUR</span>
                   </div>
                </div>

                <div className="flex items-center pb-2 border-b border-gray-100">
                   <div className="w-[200px] text-gray-500 text-sm">Partner Commission:</div>
                   <div className="flex items-center gap-4 w-40">
                     <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm" value={rev.partnerCommission} onChange={e => updateField('partnerCommission', parseFloat(e.target.value) || 0)} />
                     <span className="text-sm text-gray-500">EUR</span>
                   </div>
                </div>

                <div className="flex items-center pb-2 border-b border-gray-100">
                   <div className="w-[200px] text-gray-500 text-sm">FLAG Cost:</div>
                   <div className="flex items-center gap-4 w-40">
                     <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm" value={rev.flagCost} onChange={e => updateField('flagCost', parseFloat(e.target.value) || 0)} />
                     <span className="text-sm text-gray-500">EUR</span>
                   </div>
                </div>
                
                <div className="flex items-center pb-2 border-b border-gray-100">
                   <div className="w-[200px] text-gray-500 text-sm">DHL Cost:</div>
                   <div className="flex items-center gap-4 w-40">
                     <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm" value={rev.dhlCost} onChange={e => updateField('dhlCost', parseFloat(e.target.value) || 0)} />
                     <span className="text-sm text-gray-500">EUR</span>
                   </div>
                </div>

                <div className="flex items-center pb-2 border-b border-gray-100">
                   <div className="w-[200px] text-gray-500 text-sm">Extra Cost:</div>
                   <div className="flex items-center gap-4 w-40">
                     <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm" value={rev.extraCost} onChange={e => updateField('extraCost', parseFloat(e.target.value) || 0)} />
                     <span className="text-sm text-gray-500">EUR</span>
                   </div>
                </div>

                <div className="flex items-center pb-2 border-b border-gray-100">
                   <div className="w-[200px] text-gray-500 text-sm">Service Fees:</div>
                   <div className="flex items-center gap-4 w-40">
                     <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm" value={rev.serviceFees} onChange={e => updateField('serviceFees', parseFloat(e.target.value) || 0)} />
                     <span className="text-sm text-gray-500">EUR</span>
                   </div>
                </div>

                <div className="flex items-center pb-2 border-b border-gray-100">
                   <div className="w-[200px] text-gray-500 text-sm">Bank Commission:</div>
                   <div className="flex items-center gap-4 w-40">
                     <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm" value={rev.bankCommission} onChange={e => updateField('bankCommission', parseFloat(e.target.value) || 0)} />
                     <span className="text-sm text-gray-500">EUR</span>
                   </div>
                </div>

                <div className="flex items-center pb-2 border-b border-gray-100">
                   <div className="w-[200px] text-gray-500 text-sm">FAC Fees:</div>
                   <div className="flex items-center gap-4 w-40">
                     <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm" value={rev.facFees} onChange={e => updateField('facFees', parseFloat(e.target.value) || 0)} />
                     <span className="text-sm text-gray-500">EUR</span>
                   </div>
                </div>

                <div className="flex items-center pb-6">
                   <div className="w-[200px] text-gray-500 text-sm">Paypal Fees:</div>
                   <div className="flex items-center gap-4 w-40">
                     <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm" value={rev.paypalFees} onChange={e => updateField('paypalFees', parseFloat(e.target.value) || 0)} />
                     <span className="text-sm text-gray-500">EUR</span>
                   </div>
                </div>

                <div className="flex items-center pt-6 mt-4">
                   <div className="w-[200px] text-gray-800 font-bold text-sm">Total:</div>
                   <div className="flex items-center gap-4 w-40">
                     <Input type="number" className="w-24 text-right bg-white shadow-inner h-8 text-sm font-bold" value={rev.total} onChange={e => updateField('total', parseFloat(e.target.value) || 0)} />
                     <span className="text-sm text-gray-800 font-bold">EUR</span>
                   </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
