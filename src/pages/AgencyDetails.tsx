import { ArrowLeft, Save, MapPin, Box, Router, Settings2, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useState, useEffect } from 'react';

export default function AgencyDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { agencies, updateAgency } = useData();
  const [agency, setAgency] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const found = agencies.find(a => a.id === id);
    if (found) {
      setAgency(found);
      setFormData(found);
    }
  }, [id, agencies]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (id) {
      updateAgency(id, formData);
      alert("Paramètres enregistrés avec succès.");
      navigate('/fleet');
    }
  };

  if (!agency) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-on-surface-variant font-medium">Agence non trouvée</p>
        <button 
          onClick={() => navigate('/fleet')}
          className="text-primary font-bold uppercase tracking-widest text-xs py-2 px-4 hover:bg-primary/5 rounded-lg"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-slam-in">
      <header className="flex items-center justify-between border-b border-surface-container pb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white border border-surface-container rounded-xl text-primary hover:shadow-md transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-primary tracking-tighter">{agency.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{agency.id}</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{agency.city}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Parameters Form */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Identité Technique */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-surface-container space-y-8">
            <div className="flex items-center gap-3 border-b border-surface-container pb-4">
              <Box className="text-primary" size={20} />
              <h3 className="font-bold text-primary uppercase tracking-widest text-[10px]">Identité Technique</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Numéro de Série (SN)</label>
                <input 
                  value={formData.sn || ''}
                  onChange={(e) => handleChange('sn', e.target.value)}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-3 px-4 font-mono transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Terminal ID (TID)</label>
                <input 
                  value={formData.tid || ''}
                  onChange={(e) => handleChange('tid', e.target.value)}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-sm py-3 px-4 font-mono transition-all" 
                />
              </div>
            </div>
          </section>

          {/* Section 2: Configuration Réseau */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-surface-container space-y-8">
            <div className="flex items-center gap-3 border-b border-surface-container pb-4">
              <Router className="text-primary" size={20} />
              <h3 className="font-bold text-primary uppercase tracking-widest text-[10px]">Configuration Réseau</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Adresse IP', key: 'ipAddress' },
                { label: 'Masque', key: 'subnetMask' },
                { label: 'Passerelle', key: 'gateway' },
                { label: 'DNS Primaire', key: 'dns' }
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{field.label}</label>
                  <input 
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 text-sm py-3 px-4 font-mono transition-all" 
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-primary text-on-primary p-8 rounded-2xl shadow-xl space-y-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Settings2 size={20} />
              <h3 className="font-bold uppercase tracking-widest text-[10px]">Remote Config</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Computer Name', key: 'computerName' },
                { label: 'Remote Port', key: 'remotePort' },
                { label: 'Remote Address', key: 'remoteAddress' }
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <label className="text-[10px] opacity-60 font-bold uppercase tracking-wider">{item.label}</label>
                  <input 
                    value={formData[item.key] || ''}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full bg-white/10 border-0 border-b border-white/20 focus:border-white focus:ring-0 text-sm py-2 px-3 transition-all" 
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-surface-container space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="text-secondary" size={20} />
              <h3 className="font-bold text-primary uppercase tracking-widest text-[10px]">Localisation GPS</h3>
            </div>
            <div className="space-y-2">
              <input 
                value={formData.gps || ''}
                onChange={(e) => handleChange('gps', e.target.value)}
                placeholder="Latitude, Longitude"
                className="w-full text-xs text-on-surface-variant font-mono bg-surface-container-low p-3 rounded-lg border border-surface-container focus:border-primary focus:ring-0 transition-all"
              />
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-10 border-t border-surface-container">
        <button 
          onClick={() => navigate(-1)}
          className="px-10 py-4 bg-surface-container-highest text-primary font-bold rounded-xl hover:bg-surface-variant transition-colors uppercase text-xs tracking-widest"
        >
          Annuler
        </button>
        <button 
          onClick={handleSave}
          className="px-12 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Mettre à jour les paramètres
        </button>
      </div>
    </div>
  );
}
