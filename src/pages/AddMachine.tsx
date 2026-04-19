import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Box, Router, Settings2, Info, Navigation, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function AddMachine() {
  const navigate = useNavigate();
  const { cities, clients, addAgency } = useData();
  const [formData, setFormData] = useState<any>({
    name: '',
    city: '',
    client: '',
    gps: '',
    sn: '',
    tid: '',
    ipAddress: '',
    subnetMask: '',
    gateway: '',
    dns: '',
    computerName: '',
    remotePort: '',
    remoteAddress: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.city || !formData.client) {
      alert("Veuillez remplir au moins le nom, la ville et le client.");
      return;
    }

    const newAgency = {
      ...formData,
      id: `HUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      vehiclesCount: 0, // Default for new machines
    };

    addAgency(newAgency);
    alert("Machine enregistrée avec succès !");
    navigate('/fleet');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-slam-in">
      <div className="mb-10">
        <h2 className="text-4xl font-extrabold text-primary tracking-tight mb-2">Ajouter une machine</h2>
        <p className="text-on-surface-variant font-medium">Enregistrement d'un nouvel équipement dans le registre technique.</p>
      </div>

      <form className="space-y-10" onSubmit={handleSubmit}>
        {/* Section 1: Localisation & Identité */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-surface-container">
          <div className="flex items-center gap-3 mb-8 border-b border-surface-container pb-4">
            <MapPin className="text-primary" size={20} />
            <h3 className="font-bold text-primary uppercase tracking-widest text-[10px]">Localisation & Identité</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Nom d'agence</label>
              <input 
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 text-sm py-3 px-4 rounded-t-lg transition-colors placeholder:text-on-surface-variant/30" 
                placeholder="Agence Paris-Nord" 
                type="text" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Ville</label>
                <select 
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 text-sm py-3 px-4 rounded-t-lg transition-colors cursor-pointer appearance-none"
                >
                  <option value="" disabled>Choisir une ville</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Client</label>
                <select 
                  value={formData.client}
                  onChange={(e) => handleChange('client', e.target.value)}
                  className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 text-sm py-3 px-4 rounded-t-lg transition-colors cursor-pointer appearance-none"
                >
                  <option value="" disabled>Choisir un client</option>
                  {clients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-dashed border-surface-container grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Coordonnées GPS (Lat, Long)</label>
                <button 
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((position) => {
                        handleChange('gps', `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
                      });
                    }
                  }}
                  className="text-[10px] font-bold text-primary hover:underline uppercase flex items-center gap-1"
                >
                  <Navigation size={12} />
                  Ma position actuelle
                </button>
              </div>
              <input 
                value={formData.gps}
                onChange={(e) => handleChange('gps', e.target.value)}
                className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 text-sm py-3 px-4 rounded-t-lg transition-colors font-mono placeholder:text-on-surface-variant/30" 
                placeholder="48.8566, 2.3522" 
                type="text" 
              />
            </div>
          </div>
        </section>

        {/* Section 2: Spécifications Matériel */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-surface-container">
          <div className="flex items-center gap-3 mb-8 border-b border-surface-container pb-4">
            <Box className="text-primary" size={20} />
            <h3 className="font-bold text-primary uppercase tracking-widest text-[10px]">Spécifications Matériel</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Numéro de série</label>
              <input 
                value={formData.sn}
                onChange={(e) => handleChange('sn', e.target.value)}
                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-3 px-4 rounded-t-lg transition-colors placeholder:text-on-surface-variant/30 font-mono" 
                placeholder="SN-992-XKL-001" 
                type="text" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">Terminal ID</label>
              <input 
                value={formData.tid}
                onChange={(e) => handleChange('tid', e.target.value)}
                className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-3 px-4 rounded-t-lg transition-colors placeholder:text-on-surface-variant/30 font-mono" 
                placeholder="TID-8842-AF" 
                type="text" 
              />
            </div>
          </div>
        </section>

        {/* Section 3: Configuration Réseau */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-8 bg-white p-8 rounded-xl shadow-sm border border-surface-container">
            <div className="flex items-center gap-3 mb-8 border-b border-surface-container pb-4">
              <Router className="text-primary" size={20} />
              <h3 className="font-bold text-primary uppercase tracking-widest text-[10px]">Configuration Réseau</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Adresse IP', key: 'ipAddress' },
                { label: 'Masque sous réseau', key: 'subnetMask' },
                { label: 'Passerelle', key: 'gateway' },
                { label: 'DNS', key: 'dns' }
              ].map((field) => (
                <div key={field.label} className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">{field.label}</label>
                  <input 
                    value={formData[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-3 px-4 rounded-t-lg transition-colors font-mono" 
                    placeholder="0.0.0.0" 
                    type="text" 
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Remote Config Sidebar Effect */}
          <section className="lg:col-span-4 bg-primary text-on-primary p-8 rounded-xl shadow-lg space-y-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Settings2 size={20} />
              <h3 className="font-bold uppercase tracking-widest text-[10px]">Remote Config</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Computer Name', key: 'computerName' },
                { label: 'Remote Port', key: 'remotePort' },
                { label: 'Remote Address', key: 'remoteAddress' }
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <label className="text-[10px] opacity-60 font-bold uppercase tracking-wider">{field.label}</label>
                  <input 
                    value={formData[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full bg-white/10 border-0 border-b border-white/20 focus:border-white focus:ring-0 text-sm py-2 px-3 placeholder:text-white/20 transition-all" 
                    placeholder="..." 
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Section 4: Misc Info */}
        <section className="bg-white p-8 rounded-xl shadow-sm border border-surface-container">
          <div className="flex items-center gap-3 mb-8 border-b border-surface-container pb-4">
            <Info className="text-primary" size={20} />
            <h3 className="font-bold text-primary uppercase tracking-widest text-[10px]">Misc Info</h3>
          </div>
          <textarea 
            className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 text-sm py-4 px-4 rounded-t-lg transition-colors min-h-[120px]" 
            placeholder="Notes techniques, spécificités d'installation..."
          ></textarea>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-10">
          <button type="button" className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:bg-surface-container-high px-6 py-3 rounded-xl transition-all">
            <Navigation size={18} />
            Voir Itinéraire
          </button>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')}
              className="flex-1 md:flex-none px-10 py-4 bg-surface-container-highest text-primary font-bold rounded-xl hover:bg-surface-variant transition-colors uppercase text-xs tracking-widest"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="flex-1 md:flex-none px-12 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Enregistrer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
