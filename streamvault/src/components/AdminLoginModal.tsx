import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Key, Eye, EyeOff, UserCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: (email: string) => void;
  onLogout: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both administrative email and password.');
      return;
    }

    // Authenticate
    onLogin(email.trim());
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-neutral-900 border border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl p-6 relative neon-border-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background element */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 text-neutral-950 font-bold shadow-lg">
              <ShieldCheck className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                StreamVault Admin Gate
              </h3>
              <p className="text-[11px] font-mono text-cyan-400">
                {isAdmin ? 'ADMIN SESSION ACTIVE' : 'RESTRICTED PRIVILEGES'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isAdmin ? (
          <div className="py-6 space-y-5 text-center relative z-10">
            <div className="w-14 h-14 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 neon-glow-cyan">
              <UserCheck className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white">
                Authenticated as Master Administrator
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                You have full access to private vault datasets, background yt-dlp workers, and phone exports.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-400 hover:to-pink-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Access Admin Dashboard
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full py-2 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl transition-colors"
              >
                Sign Out from Admin
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-5 space-y-4 relative z-10">
            <p className="text-xs text-neutral-300 leading-relaxed">
              Public visitors can stream and export public files openly. Enter your administrative credentials to unlock the server control console and private storage tier.
            </p>

            {errorMsg && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400">Admin Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@streamvault.internal"
                className="w-full px-3.5 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400 font-mono transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-400">Admin Password / Access Token</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-3.5 pr-10 py-2 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-pink-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 hover:opacity-95 text-neutral-950 font-bold text-xs rounded-xl shadow-lg neon-glow-cyan transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4 text-neutral-950" />
                <span>Unlock Master Admin Panel</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
