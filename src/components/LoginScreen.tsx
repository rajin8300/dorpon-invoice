import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, Camera, ShieldCheck, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const PASSCODE_STORAGE_KEY = 'dorpon_invoice_passcode';
const DEFAULT_PASSCODE = '8300';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const currentSavedPass = localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_PASSCODE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === currentSavedPass) {
      setError(false);
      onLoginSuccess();
    } else {
      setError(true);
      setPasscode('');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass.trim()) return;
    if (newPass !== confirmPass) {
      alert('নতুন পাসওয়ার্ড দুটি মিলছে না!');
      return;
    }
    localStorage.setItem(PASSCODE_STORAGE_KEY, newPass.trim());
    setSuccessMsg('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
    setShowChangePass(false);
    setNewPass('');
    setConfirmPass('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0d0c0b] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-sm w-full bg-[#181614] border border-[#383128] rounded-3xl p-7 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-xl shadow-amber-500/20 p-3">
            <Camera className="w-8 h-8 text-black stroke-[2.2]" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5 font-serif">
              দর্পণ <span className="text-amber-400">Dorpon</span>
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-1">
              Invoice Studio Private Access
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs text-center font-bold">
            {successMsg}
          </div>
        )}

        {!showChangePass ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>পাসকোড / পাসওয়ার্ড দিন</span>
                <span className="text-[10px] text-amber-400/80 font-normal">
                  ডিফল্ট: <span className="font-mono font-bold text-amber-300">{DEFAULT_PASSCODE}</span>
                </span>
              </label>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  autoFocus
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError(false);
                  }}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className={`w-full bg-[#100f0e] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 font-mono tracking-widest focus:outline-none transition-colors ${
                    error
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-[#3d3429] focus:border-amber-500'
                  }`}
                />
              </div>

              {error && (
                <p className="text-[11px] text-rose-400 mt-1.5 font-medium">
                  ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন (Default: 8300)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <span>লগইন করুন (Enter Studio)</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowChangePass(true)}
                className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
              >
                পাসওয়ার্ড পরিবর্তন করতে চান?
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              নতুন পাসওয়ার্ড সেট করুন
            </h3>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">নতুন পাসওয়ার্ড</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড দিন..."
                className="w-full bg-[#100f0e] border border-[#3d3429] rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="আবার লিখুন..."
                className="w-full bg-[#100f0e] border border-[#3d3429] rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowChangePass(false)}
                className="flex-1 py-2 rounded-xl bg-white/10 text-xs font-bold text-slate-300 hover:bg-white/15"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400"
              >
                সেভ করুন
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#26211c] text-center text-[11px] text-slate-400">
          <p>
            দর্পণ (Dorpon) • <a href="https://rajinmd.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">rajinmd.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};
