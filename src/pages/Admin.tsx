import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { UserPlus, Shield, User, Trash2, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Admin() {
  const { users, currentUser, createNewUserManual, removeUser } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user' as 'admin' | 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 text-primary/20 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-primary mb-2">Accès Refusé</h1>
        <p className="text-muted-foreground">Vous n'avez pas les permissions pour accéder à cette page.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createNewUserManual(formData.email, formData.password, formData.name, formData.role);
      setSuccess('Utilisateur créé avec succès !');
      setFormData({ email: '', password: '', name: '', role: 'user' });
      setIsAdding(false);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">Gérez les accès administrateurs et utilisateurs de la plateforme.</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <UserPlus size={20} />
          <span>Nouvel Utilisateur</span>
        </button>
      </header>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border p-6 rounded-xl shadow-sm max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Créer un manuel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Nom Complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-background border border-input rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Jean Dupont"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-background border border-input rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="jean@exemple.com"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-background border border-input rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Rôle</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                    className="w-full bg-background border border-input rounded-md py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="user">Utilisateur Standard</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>
            </div>
            {error && <p className="text-destructive text-sm font-medium">{error}</p>}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
              >
                Annuler
              </button>
              <button
                disabled={loading}
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {loading ? 'Création...' : 'Créer le compte'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-lg text-center font-medium">
          {success}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50 text-left border-b border-border">
              <th className="px-6 py-4 text-sm font-semibold">Utilisateur</th>
              <th className="px-6 py-4 text-sm font-semibold">Email</th>
              <th className="px-6 py-4 text-sm font-semibold">Rôle</th>
              <th className="px-6 py-4 text-sm font-semibold">Date de création</th>
              <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {user.id !== currentUser.id && (
                    <button
                      onClick={() => removeUser(user.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-all"
                      title="Supprimer l'utilisateur"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
