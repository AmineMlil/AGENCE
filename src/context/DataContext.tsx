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
}

interface DataContextType {
  cities: string[];
  clients: string[];
  agencies: Agency[];
  addCity: (city: string) => void;
  removeCity: (city: string) => void;
  updateCity: (oldName: string, newName: string) => void;
  addClient: (client: string) => void;
  removeClient: (client: string) => void;
  updateClient: (oldName: string, newName: string) => void;
  addAgency: (agency: Agency) => void;
  updateAgency: (id: string, updates: Partial<Agency>) => void;
  removeAgency: (id: string) => void;
  importBulkData: (newCities: string[], newClients: string[], newAgencies?: Agency[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [cities, setCities] = useState<string[]>(() => {
    const saved = localStorage.getItem('ncrm_cities');
    return saved ? JSON.parse(saved) : ['Paris', 'Lyon', 'Marseille', 'Bordeaux'];
  });

  const [clients, setClients] = useState<string[]>(() => {
    const saved = localStorage.getItem('ncrm_clients');
    return saved ? JSON.parse(saved) : ['Industries Globales SAS', 'Logistique Avancée S.A.', 'Vector Manufacturing'];
  });

  const [agencies, setAgencies] = useState<Agency[]>(() => {
    const saved = localStorage.getItem('ncrm_agencies');
    return saved ? JSON.parse(saved) : [
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

  useEffect(() => {
    localStorage.setItem('ncrm_cities', JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    localStorage.setItem('ncrm_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('ncrm_agencies', JSON.stringify(agencies));
  }, [agencies]);

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

  return (
    <DataContext.Provider value={{ 
      cities, 
      clients, 
      agencies,
      addCity, 
      removeCity, 
      updateCity, 
      addClient, 
      removeClient, 
      updateClient,
      addAgency,
      updateAgency,
      removeAgency,
      importBulkData
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
