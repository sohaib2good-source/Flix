import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Key, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { auth } from '../../lib/firebase';
import { updatePassword } from 'firebase/auth';

export default function PasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters for security.');
      return;
    }
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setPasswordMessage('Password updated successfully!');
        setNewPassword('');
        setTimeout(() => setPasswordMessage(''), 3000);
      } else {
        setPasswordMessage('Not authenticated. Please log in again.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setPasswordMessage('Security check: Please log out and log back in to change password.');
      } else {
        setPasswordMessage('Failed to update password');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
            <Key className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-navy tracking-tight uppercase">Auth Password</h1>
            <p className="text-muted-foreground font-medium">Change the secret password used to access this admin panel.</p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-100 rounded-2xl p-5 mb-8 flex items-start gap-3"
      >
        <ShieldCheck className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-yellow-800 mb-1">Security Advisory</p>
          <p className="text-xs text-yellow-700 leading-relaxed">
            This password is stored globally in the secure database. Choose a strong, memorable password.
            If you change it, all administrators will need to use the new password.
          </p>
        </div>
      </motion.div>

      {/* Password Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2rem] shadow-2xl shadow-navy/5 border border-gray-100 p-10"
      >
        <form onSubmit={handlePasswordChange} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="newPassword" className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
              <Key className="w-3.5 h-3.5" /> New Secret Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="h-14 bg-gray-50 border-gray-100 focus:bg-white transition-all pr-14 text-lg"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors p-1"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4].map(level => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all ${
                      newPassword.length >= level * 3
                        ? level <= 1 ? 'bg-red-400' : level <= 2 ? 'bg-yellow-400' : level <= 3 ? 'bg-green-400' : 'bg-green-600'
                        : 'bg-gray-100'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {newPassword.length < 4 ? 'Too Short' : newPassword.length < 8 ? 'Fair' : newPassword.length < 12 ? 'Strong' : 'Very Strong'}
              </p>
            </motion.div>
          )}

          {passwordMessage && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm font-bold ${passwordMessage.includes('success') ? 'text-green-600' : 'text-red-500'}`}
            >
              {passwordMessage}
            </motion.p>
          )}

          <Button type="submit" className="bg-navy hover:bg-navy/90 text-white w-full h-14 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-navy/20">
            Update Password
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
