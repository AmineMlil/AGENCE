import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { User, Key, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Profile() {
  const { currentUser, updatePassword } = useData();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentUser) return;

    // Verify current password (if set)
    if (currentUser.password && currentPassword !== currentUser.password) {
      setError('Le mot de passe actuel est incorrect.');
      return;
    }

    if (newPassword.length < 4) {
      setError('Le nouveau mot de passe doit contenir au moins 4 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    updatePassword(currentUser.id, newPassword);
    setSuccess('Mot de passe mis à jour avec succès.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-black tracking-tighter text-primary uppercase italic">Mon Profil</h2>
        <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest">Gérez vos informations personnelles et sécurité</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Info Card */}
        <section className="bg-white p-8 rounded-2xl border border-surface-container shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div className={cn(
              "w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-xl",
              currentUser.role === 'admin' ? "bg-primary" : "bg-secondary"
            )}>
              {currentUser.name}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-primary tracking-tight">{currentUser.name}</h3>
              <p className="text-on-surface-variant font-medium">{currentUser.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                  currentUser.role === 'admin' ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant"
                )}>
                  {currentUser.role === 'admin' ? 'Administrateur' : 'Agent Technique'}
                </span>
                <span className="text-[10px] text-on-surface-variant/60 font-mono">ID: {currentUser.id}</span>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-surface-container space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">Date de création</span>
              <span className="font-medium text-primary">{new Date(currentUser.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white p-8 rounded-2xl border border-surface-container shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors duration-500" />
          
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Key size={20} />
            </div>
            <h3 className="text-xl font-bold text-primary tracking-tight">Sécurité & Mot de passe</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase ml-1">Mot de passe actuel</label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-3 px-4 text-sm font-medium rounded-t-lg transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase ml-1">Nouveau mot de passe</label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-3 px-4 text-sm font-medium rounded-t-lg transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase ml-1">Confirmer</label>
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 py-3 px-4 text-sm font-medium rounded-t-lg transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-xs font-bold"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-xs font-bold"
              >
                <CheckCircle2 size={16} />
                {success}
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-all active:scale-[0.98] group"
            >
              <Save size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="uppercase tracking-[0.2em] text-xs">Mettre à jour le mot de passe</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
