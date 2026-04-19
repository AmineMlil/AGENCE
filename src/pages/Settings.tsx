import { Building2, Plus, Trash2, MapPin, UploadCloud, FileType, CheckCircle2, ShieldCheck, History, Landmark, Edit2, Check, Lock, Unlock, Mail, User as UserIcon, ShieldAlert, X as CloseIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useData, User } from '../context/DataContext';
import { useState, ChangeEvent } from 'react';

export default function Settings() {
  const { 
    cities, clients, addCity, removeCity, updateCity, 
    addClient, removeClient, updateClient, 
    importBulkData, users, addUser, removeUser, updateUser, 
    currentUser, resetMPForClient, resetAllMP 
  } = useData();
  
  const [newCity, setNewCity] = useState('');
  const [newClient, setNewClient] = useState('');
  
  const [editingCity, setEditingCity] = useState<string | null>(null);
  const [editingCityValue, setEditingCityValue] = useState('');
  
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editingClientValue, setEditingClientValue] = useState('');

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [resetClient, setResetClient] = useState('');

  const [isAdminManual, setIsAdminManual] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Unlocked if manual admin check passed OR if current session user is an admin
  const isUnlocked = isAdminManual || currentUser?.role === 'admin';

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');

  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showGlobalResetConfirm, setShowGlobalResetConfirm] = useState(false);

  const { clearAllData } = useData();

  const handleAdminLogin = () => {
    const correctPassword = (import.meta as any).env.VITE_ADMIN_CODE || '1234';
    if (adminPassword === correctPassword) {
      setIsAdminManual(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert("Code administrateur incorrect.");
    }
  };

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
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h3 className="text-4xl font-black text-on-surface tracking-tight">Paramètres</h3>
          <p className="text-on-surface-variant mt-2 max-w-2xl text-lg leading-relaxed">
            Gérez les paramètres structurels de votre flotte industrielle. Administrez vos villes, clients et agences avec précision.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {isUnlocked ? (
            <div className="flex items-center gap-3 bg-success/10 border border-success/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-black text-success uppercase tracking-widest">
                {currentUser?.role === 'admin' ? "Session Admin Active" : "Accès Admin Manuel"}
              </span>
              {isAdminManual && (
                <button 
                  onClick={() => setIsAdminManual(false)}
                  className="p-1 hover:bg-success/20 rounded-full text-success transition-colors"
                  title="Couper l'accès manuel"
                >
                  <Unlock size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {showAdminLogin ? (
                <div className="flex items-center gap-2 bg-white border border-surface-container p-1 rounded-lg animate-in slide-in-from-right-4">
                  <input 
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    placeholder="Code Admin..."
                    className="bg-transparent border-none focus:ring-0 text-xs w-24 px-2"
                    autoFocus
                  />
                  <button 
                    onClick={handleAdminLogin}
                    className="bg-primary text-white p-1.5 rounded-md hover:bg-primary-hover"
                  >
                    <Check size={14} />
                  </button>
                  <button 
                    onClick={() => setShowAdminLogin(false)}
                    className="p-1.5 text-on-surface-variant hover:text-error"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center gap-2 bg-on-surface/5 hover:bg-on-surface/10 px-4 py-2 rounded-full text-on-surface-variant transition-all group"
                >
                  <Lock size={14} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Connexion Admin</span>
                </button>
              )}
            </div>
          )}
        </div>
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

          {/* User Management */}
          <div className="bg-white p-8 rounded-xl border border-surface-container shadow-sm space-y-8 relative overflow-hidden">
            {!isUnlocked && (
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] z-10 flex items-center justify-center group pointer-events-none">
                <div className="bg-white/90 p-4 rounded-xl shadow-xl border border-surface-container flex flex-col items-center gap-2 transform group-hover:scale-105 transition-transform">
                  <Lock className="text-on-surface-variant/40" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Accès Réservé Administrateur</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 border-b border-surface-container pb-4">
              <UserIcon className="text-primary" size={24} />
              <h4 className="text-xl font-bold text-primary">Gestion des Utilisateurs</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-surface-container-low p-6 rounded-xl border border-surface-container">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Nom Complet</label>
                <input 
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full bg-white border border-surface-container p-2 rounded-lg text-sm focus:border-primary focus:ring-0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email</label>
                <input 
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="jean@ncr-maroc.com"
                  className="w-full bg-white border border-surface-container p-2 rounded-lg text-sm focus:border-primary focus:ring-0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Rôle</label>
                <div className="flex gap-2">
                  <select 
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as 'admin' | 'user')}
                    className="flex-grow bg-white border border-surface-container p-2 rounded-lg text-sm focus:border-primary focus:ring-0"
                  >
                    <option value="user">Agent (Standard)</option>
                    <option value="admin">Administrateur</option>
                  </select>
                  <button 
                    onClick={() => {
                      if(!newUserName || !newUserEmail) return;
                      if(!newUserEmail.toLowerCase().endsWith('@ncr-maroc.com')) {
                        alert("L'email doit impérativement se terminer par @ncr-maroc.com");
                        return;
                      }
                      addUser({
                        id: `USR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                        name: newUserName,
                        email: newUserEmail,
                        role: newUserRole,
                        createdAt: new Date().toISOString()
                      });
                      setNewUserName('');
                      setNewUserEmail('');
                    }}
                    className="bg-primary text-white p-2 rounded-lg hover:bg-primary-hover shadow-sm transition-transform active:scale-95"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-white border border-surface-container rounded-xl group hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-black text-xs",
                      user.role === 'admin' ? "bg-primary text-white shadow-lg" : "bg-surface-container text-on-surface-variant"
                    )}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface">{user.name}</span>
                        {user.role === 'admin' && (
                          <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                            <ShieldAlert size={10} /> Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                          <Mail size={10} /> {user.email}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          ID: {user.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {deletingUserId === user.id ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                        <button 
                          onClick={() => {
                            removeUser(user.id);
                            setDeletingUserId(null);
                          }}
                          className="text-[10px] font-black uppercase tracking-widest bg-error text-white px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          Confirmer
                        </button>
                        <button 
                          onClick={() => setDeletingUserId(null)}
                          className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-surface-container hover:bg-surface-container"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => updateUser(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })}
                          className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-surface-container hover:bg-primary hover:text-white hover:border-primary transition-all"
                        >
                          {user.role === 'admin' ? "Rétrograder" : "Promouvoir"}
                        </button>
                        <button 
                          onClick={() => {
                            if (user.id === currentUser?.id) {
                              alert("Vous ne pouvez pas supprimer votre propre compte.");
                              return;
                            }
                            setDeletingUserId(user.id);
                          }}
                          className="p-2 text-on-surface-variant hover:text-error transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance (MP) Operations */}
          <div className="bg-white p-8 rounded-xl border border-surface-container shadow-sm space-y-8 relative overflow-hidden">
            {!isUnlocked && (
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px] z-10 flex items-center justify-center group pointer-events-none">
                <div className="bg-white/90 p-4 rounded-xl shadow-xl border border-surface-container flex flex-col items-center gap-2 transform group-hover:scale-105 transition-transform">
                  <Lock className="text-on-surface-variant/40" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Accès Réservé Administrateur</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 border-b border-surface-container pb-4">
              <History className="text-primary" size={24} />
              <h4 className="text-xl font-bold text-primary">Gestion de la Maintenance (MP)</h4>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-end gap-6 bg-surface-container-low p-6 rounded-xl border border-surface-container">
                <div className="flex-grow space-y-3">
                  <label className="text-xs font-bold tracking-wider text-secondary uppercase">Par Client (Ciblé)</label>
                  <select 
                    value={resetClient}
                    onChange={(e) => setResetClient(e.target.value)}
                    className="w-full bg-white border border-surface-container focus:border-primary focus:ring-0 text-sm py-3 px-4 rounded-lg cursor-pointer"
                  >
                    <option value="">Sélectionner un client...</option>
                    {clients.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button 
                  onClick={() => {
                    if(!resetClient) return;
                    if(confirm(`Réinitialiser TOUTES les agences du client "${resetClient}" ?`)) {
                      resetMPForClient(resetClient);
                      setResetClient('');
                    }
                  }}
                  disabled={!resetClient}
                  className="px-10 py-3 bg-secondary text-white font-bold rounded-lg shadow-sm hover:opacity-90 transition-all disabled:opacity-30 uppercase text-[10px] tracking-widest whitespace-nowrap"
                >
                  Réinitialiser le client
                </button>
              </div>

              <div className="bg-error/5 p-6 rounded-xl border border-error/20 flex flex-col items-center gap-4">
                <div className="text-center">
                  <h5 className="font-bold text-error uppercase tracking-widest text-xs mb-1">Zone de Danger (Global)</h5>
                  <p className="text-[11px] text-on-surface-variant font-medium">Réinitialiser l'état MP de absolument TOUTES les agences du système.</p>
                </div>
                <button 
                  onClick={() => {
                    if(confirm("ATTENTION : Cela va réinitialiser les cases MP de TOUTES les agences du système. Continuer ?")) {
                      resetAllMP();
                    }
                  }}
                  className="px-12 py-3 bg-error text-white font-black rounded-lg shadow-md hover:scale-105 transition-all uppercase text-[10px] tracking-widest"
                >
                  Tout réinitialiser (MP)
                </button>
              </div>
            </div>
            <p className="text-[11px] text-on-surface-variant italic font-medium">
              Note: Cette action remettra toutes les cases "MP" à l'état décoché pour le client sélectionné.
            </p>
          </div>
        </div>

        {/* Data Import Footer Section (Full Width Now) */}
        <div className="lg:col-span-12">
          <div className="bg-white p-8 rounded-xl border border-surface-container shadow-sm flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
            {!isUnlocked && (
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-white/80 px-4 py-2 rounded-full border border-surface-container flex items-center gap-2">
                  <Lock size={12} className="text-on-surface-variant" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Import restreint</span>
                </div>
              </div>
            )}
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
              className={cn(
                "flex-grow w-full border-2 border-dashed border-surface-container rounded-xl p-8 bg-surface-container-low text-center hover:bg-surface-container transition-colors group flex flex-col items-center relative",
                isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              )}
              onClick={() => isUnlocked && document.getElementById('csv-import')?.click()}
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
          <div className="relative">
            {showGlobalResetConfirm ? (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 bg-error/10 p-2 rounded-lg border border-error/20">
                <span className="text-error font-black uppercase tracking-widest text-[9px]">Confirmer Reset Total ?</span>
                <button 
                  onClick={() => {
                    clearAllData();
                    window.location.reload();
                  }}
                  className="bg-error text-white px-3 py-1 rounded-md text-[9px] font-black uppercase"
                >
                  OUI, TOUT EFFACER
                </button>
                <button 
                  onClick={() => setShowGlobalResetConfirm(false)}
                  className="text-on-surface-variant hover:text-on-surface px-2 py-1 text-[9px] font-black uppercase"
                >
                  ANNULER
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowGlobalResetConfirm(true)}
                className="flex items-center gap-1 uppercase tracking-wider font-bold text-error hover:underline transition-all"
              >
                Réinitialiser l'application & Utilisateurs
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={14} className="text-tertiary" />
          <span className="font-bold uppercase tracking-wider">Synchronisation stable</span>
        </div>
      </footer>
    </div>
  );
}
