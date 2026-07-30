import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Banknote, Search, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import RevenueDetails from '../RevenueDetails';
import { parseFirebaseDate, formatFirebaseDate } from '../../utils/dateUtils';

interface Props {
  recordId?: string | null;
}

export default function RevenuePage({ recordId }: Props) {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      data.sort((a: any, b: any) => {
        const dateA = parseFirebaseDate(a.system?.serverTimestamp) || parseFirebaseDate(a.createdAt);
        const dateB = parseFirebaseDate(b.system?.serverTimestamp) || parseFirebaseDate(b.createdAt);
        const timeA = dateA ? dateA.getTime() : 0;
        const timeB = dateB ? dateB.getTime() : 0;
        return timeB - timeA;
      });
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = registrations.reduce((sum, r) => sum + (parseFloat(r.financial?.total) || 0), 0);
  const paidCount = registrations.filter(r => r.revenue?.commissionStatus === 'Paid').length;
  const pendingCount = registrations.length - paidCount;

  const filtered = registrations.filter(r => {
    const name = `${r.entity?.primaryOwner?.details?.firstName || ''} ${r.entity?.primaryOwner?.details?.lastName || ''}`.toLowerCase();
    const vessel = (r.registration?.vessel?.name || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || vessel.includes(term);
  });

  // ── Detail View (URL: /admin/revenue/:id) ──
  if (recordId) {
    const selectedReg = registrations.find(r => r.id === recordId);

    if (loading) {
      return (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-2 border-navy/20 border-t-navy rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Loading record...</p>
        </div>
      );
    }

    if (!selectedReg) {
      return (
        <div className="p-16 text-center">
          <Banknote className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-muted-foreground font-bold mb-1">Record not found</p>
          <p className="text-sm text-gray-400 mb-6">The revenue record "{recordId}" does not exist.</p>
          <Button onClick={() => navigate('/admin/revenue')} className="bg-navy text-white">
            Back to Revenue
          </Button>
        </div>
      );
    }

    return <RevenueDetails registration={selectedReg} onBack={() => navigate('/admin/revenue')} />;
  }

  // ── List View (URL: /admin/revenue) ──
  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
            <Banknote className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-navy tracking-tight uppercase">Revenue Tracking</h1>
            <p className="text-muted-foreground font-medium">Financial overview and commission management for all orders.</p>
          </div>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg shadow-green-200 p-6 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <DollarSign className="w-4 h-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest">Total Revenue</p>
          </div>
          <p className="text-3xl font-black">{totalRevenue.toLocaleString()}€</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
          </div>
          <p className="text-3xl font-black text-navy">{registrations.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-green-500" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paid</p>
          </div>
          <p className="text-3xl font-black text-green-600">{paidCount}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-yellow-500" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending</p>
          </div>
          <p className="text-3xl font-black text-yellow-600">{pendingCount}</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          <input
            type="text"
            placeholder="Search by client name or vessel..."
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
            <p className="text-muted-foreground font-medium">Loading revenue data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Banknote className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold mb-1">No orders found</p>
            <p className="text-sm text-gray-400">{searchTerm ? 'Try a different search' : 'Revenue data appears here as orders come in'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Order Client</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Vessel Name</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Payment Method</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Net Profit</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Status</th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const rev = r.revenue || {};
                  const method = rev.paymentMethod || 'PayPal';
                  const status = rev.commissionStatus || 'Pending';
                  const amount = rev.amount ?? (r.financial?.total || 0);
                  const clientName = `${r.entity?.primaryOwner?.details?.firstName || ''} ${r.entity?.primaryOwner?.details?.lastName || ''}`.trim() || 'N/A';
                  const clientEmail = r.entity?.primaryOwner?.details?.email || '';
                  const vesselName = r.registration?.vessel?.name || 'N/A';
                  return (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-50 hover:bg-navy/[0.02] transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/revenue/${r.id}`)}
                    >
                      <td className="p-5">
                        <p className="font-semibold text-navy">{clientName}</p>
                        <p className="text-xs text-gray-400">{clientEmail}</p>
                      </td>
                      <td className="p-5 text-sm">{vesselName}</td>
                      <td className="p-5 text-sm">{method}</td>
                      <td className="p-5 font-bold text-green-600">{amount} EUR</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" className="bg-gold hover:bg-gold/90 text-white font-bold" onClick={() => navigate(`/admin/revenue/${r.id}`)}>
                          Manage Revenue
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
