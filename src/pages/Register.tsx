import { ArrowLeft, Lock, User, Mail, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register, currentUser } = useData();

  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData.email, formData.password, formData.name);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-extrabold tracking-tight text-primary mb-2">Inscription</h1>
            <p className="text-on-surface-variant font-medium text-sm tracking-wide">Créez votre accès professionnel</p>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-sm border border-surface-container"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-center gap-2 text-error text-[11px] font-bold uppercase tracking-wider animate-shake">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-medium text-[10px] uppercase tracking-[0.05em] text-on-surface-variant">
                  Nom complet
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-on-surface-variant" size={18} />
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 px-12 py-3 transition-all outline-none text-on-surface font-medium placeholder:text-on-surface-variant/40 rounded-t-lg"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-medium text-[10px] uppercase tracking-[0.05em] text-on-surface-variant">
                  Email professionnel
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-on-surface-variant" size={18} />
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 px-12 py-3 transition-all outline-none text-on-surface font-medium placeholder:text-on-surface-variant/40 rounded-t-lg"
                    placeholder="jean@ncr-maroc.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-medium text-[10px] uppercase tracking-[0.05em] text-on-surface-variant">
                  Mot de passe
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-on-surface-variant" size={18} />
                  <input 
                    required
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 px-12 py-3 transition-all outline-none text-on-surface font-medium placeholder:text-on-surface-variant/40 rounded-t-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-medium text-[10px] uppercase tracking-[0.05em] text-on-surface-variant">
                  Confirmer le mot de passe
                </label>
                <div className="relative flex items-center">
                  <Shield className="absolute left-4 text-on-surface-variant" size={18} />
                  <input 
                    required
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 px-12 py-3 transition-all outline-none text-on-surface font-medium placeholder:text-on-surface-variant/40 rounded-t-lg"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
                >
                  <span>{loading ? 'Inscription...' : "S'inscrire"}</span>
                </button>
                
                <div className="text-center">
                  <p className="text-on-surface-variant text-xs font-medium">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </main>

      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/15 dark:border-slate-800/15 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] uppercase tracking-[0.05em] font-medium text-slate-500 text-center md:text-left">
            © 2024 PRECISION LEDGER FLEET SYSTEMS. TECHNICAL PRECISION GUARANTEED.
          </div>
        </div>
      </footer>
    </div>
  );
}
