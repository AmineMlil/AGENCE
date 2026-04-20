import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  deleteDoc, 
  writeBatch,
  query,
  getDocs,
  getDocFromServer
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  signInWithEmailAndPassword,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';

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
  updatedAt?: string;
  updatedBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  password?: string;
  createdAt: string;
}

interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[] | any;
  }
}

const handleFirestoreError = (error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null) => {
  if (error.code === 'permission-denied') {
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType,
      path,
      authInfo: {
        userId: auth.currentUser?.uid || 'anonymous',
        email: auth.currentUser?.email || '',
        emailVerified: auth.currentUser?.emailVerified || false,
        isAnonymous: auth.currentUser?.isAnonymous || true,
        providerInfo: auth.currentUser?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName,
          email: p.email
        }))
      }
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
};

interface DataContextType {
  cities: string[];
  clients: string[];
  agencies: Agency[];
  users: User[];
  currentUser: User | null;
  loading: boolean;
  addCity: (city: string) => Promise<void>;
  removeCity: (city: string) => Promise<void>;
  updateCity: (oldName: string, newName: string) => Promise<void>;
  addClient: (client: string) => Promise<void>;
  removeClient: (client: string) => Promise<void>;
  updateClient: (oldName: string, newName: string) => Promise<void>;
  addAgency: (agency: Agency) => Promise<void>;
  updateAgency: (id: string, updates: Partial<Agency>) => Promise<void>;
  removeAgency: (id: string) => Promise<void>;
  addUser: (user: User) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  updatePassword: (userId: string, newPassword: string) => Promise<void>;
  importBulkData: (newCities: string[], newClients: string[], newAgencies?: Agency[]) => Promise<void>;
  clearAllData: () => Promise<void>;
  toggleMP: (agencyId: string) => Promise<void>;
  resetMPForClient: (clientName: string) => Promise<void>;
  resetAllMP: () => Promise<void>;
  login: (email: string, password?: string) => Promise<void>;
  createNewUserManual: (email: string, password: string, name: string, role: 'admin' | 'user') => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DEFAULT_CITIES = ['Casablanca', 'Berrechid', 'Rabat', 'Tanger', 'Marrakech'];
const DEFAULT_CLIENTS = [
  'Al Akhdar Bank', 'ABB', 'AWB', 'Bank Al Yousr', 'BCP', 'BMCE', 'BMCI', 
  'CFG', 'CIH', 'CAM', 'CDM', 'SAHAM', 'UMNIA', 'Wafa Cash', 'Arab Bank', 'HPS', 'TGR'
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [cities, setCities] = useState<string[]>(DEFAULT_CITIES);
  const [clients, setClients] = useState<string[]>(DEFAULT_CLIENTS);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Test connection on boot
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Sync user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setCurrentUser({
            id: firebaseUser.uid,
            ...userDoc.data() as Omit<User, 'id'>
          });
        } else {
          // New user defaults
          const newUser: Omit<User, 'id'> = {
            name: firebaseUser.displayName || 'Nouvel Utilisateur',
            email: firebaseUser.email || '',
            role: firebaseUser.email === 'amine.mlil23@gmail.com' ? 'admin' : 'user',
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setCurrentUser({ id: firebaseUser.uid, ...newUser });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Real-time sync for metadata
    const unsubMeta = onSnapshot(doc(db, 'metadata', 'config'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.cities) setCities(data.cities);
        if (data.clients) setClients(data.clients);
      }
    });

    // Real-time sync for agencies
    const unsubAgencies = onSnapshot(collection(db, 'agencies'), (snap) => {
      const agencyList = snap.docs.map(d => ({ id: d.id, ...d.data() } as Agency));
      setAgencies(agencyList);
    });

    // Real-time sync for users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const userList = snap.docs.map(d => ({ id: d.id, ...d.data() } as User));
      setUsers(userList);
    });

    return () => {
      unsubMeta();
      unsubAgencies();
      unsubUsers();
    };
  }, [currentUser]);

  const updateMetadata = async (newCities: string[], newClients: string[]) => {
    try {
      await setDoc(doc(db, 'metadata', 'config'), { cities: newCities, clients: newClients });
    } catch (e) {
      handleFirestoreError(e, 'update', 'metadata/config');
    }
  };

  const addCity = async (city: string) => {
    if (city && !cities.includes(city)) {
      const next = [...cities, city];
      await updateMetadata(next, clients);
    }
  };

  const removeCity = async (city: string) => {
    const next = cities.filter(c => c !== city);
    await updateMetadata(next, clients);
  };

  const updateCity = async (oldName: string, newName: string) => {
    if (newName && !cities.includes(newName)) {
      const next = cities.map(c => (c === oldName ? newName : c));
      await updateMetadata(next, clients);
    }
  };

  const addClient = async (client: string) => {
    if (client && !clients.includes(client)) {
      const next = [...clients, client];
      await updateMetadata(cities, next);
    }
  };

  const removeClient = async (client: string) => {
    const next = clients.filter(c => c !== client);
    await updateMetadata(cities, next);
  };

  const updateClient = async (oldName: string, newName: string) => {
    if (newName && !clients.includes(newName)) {
      const next = clients.map(c => (c === oldName ? newName : c));
      await updateMetadata(cities, next);
    }
  };

  const addAgency = async (agency: Agency) => {
    try {
      const { id, ...data } = agency;
      await setDoc(doc(db, 'agencies', id), {
        ...data,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid
      });
    } catch (e) {
      handleFirestoreError(e, 'create', `agencies/${agency.id}`);
    }
  };

  const updateAgency = async (id: string, updates: Partial<Agency>) => {
    try {
      await updateDoc(doc(db, 'agencies', id), {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.uid
      });
    } catch (e) {
      handleFirestoreError(e, 'update', `agencies/${id}`);
    }
  };

  const removeAgency = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'agencies', id));
    } catch (e) {
      handleFirestoreError(e, 'delete', `agencies/${id}`);
    }
  };

  const importBulkData = async (newCities: string[], newClients: string[], newAgencies?: Agency[]) => {
    const batch = writeBatch(db);
    
    // Process cities & clients
    const finalCities = Array.from(new Set([...cities, ...newCities].filter(c => c.trim() !== '')));
    const finalClients = Array.from(new Set([...clients, ...newClients].filter(c => c.trim() !== '')));
    
    batch.set(doc(db, 'metadata', 'config'), { cities: finalCities, clients: finalClients });

    // Process agencies
    if (newAgencies) {
      newAgencies.forEach(a => {
        const { id, ...data } = a;
        batch.set(doc(db, 'agencies', id), {
          ...data,
          updatedAt: new Date().toISOString(),
          updatedBy: auth.currentUser?.uid
        });
      });
    }

    try {
      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, 'write', 'bulk_import');
    }
  };

  const clearAllData = async () => {
    const batch = writeBatch(db);
    
    // Clear agencies (note: batch limit is 500)
    agencies.forEach(a => {
      batch.delete(doc(db, 'agencies', a.id));
    });

    batch.set(doc(db, 'metadata', 'config'), { cities: DEFAULT_CITIES, clients: DEFAULT_CLIENTS });

    try {
      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, 'delete', 'clear_all');
    }
  };

  const toggleMP = async (agencyId: string) => {
    const agency = agencies.find(a => a.id === agencyId);
    if (agency) {
      await updateAgency(agencyId, { isMP: !agency.isMP });
    }
  };

  const resetMPForClient = async (clientName: string) => {
    const batch = writeBatch(db);
    agencies.filter(a => a.client === clientName).forEach(a => {
      batch.update(doc(db, 'agencies', a.id), { isMP: false });
    });
    await batch.commit();
  };

  const resetAllMP = async () => {
    const batch = writeBatch(db);
    agencies.forEach(a => {
      batch.update(doc(db, 'agencies', a.id), { isMP: false });
    });
    await batch.commit();
  };

  const addUser = async (user: User) => {
    const { id, ...data } = user;
    await setDoc(doc(db, 'users', id), data);
  };

  const removeUser = async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    await updateDoc(doc(db, 'users', id), updates);
  };

  const updatePassword = async (userId: string, newPassword: string) => {
    await updateDoc(doc(db, 'users', userId), { password: newPassword });
  };

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error("Le mot de passe est requis.");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const createNewUserManual = async (email: string, password: string, name: string, role: 'admin' | 'user') => {
    if (currentUser?.role !== 'admin') {
      throw new Error("Seul l'administrateur peut créer des utilisateurs.");
    }

    const response = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        role,
        requesterEmail: currentUser.email
      })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Erreur lors de la création de l'utilisateur.");
    }

    // Create user record in Firestore
    await setDoc(doc(db, 'users', result.uid), {
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  return (
    <DataContext.Provider value={{ 
      cities, 
      clients, 
      agencies,
      users,
      currentUser,
      loading,
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
      createNewUserManual,
      loginWithGoogle,
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
