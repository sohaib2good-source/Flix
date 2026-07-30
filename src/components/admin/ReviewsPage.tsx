import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { MessageSquare, Edit2, Trash2, Plus, Star, Globe, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({ name: '', country: '', text: '', rating: 5 });
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'reviews'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingReview(true);
    setReviewMessage(null);

    const performSave = async () => {
      if (currentReviewId) {
        await updateDoc(doc(db, 'reviews', currentReviewId), {
          ...reviewForm,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'reviews'), {
          ...reviewForm,
          createdAt: serverTimestamp()
        });
      }
    };

    try {
      await Promise.race([
        performSave(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Network timeout')), 10000))
      ]);
      setReviewMessage({ type: 'success', text: 'Review saved successfully!' });
      setIsEditingReview(false);
      setCurrentReviewId(null);
      setReviewForm({ name: '', country: '', text: '', rating: 5 });
      fetchReviews();
      setTimeout(() => setReviewMessage(null), 5000);
    } catch (error: any) {
      console.error("Error saving review:", error);
      setReviewMessage({ type: 'error', text: 'Error saving review' });
    } finally {
      setIsSavingReview(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, 'reviews', id));
        fetchReviews();
        setReviewMessage({ type: 'success', text: 'Review deleted successfully.' });
        setTimeout(() => setReviewMessage(null), 5000);
      } catch (error: any) {
        console.error("Error deleting review:", error);
        setReviewMessage({ type: 'error', text: 'Error deleting review' });
      }
    }
  };

  const openEditReview = (review: any) => {
    setReviewMessage(null);
    setCurrentReviewId(review.id);
    setReviewForm({ name: review.name, country: review.country, text: review.text, rating: review.rating });
    setIsEditingReview(true);
  };

  const openNewReview = () => {
    setReviewMessage(null);
    setCurrentReviewId(null);
    setReviewForm({ name: '', country: '', text: '', rating: 5 });
    setIsEditingReview(true);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-navy tracking-tight uppercase">Review Management</h1>
            <p className="text-muted-foreground font-medium">Manage customer testimonials displayed on the live website.</p>
          </div>
        </div>
        {!isEditingReview && (
          <Button onClick={openNewReview} className="bg-gold hover:bg-gold/90 text-white gap-2 font-bold shadow-lg shadow-gold/20">
            <Plus className="w-4 h-4" /> Add New Review
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Reviews</p>
          </div>
          <p className="text-3xl font-black text-navy">{reviews.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-gold" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Average Rating</p>
          </div>
          <p className="text-3xl font-black text-gold">{averageRating} <span className="text-sm font-medium text-gray-400">/ 5</span></p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Countries</p>
          </div>
          <p className="text-3xl font-black text-navy">{new Set(reviews.map(r => r.country)).size}</p>
        </motion.div>
      </div>

      {/* Notification */}
      {reviewMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-2xl text-sm font-medium border ${reviewMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
        >
          {reviewMessage.text}
        </motion.div>
      )}

      {/* Editor */}
      {isEditingReview ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-2xl shadow-navy/5 border border-gray-100 p-10"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-navy uppercase">{currentReviewId ? 'Edit Review' : 'Create New Review'}</h2>
            <Button variant="ghost" onClick={() => setIsEditingReview(false)} className="text-gray-400 hover:text-navy font-bold">Cancel</Button>
          </div>
          <form onSubmit={handleSaveReview} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reviewerName" className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Customer Name
                </Label>
                <Input
                  id="reviewerName"
                  required
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                  placeholder="e.g. Alexander M."
                  className="h-12 bg-gray-50 border-gray-100 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewerCountry" className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> Country
                </Label>
                <Input
                  id="reviewerCountry"
                  required
                  value={reviewForm.country}
                  onChange={(e) => setReviewForm({...reviewForm, country: e.target.value})}
                  placeholder="e.g. United Kingdom"
                  className="h-12 bg-gray-50 border-gray-100 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewerRating" className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                <Star className="w-3.5 h-3.5" /> Star Rating (1–5)
              </Label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({...reviewForm, rating: star})}
                    className={`w-12 h-12 rounded-xl border-2 text-lg font-black transition-all ${
                      reviewForm.rating >= star
                        ? 'border-gold bg-gold/10 text-gold scale-110'
                        : 'border-gray-100 text-gray-300 hover:border-gold/30'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-sm font-bold text-gray-400 ml-2">{reviewForm.rating}/5</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reviewerText" className="text-xs font-bold text-navy uppercase tracking-widest">Review Content</Label>
              <textarea
                id="reviewerText"
                required
                value={reviewForm.text}
                onChange={(e) => setReviewForm({...reviewForm, text: e.target.value})}
                className="flex min-h-[140px] w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm shadow-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-navy/10 focus:bg-white transition-all"
                placeholder="Write the full testimonial here..."
              />
            </div>
            <Button type="submit" disabled={isSavingReview} className="bg-navy hover:bg-navy/90 text-white w-full md:w-auto px-10 h-14 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-navy/20">
              {isSavingReview ? 'Saving...' : 'Save Review'}
            </Button>
          </form>
        </motion.div>
      ) : (
        /* Review List */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2rem] shadow-2xl shadow-navy/5 border border-gray-100 overflow-hidden"
        >
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-2 border-navy/20 border-t-navy rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-16 text-center">
              <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-muted-foreground font-bold mb-1">No reviews yet</p>
              <p className="text-sm text-gray-400">Add a review to see it on the live site!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-100">
                    <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Name</th>
                    <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Country</th>
                    <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest">Rating</th>
                    <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest hidden md:table-cell">Review Text</th>
                    <th className="p-5 font-bold text-navy text-xs uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-gray-50 hover:bg-navy/[0.02] transition-colors"
                    >
                      <td className="p-5 font-medium text-navy">{r.name}</td>
                      <td className="p-5 text-gray-600">{r.country}</td>
                      <td className="p-5">
                        <span className="text-gold font-bold">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </td>
                      <td className="p-5 text-sm text-gray-400 truncate max-w-[250px] hidden md:table-cell" title={r.text}>
                        {r.text}
                      </td>
                      <td className="p-5 flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => openEditReview(r)} className="text-navy hover:bg-navy/5">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteReview(r.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
