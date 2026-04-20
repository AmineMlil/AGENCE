import { ArrowRight, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('admin@ncr-maroc.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState(false);
  
  const navigate = useNavigate();
  const { login, currentUser } = useData();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <header className="w-full flex justify-center pt-8 sm:pt-12 pb-4 sm:pb-8">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-2 sm:p-3 bg-surface-container-highest rounded-xl shadow-lg border border-outline-variant/10"
          >
            <div className="bg-primary p-3 sm:p-4 rounded-lg text-white font-black text-xl sm:text-2xl flex items-center justify-center">
              NCRM
            </div>
          </motion.div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary mb-2">Identification</h1>
            <p className="text-on-surface-variant font-medium text-sm tracking-wide">Technical Fleet Gateway</p>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-sm border border-surface-container"
          >
            <form onSubmit={handleManualLogin} className="space-y-6">
              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-2 text-error text-[11px] font-bold uppercase tracking-wider animate-shake">
                  <AlertCircle size={14} /> Identification échouée
                </div>
              )}
              <div className="space-y-2">
                <label className="block font-medium text-[10px] uppercase tracking-[0.05em] text-on-surface-variant">
                  Email professionnel
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-on-surface-variant" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 px-12 py-4 transition-all outline-none text-on-surface font-medium placeholder:text-on-surface-variant/40 rounded-t-lg shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-medium text-[10px] uppercase tracking-[0.05em] text-on-surface-variant">
                  Mot de passe
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-on-surface-variant" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 px-12 py-4 transition-all outline-none text-on-surface font-medium placeholder:text-on-surface-variant/40 rounded-t-lg shadow-sm"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button 
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
                >
                  <span>{isLoggingIn ? 'Connexion...' : 'Se connecter'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="text-center pt-2 space-y-2">
                <p className="text-on-surface-variant text-xs font-medium">
                  Nouveau utilisateur ?{' '}
                  <Link to="/register" className="text-primary font-bold hover:underline">
                    S'inscrire
                  </Link>
                </p>
                <a href="#" className="text-secondary text-sm font-medium hover:text-primary transition-colors hover:underline decoration-2 underline-offset-4 block">
                  Mot de passe oublié ?
                </a>
              </div>
            </form>
          </motion.div>

          <div className="flex items-center justify-center gap-3 py-4 bg-surface-container-low rounded-lg">
            <span className="h-2 w-2 rounded-full bg-tertiary"></span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Système Opérationnel</span>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/15 dark:border-slate-800/15 py-8">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] uppercase tracking-[0.05em] font-medium text-slate-500 text-center md:text-left">
            © 2024 PRECISION LEDGER FLEET SYSTEMS. TECHNICAL PRECISION GUARANTEED.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] uppercase tracking-[0.05em] font-medium text-slate-400 hover:text-primary transition-colors">Support</a>
            <a href="#" className="text-[10px] uppercase tracking-[0.05em] font-medium text-slate-400 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] uppercase tracking-[0.05em] font-medium text-slate-400 hover:text-primary transition-colors">System Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
