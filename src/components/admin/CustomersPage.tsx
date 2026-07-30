import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { parseFirebaseDate, formatFirebaseDate } from '../../utils/dateUtils';
import { Users, Mail, Phone, MapPin, Calendar, Ship, Search, Download } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c =>
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.boatType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center">
            <Users className="w-6 h-6 text-navy" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-navy tracking-tight uppercase">Instant Lead Track</h1>
            <p className="text-muted-foreground flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live generated requests from calculator
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Leads</p>
          <p className="text-3xl font-black text-navy">{customers.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">This Month</p>
          <p className="text-3xl font-black text-navy">
            {customers.filter(c => {
              const d = parseFirebaseDate(c.createdAt);
              if (!d) return false;
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Search Results</p>
          <p className="text-3xl font-black text-navy">{filtered.length}</p>
        </motion.div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          <input
            type="text"
            placeholder="Search by email, phone, boat type, or location..."
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
            <p className="text-muted-foreground font-medium">Loading customer data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-muted-foreground font-bold mb-1">No leads found</p>
            <p className="text-sm text-gray-400">
              {searchTerm ? 'Try a different search term' : 'Leads will appear here when customers use the calculator'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</div>
                  </th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone</div>
                  </th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Ship className="w-3.5 h-3.5" /> Boat Type</div>
                  </th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Location</div>
                  </th>
                  <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">
                    <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Date</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-gray-50 hover:bg-navy/[0.02] transition-colors group"
                  >
                    <td className="p-5 font-medium text-navy">{c.email}</td>
                    <td className="p-5 text-gray-600">{c.phone || '—'}</td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold capitalize">
                        {c.boatType}
                      </span>
                    </td>
                    <td className="p-5 text-gray-600">{c.location}</td>
                    <td className="p-5 text-sm font-medium text-navy">
                      {formatFirebaseDate(c.createdAt)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
