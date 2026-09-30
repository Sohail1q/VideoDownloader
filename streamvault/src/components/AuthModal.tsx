import React, { useState } from 'react';
import { X, Lock, Mail, User, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; name: string; isAdmin: boolean }) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    const userName = name.trim() || email.split('@')[0];
    const isAdmin = email.toLowerCase().includes('doomhel6') || email.toLowerCase().includes('admin');

    onLoginSuccess({
      email: email.trim(),
      name: userName,
      isAdmin
    });
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-neutral-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden neon-border-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-400 to-pink-500 text-neutral-950 font-bold shadow-md">
              <ShieldCheck className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                StreamVault Account
              </h3>
              <p className="text-xs text-cyan-400 font-mono">
                {mode === 'login' ? 'Sign in to access your vault' : 'Create your free personal account'}
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

        {/* Tab Switcher: Login vs Sign Up */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 my-4 relative z-10">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign Up / Create Account
          </button>
        </div>

        {error && (
          <div className="p-2.5 mb-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Simple Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Your Name (Optional)</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Smith"
                className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-pink-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 text-xs bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-pink-500 font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-cyan-300 hover:to-pink-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg neon-glow-cyan transition-all flex items-center justify-center gap-1.5"
            >
              <span>{mode === 'login' ? 'Log In to StreamVault' : 'Create My Account'}</span>
              <ArrowRight className="w-4 h-4 text-neutral-950" />
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-neutral-400">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-cyan-400 font-bold hover:underline"
              >
                {mode === 'login' ? 'Sign up here' : 'Log in here'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
