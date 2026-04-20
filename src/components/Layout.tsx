import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Building2, Settings, Menu, User, LogOut, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const Sidebar = ({ isExpanded, setIsExpanded }: { isExpanded: boolean, setIsExpanded: (v: boolean) => void }) => {
  const location = useLocation();
  const { currentUser, logout } = useData();

  const topItems = [
    { icon: Filter, label: 'Filtre', path: '/dashboard' },
    { icon: Building2, label: 'Agences', path: '/fleet' },
  ];

  const bottomItems = [
    { icon: User, label: 'Mon Profil', path: '/profile' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
  ];

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar-bg dark:bg-slate-950 flex flex-col gap-1 p-4 border-r border-surface-container transition-all duration-300 z-[60]",
          "lg:translate-x-0 lg:w-64", // Always wide on desktop
          !isExpanded && "-translate-x-full lg:translate-x-0",
          isExpanded ? "w-64 translate-x-0" : "w-20"
        )}
      >
      <div className="mt-4" /> {/* Space at the top instead of logo */}

      <nav className="flex-grow space-y-1">
        {topItems.map((item) => {
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
                {(isExpanded || true) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn(
                      "font-inter text-sm tracking-[0.02em] whitespace-nowrap lg:opacity-100 transition-opacity",
                      !isExpanded && "lg:block hidden"
                    )}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 pt-6 border-t border-slate-200/10 mb-4">
        {bottomItems.map((item) => {
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
                {(isExpanded || true) && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn(
                      "font-inter text-sm tracking-[0.02em] whitespace-nowrap lg:opacity-100 transition-opacity",
                      !isExpanded && "lg:block hidden"
                    )}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
        
        <button
          onClick={logout}
          className={cn(
            "w-full px-4 py-3 flex items-center gap-3 rounded-lg transition-all duration-300 ease-in-out group text-error hover:bg-error/10"
          )}
        >
          <LogOut size={20} className="text-error" />
          <AnimatePresence>
            {(isExpanded || true) && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className={cn(
                  "font-inter text-sm tracking-[0.02em] font-bold whitespace-nowrap lg:opacity-100 transition-opacity",
                  !isExpanded && "lg:block hidden"
                )}
              >
                Déconnexion
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <Link 
        to="/profile"
        className="flex items-center gap-4 px-4 pb-4 overflow-hidden hover:bg-white/5 transition-colors cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden shadow-lg group-hover:scale-110 transition-transform bg-white border border-primary/10">
          <img 
            src="/avatar-admin.png" 
            alt="Avatar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback if the image hasn't been uploaded yet
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=b6e3f4`;
            }}
          />
        </div>
        {(isExpanded || true) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              "flex flex-col whitespace-nowrap overflow-hidden lg:opacity-100 transition-opacity",
              !isExpanded && "lg:block hidden"
            )}
          >
            <span className="font-semibold text-sm text-primary dark:text-blue-100 truncate w-32 group-hover:underline">{currentUser?.name}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{currentUser?.role === 'admin' ? 'Administrateur' : 'Agent'}</span>
          </motion.div>
        )}
      </Link>
    </aside>
    </>
  );
};

const TopBar = ({ onMenuClick, isSidebarExpanded }: { onMenuClick: () => void, isSidebarExpanded: boolean }) => {
  const { currentUser } = useData();
  return (
    <header className="bg-white dark:bg-slate-900 flex justify-between items-center px-4 sm:px-8 h-20 w-full sticky top-0 z-50 border-b border-surface-container shrink-0">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Burger menu removed for web as requested */}
        <div className="lg:hidden">
          <button 
            onClick={onMenuClick}
            className="text-primary dark:text-blue-400 p-3 hover:bg-surface-container rounded-lg transition-colors active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Menu size={24} />
          </button>
        </div>
        <div className="text-on-surface-variant font-black text-xl uppercase tracking-tighter ml-2 lg:hidden">
          NCRM
        </div>
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

const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { icon: Filter, label: 'Filtre', path: '/dashboard' },
    { icon: Building2, label: 'Agences', path: '/fleet' },
    { icon: User, label: 'Profil', path: '/profile' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-container h-16 flex items-center justify-around px-2 z-[100] lg:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300 px-3",
              isActive ? "text-primary" : "text-on-surface-variant/60"
            )}
          >
            <item.icon size={20} className={cn(isActive && "scale-110")} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            {isActive && <motion.div layoutId="bottomNavDot" className="w-1 h-1 bg-primary rounded-full" />}
          </Link>
        );
      })}
    </nav>
  );
};

export default function Layout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setIsSidebarExpanded(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden lg:block">
        <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      </div>
      
      {/* Mobile Drawer Sidebar */}
      <div className="lg:hidden">
        <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />
      </div>

      <div className={cn(
        "flex-grow transition-all duration-300 w-full min-w-0 pb-16 lg:pb-0",
        "lg:pl-64" // Wide sidebar adjustment
      )}>
        <TopBar onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)} isSidebarExpanded={isSidebarExpanded} />
        <main className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
