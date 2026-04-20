import { ArrowLeft, Search, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { cn } from '../lib/utils';

export default function Fleet() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agencies, toggleMP } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const activeFilters = {
    city: location.state?.city || 'Toutes les Villes',
    client: location.state?.client || 'Tous les Clients'
  };

  const filteredAgencies = useMemo(() => {
    return agencies.filter(agency => {
      const matchCity = activeFilters.city === 'Toutes les Villes' || agency.city === activeFilters.city;
      const matchClient = activeFilters.client === 'Tous les Clients' || agency.client === activeFilters.client;
      const matchSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agency.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCity && matchClient && matchSearch;
    });
  }, [agencies, activeFilters, searchTerm]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slam-in">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-surface-container rounded-lg text-primary transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Liste des agences</h2>
            <p className="text-xs text-on-surface-variant font-medium tracking-wide uppercase">Gestion de la flotte</p>
          </div>
        </div>
      </header>

      {/* Current Filter Context */}
      <section className="p-6 bg-white rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surface-container shadow-sm">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-outline uppercase block mb-1">Filtre Actuel</span>
          <div className="flex items-center gap-2 text-primary font-bold">
            <span>{activeFilters.city}</span>
            <ChevronRight size={14} className="text-on-surface-variant/40" />
            <span>{activeFilters.client}</span>
          </div>
        </div>
        <div className="px-4 py-2 bg-primary/10 rounded-lg text-primary text-[10px] font-bold uppercase tracking-widest leading-none">
          {filteredAgencies.length} Agences Trouvées
        </div>
      </section>

      {/* Search Bar */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase ml-1">Filtrer par nom ou ID</label>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une agence..."
            className="w-full bg-white border-b-2 border-surface-container focus:border-primary focus:ring-0 py-4 pl-12 pr-4 text-on-surface font-medium placeholder:text-on-surface-variant transition-all rounded-t-lg shadow-sm"
          />
        </div>
      </div>

      {/* Agency List */}
      <div className="space-y-3">
        {filteredAgencies.length === 0 ? (
          <div className="text-center py-16 bg-surface-container-low rounded-xl border border-dashed border-surface-container">
            <p className="text-on-surface-variant text-sm font-medium">
              {(activeFilters.city === 'Toutes les Villes' || activeFilters.client === 'Tous les Clients') 
                ? "Veuillez sélectionner une ville et un client pour afficher les agences."
                : "Aucune agence ne correspond à ces critères."}
            </p>
          </div>
        ) : (
          filteredAgencies.map((agency, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={agency.id}
              className={cn(
                "p-5 rounded-xl border transition-all flex items-center justify-between shadow-sm hover:shadow-md",
                agency.isMP 
                  ? "bg-success border-success text-white shadow-lg scale-[1.02]" 
                  : "bg-white border-surface-container hover:border-primary"
              )}
            >
              <div 
                className="flex-grow cursor-pointer"
                onClick={() => navigate(`/agency/${agency.id}`)}
              >
                <div className="flex items-center gap-3">
                  <h3 className={cn(
                    "text-lg font-bold tracking-tight group-hover:translate-x-1 transition-transform",
                    agency.isMP ? "text-white" : "text-primary"
                  )}>
                    {agency.name}
                  </h3>
                  {agency.isMP && (
                    <span className="text-[10px] font-black bg-white text-success px-1.5 py-0.5 rounded-sm uppercase tracking-tighter shadow-sm">MP OK</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] font-mono uppercase tracking-wider",
                    agency.isMP ? "text-white/80" : "text-on-surface-variant"
                  )}>
                    {agency.id}
                  </span>
                  {agency.sn && (
                    <span className={cn(
                      "text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border",
                      agency.isMP ? "border-white/30 text-white" : "border-surface-container text-primary"
                    )}>
                      SN: {agency.sn}
                    </span>
                  )}
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                    agency.isMP ? "bg-white/20 text-white" : "bg-secondary/5 text-secondary"
                  )}>
                    {agency.city}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMP(agency.id);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl transition-all shadow-sm",
                    agency.isMP ? "text-white bg-white/20 hover:bg-white/30" : "text-on-surface-variant hover:bg-surface-container"
                  )}
                >
                  {agency.isMP ? <CheckSquare size={24} /> : <Square size={24} />}
                  <span className="text-[9px] font-black uppercase tracking-widest">MP</span>
                </button>
                <div onClick={() => navigate(`/agency/${agency.id}`)}>
                  <ChevronRight className={cn(
                    "transition-all group-hover:translate-x-1",
                    agency.isMP ? "text-white" : "text-outline-variant group-hover:text-primary"
                  )} size={20} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Visual Identity Section */}
      <section className="relative h-48 sm:h-60 rounded-2xl overflow-hidden group shadow-xl">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpcZmzhdNUiw3BzEPeDdxbxjE3nbnj-g4tsCltOn0D5YykyeuoheYmL7LGJbtuFfwabvG9cnxcTxxCf6v-Tz_z6Z-qbZDyhN4wrDqlOGAaXlVCP7kUrBvC3HsIcLXTwWQwiVBtD8rdfEyw1eDJEYYaSV2dhb8HXedbWKyBj0TWUCqwW03h5yExUw-noUppbMHtyc1RrUJC9s1tM-49NaDzAOftgAnEgWXku5qcwc1RPNur20YAO7q9sQDkdbmicGbT9SgwBinNSyo"
          alt="Fleet Illustration"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px] flex items-center p-6 sm:p-10">
          <div className="max-w-md">
            <h4 className="text-white text-2xl sm:text-3xl font-black tracking-tighter mb-2 sm:mb-4 uppercase">NCRM</h4>
            <p className="text-blue-100/80 text-xs sm:text-sm leading-relaxed font-medium">
              la liste des agences a porté de main
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
