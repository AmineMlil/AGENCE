import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Agency {
  id: string;
  name: string;
  city: string;
  client: string;
  vehiclesCount: number;
  sn?: string;
  tid?: string;
  ipAddress?: string;
  subnetMask?: string;
  gateway?: string;
  dns?: string;
  gps?: string;
  computerName?: string;
  remotePort?: string;
  remoteAddress?: string;
  isMP?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password?: string;
  createdAt: string;
}

interface DataContextType {
  cities: string[];
  clients: string[];
  agencies: Agency[];
  users: User[];
  currentUser: User | null;
  addCity: (city: string) => void;
  removeCity: (city: string) => void;
  updateCity: (oldName: string, newName: string) => void;
  addClient: (client: string) => void;
  removeClient: (client: string) => void;
  updateClient: (oldName: string, newName: string) => void;
  addAgency: (agency: Agency) => void;
  updateAgency: (id: string, updates: Partial<Agency>) => void;
  removeAgency: (id: string) => void;
  addUser: (user: User) => void;
  removeUser: (id: string) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  updatePassword: (userId: string, newPassword: string) => void;
  importBulkData: (newCities: string[], newClients: string[], newAgencies?: Agency[]) => void;
  clearAllData: () => void;
  toggleMP: (agencyId: string) => void;
  resetMPForClient: (clientName: string) => void;
  resetAllMP: () => void;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [cities, setCities] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ncrm_cities');
      return saved ? JSON.parse(saved) : ['Casablanca', 'Berrechid', 'Rabat', 'Tanger', 'Marrakech'];
    } catch (e) {
      console.error("Failed to load cities", e);
      return ['Casablanca', 'Berrechid', 'Rabat', 'Tanger', 'Marrakech'];
    }
  });

  const [clients, setClients] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ncrm_clients');
      return saved ? JSON.parse(saved) : [
        'Al Akhdar Bank', 'ABB', 'AWB', 'Bank Al Yousr', 'BCP', 'BMCE', 'BMCI', 
        'CFG', 'CIH', 'CAM', 'CDM', 'SAHAM', 'UMNIA', 'Wafa Cash', 'Arab Bank', 'HPS', 'TGR'
      ];
    } catch (e) {
      console.error("Failed to load clients", e);
      return ['Al Akhdar Bank', 'ABB', 'AWB', 'Bank Al Yousr', 'BCP', 'BMCE', 'BMCI', 'CFG', 'CIH', 'CAM', 'CDM', 'SAHAM', 'UMNIA'];
    }
  });

  const [agencies, setAgencies] = useState<Agency[]>(() => {
    try {
      const saved = localStorage.getItem('ncrm_agencies');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load agencies", e);
    }
    return [
      { id: 'IMP-001', name: 'AAB Casa Yacoub El Mansour Ex CAM', city: 'Casablanca', client: 'Al Akhdar Bank', vehiclesCount: 12, sn: '52223851' },
      { id: 'IMP-002', name: 'ABB Casa Brahim Roudani', city: 'Casablanca', client: 'ABB', vehiclesCount: 8, sn: '54652759' },
      { id: 'IMP-003', name: 'ABB CASA GHANDI 2', city: 'Casablanca', client: 'ABB', vehiclesCount: 15, sn: '60307101' },
      { id: 'IMP-004', name: 'ABB CASA GHANDI', city: 'Casablanca', client: 'ABB', vehiclesCount: 10, sn: '60306635' },
      { id: 'IMP-005', name: 'ABB Casa Maarif', city: 'Casablanca', client: 'ABB', vehiclesCount: 22, sn: '54055009' },
      { id: 'IMP-006', name: 'AWB Casa Romandie', city: 'Casablanca', client: 'AWB', vehiclesCount: 30, sn: '50779787' },
      { id: 'IMP-007', name: 'AWB Casa Porta Anfa CA', city: 'Casablanca', client: 'AWB', vehiclesCount: 5, sn: '59863297' },
      { id: 'IMP-008', name: 'AWB Casa Maarif 354', city: 'Casablanca', client: 'AWB', vehiclesCount: 14, sn: '54057441' },
      { id: 'IMP-009', name: 'AWB Casa Porta Anfa CA', city: 'Casablanca', client: 'AWB', vehiclesCount: 25, sn: '50796732' },
      { id: 'IMP-010', name: 'AWB Casa Socrate', city: 'Casablanca', client: 'AWB', vehiclesCount: 18, sn: '51661393' },
      { id: 'IMP-011', name: 'AWB Casa Socrate', city: 'Casablanca', client: 'AWB', vehiclesCount: 12, sn: '51661396' },
      { id: 'IMP-012', name: 'AWB Casa Riviera -Eperviers-', city: 'Casablanca', client: 'AWB', vehiclesCount: 7, sn: '50779791' },
      { id: 'IMP-013', name: 'AWB Casa Porta Anfa CA', city: 'Casablanca', client: 'AWB', vehiclesCount: 9, sn: '59863290' },
      { id: 'IMP-014', name: 'AWB Casa Riviera', city: 'Casablanca', client: 'AWB', vehiclesCount: 11, sn: '62690228' },
      { id: 'IMP-015', name: 'AWB Casa Palmier', city: 'Casablanca', client: 'AWB', vehiclesCount: 33, sn: '50780161' },
      { id: 'IMP-016', name: 'AWB Bank Assafa Casa Palmier 9 Avril', city: 'Casablanca', client: 'AWB', vehiclesCount: 16, sn: '50796698' },
      { id: 'IMP-017', name: 'AWB Casa Romandie', city: 'Casablanca', client: 'AWB', vehiclesCount: 20, sn: '51661427' },
      { id: 'IMP-018', name: 'AWB Bank Assafa Casa Ghandi', city: 'Casablanca', client: 'AWB', vehiclesCount: 13, sn: '50796737' },
      { id: 'IMP-019', name: 'AWB Casa Standhal', city: 'Casablanca', client: 'AWB', vehiclesCount: 41, sn: '90066159' },
      { id: 'IMP-020', name: 'AWB Casa Romandie', city: 'Casablanca', client: 'AWB', vehiclesCount: 12, sn: '51661423' },
      { id: 'IMP-021', name: 'Bank Al Yousr Casa Ghandi', city: 'Casablanca', client: 'Bank Al Yousr', vehiclesCount: 5, sn: '54478721' },
      { id: 'IMP-022', name: 'BP Casa Tarik El Jadida Al Fath', city: 'Casablanca', client: 'BCP', vehiclesCount: 22, sn: '49018982' },
      { id: 'IMP-023', name: 'BP Casa Socrate', city: 'Casablanca', client: 'BCP', vehiclesCount: 15, sn: '45178468' },
      { id: 'IMP-024', name: 'BP Casa Al Fath CA', city: 'Casablanca', client: 'BCP', vehiclesCount: 8, sn: '50802129' },
      { id: 'IMP-025', name: 'BP Casa Yacoub El Mansour', city: 'Casablanca', client: 'BCP', vehiclesCount: 10, sn: '46053865' },
      { id: 'IMP-026', name: 'BMCE CASA YACOUB EL MANSOUR', city: 'Casablanca', client: 'BMCE', vehiclesCount: 19, sn: '60686836' },
      { id: 'IMP-027', name: 'BMCE MAARIF BIR ANZARANE', city: 'Casablanca', client: 'BMCE', vehiclesCount: 11, sn: '60686853' },
      { id: 'IMP-028', name: 'BMCI Casa Yacoub El Mansour', city: 'Casablanca', client: 'BMCI', vehiclesCount: 7, sn: '58380258' },
      { id: 'IMP-029', name: 'CFG Casa Paul Zivaco', city: 'Casablanca', client: 'CFG', vehiclesCount: 4, sn: '54480655' },
      { id: 'IMP-030', name: 'CIH Casa Romandie', city: 'Casablanca', client: 'CIH', vehiclesCount: 16, sn: '60452412' },
      { id: 'IMP-031', name: 'CAM Casa Onapar', city: 'Casablanca', client: 'CAM', vehiclesCount: 9, sn: '52223045' },
      { id: 'IMP-032', name: 'CDM Casa Socrate', city: 'Casablanca', client: 'CDM', vehiclesCount: 13, sn: '54054181' },
      { id: 'IMP-033', name: 'Casa EQDOM', city: 'Casablanca', client: 'SAHAM', vehiclesCount: 5, sn: '50798547' },
      { id: 'IMP-034', name: 'UMNIA BANK Casa Siege', city: 'Casablanca', client: 'UMNIA', vehiclesCount: 10, sn: '52964455' },
      { id: 'IMP-035', name: 'TGR SETTAT', city: 'Berrechid', client: 'TGR', vehiclesCount: 1, sn: '58382165' },
      { id: 'IMP-036', name: 'TGR Casa Nouacer TP', city: 'Berrechid', client: 'TGR', vehiclesCount: 1, sn: '90076575' },
      { id: 'IMP-037', name: 'Settat Hassan II', city: 'Berrechid', client: 'CDM', vehiclesCount: 11, sn: '59349932' },
      { id: 'IMP-038', name: 'Berrechid Med V 0258', city: 'Berrechid', client: 'AWB', vehiclesCount: 6, sn: '55704511' },
    ];
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('ncrm_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load users", e);
    }
    return [
      { id: 'USR-001', name: 'Admin Principal', email: 'admin@ncr-maroc.com', role: 'admin', password: 'admin', createdAt: new Date().toISOString() },
      { id: 'USR-002', name: 'Agent Logistique', email: 'agent@ncr-maroc.com', role: 'user', password: 'user', createdAt: new Date().toISOString() },
    ];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = sessionStorage.getItem('ncrm_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem('ncrm_current_user', JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem('ncrm_current_user');
      }
    } catch (e) {
      console.error("Failed to save current user", e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('ncrm_cities', JSON.stringify(cities));
    } catch (e) {
      console.error("Failed to save cities", e);
    }
  }, [cities]);

  useEffect(() => {
    try {
      localStorage.setItem('ncrm_clients', JSON.stringify(clients));
    } catch (e) {
      console.error("Failed to save clients", e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem('ncrm_agencies', JSON.stringify(agencies));
    } catch (e) {
      console.error("Failed to save agencies", e);
    }
  }, [agencies]);

  useEffect(() => {
    try {
      localStorage.setItem('ncrm_users', JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users", e);
    }
  }, [users]);

  const clearAllData = () => {
    localStorage.removeItem('ncrm_cities');
    localStorage.removeItem('ncrm_clients');
    localStorage.removeItem('ncrm_agencies');
    localStorage.removeItem('ncrm_users');
    setCities(['Casablanca', 'Berrechid', 'Rabat', 'Tanger', 'Marrakech']);
    setClients([
      'Al Akhdar Bank', 'ABB', 'AWB', 'Bank Al Yousr', 'BCP', 'BMCE', 'BMCI', 
      'CFG', 'CIH', 'CAM', 'CDM', 'SAHAM', 'UMNIA', 'Wafa Cash', 'Arab Bank', 'HPS', 'TGR'
    ]);
    setAgencies([
      { id: 'IMP-001', name: 'AAB Casa Yacoub El Mansour Ex CAM', city: 'Casablanca', client: 'Al Akhdar Bank', vehiclesCount: 12, sn: '52223851' },
      { id: 'IMP-002', name: 'ABB Casa Brahim Roudani', city: 'Casablanca', client: 'ABB', vehiclesCount: 8, sn: '54652759' },
      { id: 'IMP-003', name: 'ABB CASA GHANDI 2', city: 'Casablanca', client: 'ABB', vehiclesCount: 15, sn: '60307101' },
      { id: 'IMP-004', name: 'ABB CASA GHANDI', city: 'Casablanca', client: 'ABB', vehiclesCount: 10, sn: '60306635' },
      { id: 'IMP-005', name: 'ABB Casa Maarif', city: 'Casablanca', client: 'ABB', vehiclesCount: 22, sn: '54055009' },
      { id: 'IMP-006', name: 'AWB Casa Romandie', city: 'Casablanca', client: 'AWB', vehiclesCount: 30, sn: '50779787' },
      { id: 'IMP-035', name: 'TGR SETTAT', city: 'Berrechid', client: 'TGR', vehiclesCount: 1, sn: '58382165' },
    ]);
    setUsers([
      { id: 'USR-001', name: 'Admin Principal', email: 'admin@ncr-maroc.com', role: 'admin', password: 'admin', createdAt: new Date().toISOString() },
      { id: 'USR-002', name: 'Agent Logistique', email: 'agent@ncr-maroc.com', role: 'user', password: 'user', createdAt: new Date().toISOString() },
    ]);
  };

  const addCity = (city: string) => {
    if (city && !cities.includes(city)) {
      setCities([...cities, city]);
    }
  };

  const removeCity = (city: string) => {
    setCities(cities.filter(c => c !== city));
  };

  const updateCity = (oldName: string, newName: string) => {
    if (newName && !cities.includes(newName)) {
      setCities(cities.map(c => (c === oldName ? newName : c)));
      setAgencies(prev => prev.map(a => a.city === oldName ? { ...a, city: newName } : a));
    }
  };

  const addClient = (client: string) => {
    if (client && !clients.includes(client)) {
      setClients([...clients, client]);
    }
  };

  const removeClient = (client: string) => {
    setClients(clients.filter(c => c !== client));
  };

  const updateClient = (oldName: string, newName: string) => {
    if (newName && !clients.includes(newName)) {
      setClients(clients.map(c => (c === oldName ? newName : c)));
      setAgencies(prev => prev.map(a => a.client === oldName ? { ...a, client: newName } : a));
    }
  };

  const addAgency = (agency: Agency) => {
    setAgencies(prev => [...prev, agency]);
  };

  const updateAgency = (id: string, updates: Partial<Agency>) => {
    setAgencies(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const removeAgency = (id: string) => {
    setAgencies(prev => prev.filter(a => a.id !== id));
  };

  const importBulkData = (newCities: string[], newClients: string[], newAgencies?: Agency[]) => {
    setCities(prev => {
      const combined = [...prev, ...newCities];
      return Array.from(new Set(combined.filter(c => c.trim() !== '')));
    });
    setClients(prev => {
      const combined = [...prev, ...newClients];
      return Array.from(new Set(combined.filter(c => c.trim() !== '')));
    });
    if (newAgencies) {
      setAgencies(prev => [...prev, ...newAgencies]);
    }
  };

  const toggleMP = (agencyId: string) => {
    setAgencies(prev => prev.map(a => a.id === agencyId ? { ...a, isMP: !a.isMP } : a));
  };

  const resetMPForClient = (clientName: string) => {
    setAgencies(prev => prev.map(a => a.client === clientName ? { ...a, isMP: false } : a));
  };

  const resetAllMP = () => {
    setAgencies(prev => prev.map(a => ({ ...a, isMP: false })));
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const updatePassword = (userId: string, newPassword: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, password: newPassword } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, password: newPassword } : null);
    }
  };

  const login = (email: string, password?: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      // If a password is provided (it will be passed from Login.tsx), verify it
      if (password && user.password && user.password !== password) {
        return false;
      }
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('ncrm_current_user');
    window.location.href = '/login';
  };

  return (
    <DataContext.Provider value={{ 
      cities, 
      clients, 
      agencies,
      users,
      currentUser,
      addCity, 
      removeCity, 
      updateCity, 
      addClient, 
      removeClient, 
      updateClient,
      addAgency,
      updateAgency,
      removeAgency,
      addUser,
      removeUser,
      updateUser,
      updatePassword,
      importBulkData,
      clearAllData,
      toggleMP,
      resetMPForClient,
      resetAllMP,
      login,
      logout
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
