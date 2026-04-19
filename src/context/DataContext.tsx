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
      return saved ? JSON.parse(saved) : ['Paris', 'Lyon', 'Marseille', 'Bordeaux'];
    } catch (e) {
      console.error("Failed to load cities", e);
      return ['Paris', 'Lyon', 'Marseille', 'Bordeaux'];
    }
  });

  const [clients, setClients] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ncrm_clients');
      return saved ? JSON.parse(saved) : ['Industries Globales SAS', 'Logistique Avancée S.A.', 'Vector Manufacturing'];
    } catch (e) {
      console.error("Failed to load clients", e);
      return ['Industries Globales SAS', 'Logistique Avancée S.A.', 'Vector Manufacturing'];
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
      { 
        id: 'HUB-LY-001', 
        name: 'Lyon Nord - Distribution', 
        city: 'Lyon', 
        client: 'Industries Globales SAS', 
        vehiclesCount: 42, 
        sn: 'SN-LY-001', 
        tid: 'TID-4422',
        ipAddress: '192.168.1.10',
        computerName: 'NCRM-REMOTE-01',
        remotePort: '8080',
        remoteAddress: 'remote.ncrm.io'
      },
      { id: 'DEP-BX-012', name: 'Bordeaux Sud - Maintenance', city: 'Bordeaux', client: 'Logistique Avancée S.A.', vehiclesCount: 18, sn: 'SN-BX-012' },
      { id: 'LOG-PA-045', name: 'Paris Est - Logistique', city: 'Paris', client: 'Vector Manufacturing', vehiclesCount: 55, sn: 'SN-PA-045' },
      { id: 'HUB-MA-009', name: 'Marseille Port - Transit', city: 'Marseille', client: 'Industries Globales SAS', vehiclesCount: 30, sn: 'SN-MA-009' },
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
    setCities(['Paris', 'Lyon', 'Marseille', 'Bordeaux']);
    setClients(['Industries Globales SAS', 'Logistique Avancée S.A.', 'Vector Manufacturing']);
    setAgencies([
      { id: 'HUB-LY-001', name: 'Lyon Nord - Distribution', city: 'Lyon', client: 'Industries Globales SAS', vehiclesCount: 42, sn: 'SN-LY-001' },
      { id: 'DEP-BX-012', name: 'Bordeaux Sud - Maintenance', city: 'Bordeaux', client: 'Logistique Avancée S.A.', vehiclesCount: 18, sn: 'SN-BX-012' },
      { id: 'LOG-PA-045', name: 'Paris Est - Logistique', city: 'Paris', client: 'Vector Manufacturing', vehiclesCount: 55, sn: 'SN-PA-045' },
      { id: 'HUB-MA-009', name: 'Marseille Port - Transit', city: 'Marseille', client: 'Industries Globales SAS', vehiclesCount: 30, sn: 'SN-MA-009' },
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
