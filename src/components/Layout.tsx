import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Building2, Settings, Menu, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Truck, label: 'Liste des agences', path: '/fleet' },
    { icon: Settings, label: 'Paramètres', path: '/settings' },
  ];

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar-bg dark:bg-slate-950 flex flex-col gap-1 p-4 border-r border-surface-container transition-all duration-300 z-[60]",
        isHovered ? "w-60" : "w-20"
      )}
    >
      <div className="mb-8 px-4 py-2">
        <h1 className={cn(
          "text-primary dark:text-blue-100 font-black text-2xl tracking-tighter transition-opacity duration-300",
          !isHovered && "opacity-0"
        )}>
          NCRM
        </h1>
        {isHovered && <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Votre partenaire métier</p>}
        {!isHovered && <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black">N</div>}
      </div>

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
                {isHovered && (
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
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200/10 flex items-center gap-4 px-4 pb-4 overflow-hidden">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex-shrink-0 overflow-hidden">
          <img 
            alt="Manager Avatar" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCg2Ze2UI3vspoNUxe-2gdb-If2g8btCI6La2SFq-ALNEGAqs9nF0E0xB0Ay5ZvCqHqfN0G9cqIh8GOYm7hKwwpL-27JZU_GKDGCkGF6z92kNRSasxEYDLWwayo62MBaJah-rx77XE5dU-2LX_FmFh6xfjQNCxcoG5TRMXWTrVgg8zgmKhvdtXnGMJJr_Vi4paBZLu0v4AGJMVy52f5Eq1cqqWxqoFOTeVnppZ6BhZAIM9-RwKHUy03fm2olX77kdGU-_rXgLwqYog"
            referrerPolicy="no-referrer"
          />
        </div>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col whitespace-nowrap"
          >
            <span className="font-semibold text-sm text-primary dark:text-blue-100">Admin Flotte</span>
            <span className="text-[10px] text-slate-500">v2.4.0</span>
          </motion.div>
        )}
      </div>
    </aside>
  );
};

const TopBar = () => {
  return (
    <header className="bg-white dark:bg-slate-900 flex justify-between items-center px-8 h-20 w-full sticky top-0 z-50 border-b border-surface-container ml-0 lg:ml-0">
      <div className="flex items-center gap-4">
        <button className="text-primary dark:text-blue-400 p-2 hover:bg-surface-container rounded-lg transition-colors">
          <Menu size={20} />
        </button>
        <h2 className="text-primary dark:text-blue-100 font-bold tracking-tighter text-lg uppercase hidden sm:block">
          NCRM
        </h2>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden md:flex gap-8">
          <span className="text-primary dark:text-blue-300 font-bold border-b-2 border-primary pb-1 cursor-pointer">Paramètres Système</span>
        </div>
      </div>
    </header>
  );
};

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow lg:pl-20 transition-all duration-300">
        <TopBar />
        <main className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
