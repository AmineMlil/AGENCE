import { Filter, MapPin, Building2, ShieldCheck, History, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useState } from 'react';

export default function Dashboard() {
  const { cities, clients, currentUser } = useData();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  const handleApplyFilter = () => {
    navigate('/fleet', { 
      state: { 
        city: selectedCity || 'Toutes les Villes', 
        client: selectedClient || 'Tous les Clients' 
      } 
    });
  };

  return (
    <div className="space-y-12">
      {/* Editorial Header Section */}
      <section className="animate-slam-in bg-white p-8 rounded-2xl border border-surface-container shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500",
            currentUser?.role === 'admin' ? "bg-primary" : "bg-secondary"
          )}>
            {currentUser?.name.charAt(0)}
          </div>
          <div>
            <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-1 block">Bonjour, {currentUser?.name}</span>
            <h2 className="text-4xl font-black text-on-surface leading-tight tracking-tighter">
              NCRM 
              <span className="block text-on-surface-variant font-medium text-lg tracking-normal mt-1">
                La gestion simplifiée de votre flotte
              </span>
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Rôle Actuel</span>
          <span className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
            currentUser?.role === 'admin' ? "bg-primary text-white" : "bg-surface-container text-on-surface-variant"
          )}>
            {currentUser?.role === 'admin' ? 'Administrateur' : 'Agent Technique'}
          </span>
        </div>
      </section>

      {/* Configuration & Filters Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Control Panel */}
        <section className="lg:col-span-12 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-surface-container shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight text-primary">Configuration du Filtre</h3>
                <p className="text-on-surface-variant text-sm font-medium">selectionnez une ville et un client</p>
              </div>
              <Link 
                to="/add-machine"
                className="group flex items-center gap-3 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Plus size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">Ajouter une Machine</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Nouveau Registration</p>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* City Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-wider text-secondary uppercase">Choisir une Ville</label>
                  <span className="text-[10px] font-mono text-outline">REF: LOC_SYS_01</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <MapPin className="text-on-surface-variant" size={18} />
                  </div>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm font-medium py-4 pl-12 pr-4 rounded-t-lg appearance-none transition-all cursor-pointer"
                  >
                    <option value="">Toutes les Villes</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold tracking-wider text-secondary uppercase">Entité Client</label>
                  <span className="text-[10px] font-mono text-outline">REF: CLT_DB_44</span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Building2 className="text-on-surface-variant" size={18} />
                  </div>
                  <select 
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm font-medium py-4 pl-12 pr-4 rounded-t-lg appearance-none transition-all cursor-pointer"
                  >
                    <option value="">Tous les Clients</option>
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleApplyFilter}
              className="w-full mt-10 bg-primary text-on-primary font-bold py-4 rounded-lg shadow-sm flex items-center justify-center gap-3 hover:bg-primary-hover transition-all active:scale-[0.98]"
            >
              <Filter size={20} />
              <span className="uppercase tracking-widest text-sm">Appliquer le Filtre</span>
            </button>
          </div>
        </section>
      </div>

      {/* Footer Meta */}
      <footer className="pt-8 border-t border-surface-container-high flex flex-col sm:flex-row justify-between items-center text-on-surface-variant text-[10px] gap-4">
        <div className="flex gap-6">
          <span className="flex items-center gap-1 uppercase tracking-wider font-bold">
            <ShieldCheck size={14} className="text-tertiary" /> Connexion Sécurisée AES-256
          </span>
          <span className="flex items-center gap-1 uppercase tracking-wider font-bold">
            <History size={14} /> Dernier import : 12/05/2024
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
          <span className="font-bold uppercase tracking-wider">Tous les systèmes sont opérationnels</span>
        </div>
      </footer>
    </div>
  );
}
