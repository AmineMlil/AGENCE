import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Building2, Settings, Menu, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useData } from '../context/DataContext';

const Sidebar = ({ isExpanded, setIsExpanded }: { isExpanded: boolean, setIsExpanded: (v: boolean) => void }) => {
  const location = useLocation();
  const { currentUser, logout } = useData();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CreditCard, label: 'Liste des agences', path: '/fleet' },
    { icon: User, label: 'Mon Profil', path: '/profile' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
  ];

  return (
    <aside 
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar-bg dark:bg-slate-950 flex flex-col gap-1 p-4 border-r border-surface-container transition-all duration-300 z-[60]",
        isExpanded ? "w-60" : "w-20"
      )}
    >
      <Link to="/dashboard" className="mb-8 px-4 py-2 block">
        <h1 className={cn(
          "text-primary dark:text-blue-100 font-black text-2xl tracking-tighter transition-opacity duration-300",
          !isExpanded && "opacity-0"
        )}>
          NCRM
        </h1>
        {isExpanded && <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Votre partenaire métier</p>}
        {!isExpanded && <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black">N</div>}
      </Link>

      <nav className="flex-grow space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-3 flex items-center gap-3 rounded-lg transition-all duration-300 ease-in-out group",
                isActive 
                  ? "bg-primary-container text-primary font-semibold border-r-4 border-primary rounded-r-none" 
                  : "text-on-surface-variant hover:bg-surface-container-low"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-primary" : "text-slate-500")} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-inter text-sm tracking-[0.02em] whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
        
        <button
          onClick={() => {
            logout();
          }}
          className={cn(
            "w-full px-4 py-3 flex items-center gap-3 rounded-lg transition-all duration-300 ease-in-out group text-error hover:bg-error/10"
          )}
        >
          <LogOut size={20} className="text-error" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-inter text-sm tracking-[0.02em] font-bold whitespace-nowrap"
              >
                Déconnexion
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      <Link 
        to="/profile"
        className="mt-auto pt-6 border-t border-slate-200/10 flex items-center gap-4 px-4 pb-4 overflow-hidden hover:bg-white/5 transition-colors cursor-pointer group"
      >
        <div className={cn(
          "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xs text-white shadow-lg group-hover:scale-110 transition-transform",
          currentUser?.role === 'admin' ? "bg-primary" : "bg-secondary"
        )}>
          {currentUser?.name.charAt(0)}
        </div>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col whitespace-nowrap overflow-hidden"
          >
            <span className="font-semibold text-sm text-primary dark:text-blue-100 truncate w-32 group-hover:underline">{currentUser?.name}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{currentUser?.role === 'admin' ? 'Administrateur' : 'Agent'}</span>
          </motion.div>
        )}
      </Link>
    </aside>
  );
};

const TopBar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const { currentUser } = useData();
  return (
    <header className="bg-white dark:bg-slate-900 flex justify-between items-center px-8 h-20 w-full sticky top-0 z-50 border-b border-surface-container ml-0 lg:ml-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="text-primary dark:text-blue-400 p-2 hover:bg-surface-container rounded-lg transition-colors active:scale-90"
        >
          <Menu size={20} />
        </button>
        <Link to="/dashboard" className="transition-transform active:scale-95">
          <h2 className="text-primary dark:text-blue-100 font-bold tracking-tighter text-lg uppercase hidden sm:block">
            NCRM
          </h2>
        </Link>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden md:flex gap-4 items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Session active:</span>
          <span className="text-primary dark:text-blue-300 font-black text-xs border-b-2 border-primary pb-1 cursor-default">
            {currentUser?.email}
          </span>
        </div>
      </div>
    </header>
  );
};

export default function Layout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      <div className="flex-grow lg:pl-20 transition-all duration-300">
        <TopBar onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)} />
        <main className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
