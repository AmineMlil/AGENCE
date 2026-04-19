import { Building2, Plus, Trash2, MapPin, UploadCloud, FileType, CheckCircle2, ShieldCheck, History, Landmark, Edit2, Check, X as CloseIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useData } from '../context/DataContext';
import { useState, ChangeEvent } from 'react';

export default function Settings() {
  const { cities, clients, addCity, removeCity, updateCity, addClient, removeClient, updateClient, importBulkData } = useData();
  const [newCity, setNewCity] = useState('');
  const [newClient, setNewClient] = useState('');
  
  const [editingCity, setEditingCity] = useState<string | null>(null);
  const [editingCityValue, setEditingCityValue] = useState('');
  
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editingClientValue, setEditingClientValue] = useState('');

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        
        const discoveredCities: string[] = [];
        const discoveredClients: string[] = [];
        const discoveredAgencies: any[] = [];

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const parts = line.split(';');
          if (parts.length >= 2) {
            const cityName = parts[0].trim();
            const clientName = parts[1].trim();
            const agencyName = parts[2]?.trim() || `Agence ${cityName}`;
            const sn = parts[3]?.trim();
            
            if (cityName) discoveredCities.push(cityName);
            if (clientName) discoveredClients.push(clientName);
            
            if (cityName && clientName) {
              discoveredAgencies.push({
                id: `IMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                name: agencyName,
                city: cityName,
                client: clientName,
                vehiclesCount: Math.floor(Math.random() * 50) + 1,
                sn: sn
              });
            }
          }
        }

        importBulkData(discoveredCities, discoveredClients, discoveredAgencies);
        setImportStatus(`Import réussi : ${discoveredCities.length} entrées scannées.`);
        setTimeout(() => setImportStatus(null), 3000);
      } catch (err) {
        setImportStatus("Erreur lors de la lecture du fichier.");
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-12 animate-slam-in">
      <section>
        <h3 className="text-4xl font-black text-on-surface tracking-tight">Paramètres</h3>
        <p className="text-on-surface-variant mt-2 max-w-2xl text-lg leading-relaxed">
          Gérez les paramètres structurels de votre flotte industrielle. Administrez vos villes, clients et agences avec précision.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Management Section */}
        <div className="lg:col-span-12 space-y-10">
          
          {/* Reference Data: Cities & Clients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cities Management */}
            <div className="bg-white p-6 rounded-xl border border-surface-container shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary" size={20} />
                  <h4 className="text-lg font-bold text-primary">Gestion des Villes</h4>
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Ajouter une ville..."
                  className="flex-grow bg-white border border-surface-container focus:border-primary focus:ring-0 px-4 py-2 rounded-lg text-sm"
                />
                <button 
                  onClick={() => { if(newCity) { addCity(newCity); setNewCity(''); } }}
                  className="bg-primary text-on-primary p-2 rounded-lg hover:bg-primary-hover transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {cities.map((city) => (
                  <div key={city} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg group">
                    {editingCity === city ? (
                      <div className="flex items-center gap-2 flex-grow">
                        <input 
                          type="text"
                          value={editingCityValue}
                          onChange={(e) => setEditingCityValue(e.target.value)}
                          className="flex-grow bg-white border border-primary focus:ring-0 px-2 py-1 rounded text-sm"
                          autoFocus
                        />
                        <button 
                          onClick={() => { updateCity(city, editingCityValue); setEditingCity(null); }}
                          className="text-success hover:scale-110 transition-transform"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingCity(null)}
                          className="text-on-surface-variant hover:scale-110 transition-transform"
                        >
                          <CloseIcon size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium">{city}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => { setEditingCity(city); setEditingCityValue(city); }}
                            className="text-on-surface-variant hover:text-primary"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => removeCity(city)}
                            className="text-on-surface-variant hover:text-error"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Clients Management */}
            <div className="bg-white p-6 rounded-xl border border-surface-container shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Landmark className="text-primary" size={20} />
                  <h4 className="text-lg font-bold text-primary">Gestion des Clients</h4>
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                  placeholder="Ajouter un client..."
                  className="flex-grow bg-white border border-surface-container focus:border-primary focus:ring-0 px-4 py-2 rounded-lg text-sm"
                />
                <button 
                  onClick={() => { if(newClient) { addClient(newClient); setNewClient(''); } }}
                  className="bg-primary text-on-primary p-2 rounded-lg hover:bg-primary-hover transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {clients.map((client) => (
                  <div key={client} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg group">
                    {editingClient === client ? (
                      <div className="flex items-center gap-2 flex-grow">
                        <input 
                          type="text"
                          value={editingClientValue}
                          onChange={(e) => setEditingClientValue(e.target.value)}
                          className="flex-grow bg-white border border-primary focus:ring-0 px-2 py-1 rounded text-sm"
                          autoFocus
                        />
                        <button 
                          onClick={() => { updateClient(client, editingClientValue); setEditingClient(null); }}
                          className="text-success hover:scale-110 transition-transform"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingClient(null)}
                          className="text-on-surface-variant hover:scale-110 transition-transform"
                        >
                          <CloseIcon size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-sm font-medium">{client}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => { setEditingClient(client); setEditingClientValue(client); }}
                            className="text-on-surface-variant hover:text-primary"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => removeClient(client)}
                            className="text-on-surface-variant hover:text-error"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Import Footer Section (Full Width Now) */}
        <div className="lg:col-span-12">
          <div className="bg-white p-8 rounded-xl border border-surface-container shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/3 space-y-4">
              <div className="flex items-center gap-3">
                <UploadCloud className="text-primary" size={24} />
                <h4 className="text-xl font-bold tracking-tight text-primary">Import de Données</h4>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Mettez à jour massivement votre base de données via CSV.
                <span className="block mt-2 font-mono text-[10px] bg-surface-container-low p-2 rounded">Ville; Client; Agence; SN</span>
              </p>
            </div>

            <div 
              className="flex-grow w-full border-2 border-dashed border-surface-container rounded-xl p-8 bg-surface-container-low text-center hover:bg-surface-container transition-colors cursor-pointer group flex flex-col items-center relative"
              onClick={() => document.getElementById('csv-import')?.click()}
            >
              <input 
                id="csv-import"
                type="file" 
                accept=".csv"
                className="hidden" 
                onChange={handleFileUpload}
              />
              <FileType className="text-primary mb-2 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-sm font-semibold">
                {importStatus ? (
                  <span className="text-success animate-pulse">{importStatus}</span>
                ) : (
                  "Déposer le fichier CSV ici"
                )}
              </p>
              <button 
                className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-lg font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-primary-hover transition-all"
              >
                Parcourir
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="pt-8 border-t border-surface-container-high flex flex-col sm:flex-row justify-between items-center text-on-surface-variant text-[10px] gap-4">
        <div className="flex gap-6">
          <span className="flex items-center gap-1 uppercase tracking-wider font-bold">
            <ShieldCheck size={14} className="text-tertiary" /> Sécurité Enterprise
          </span>
          <span className="flex items-center gap-1 uppercase tracking-wider font-bold">
            <History size={14} /> System v2.4.0
          </span>
          <button 
            onClick={() => {
              if(confirm("Voulez-vous vraiment réinitialiser toutes les données ? Cette action est irréversible.")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="flex items-center gap-1 uppercase tracking-wider font-bold text-error hover:underline"
          >
            Réinitialiser l'application
          </button>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-tertiary" />
          <span className="font-bold uppercase tracking-wider">Synchronisation stable</span>
        </div>
      </footer>
    </div>
  );
}
