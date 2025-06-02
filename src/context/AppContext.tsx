import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Vendor, Part, IncomingArticle, InventoryOut, User } from '../types';

// Mock data for initial state
import { mockVendors, mockParts, mockIncomingArticles, mockInventoryOut } from '../data/mockData';

interface AppContextType {
  vendors: Vendor[];
  parts: Part[];
  incomingArticles: IncomingArticle[];
  inventoryOut: InventoryOut[];
  currentUser: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  
  // Vendors
  addVendor: (vendor: Omit<Vendor, 'id'>) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  
  // Parts
  addPart: (part: Omit<Part, 'id'>) => void;
  updatePart: (id: string, part: Partial<Part>) => void;
  deletePart: (id: string) => void;
  
  // Incoming Articles
  addIncomingArticle: (article: Omit<IncomingArticle, 'id' | 'dateCreated' | 'status'>) => void;
  updateIncomingArticle: (id: string, article: Partial<IncomingArticle>) => void;
  deleteIncomingArticle: (id: string) => void;
  
  // Inventory Out
  addInventoryOut: (out: Omit<InventoryOut, 'id' | 'dateOut'>) => void;
  updateInventoryOut: (id: string, out: Partial<InventoryOut>) => void;
  deleteInventoryOut: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // Initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  
  // State
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [incomingArticles, setIncomingArticles] = useState<IncomingArticle[]>([]);
  const [inventoryOut, setInventoryOut] = useState<InventoryOut[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize data
  useEffect(() => {
    try {
      // Simulate API loading
      const loadData = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setVendors(mockVendors);
        setParts(mockParts);
        setIncomingArticles(mockIncomingArticles);
        setInventoryOut(mockInventoryOut);
        
        // Mock user (in real app, this would come from auth)
        setCurrentUser({
          id: 'user1',
          name: 'Admin User',
          email: 'admin@vikasdrones.com',
          role: 'admin',
        });
        setIsAuthenticated(true);
        
        setIsInitialized(true);
      };

      loadData();
    } catch (error) {
      console.error('Failed to initialize app context:', error);
      setIsInitialized(true); // Still mark as initialized to prevent infinite loading
    }
  }, []);

  // Vendors
  const addVendor = (vendor: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendor,
      id: `vendor-${Date.now()}`,
    };
    setVendors([...vendors, newVendor]);
  };

  const updateVendor = (id: string, vendor: Partial<Vendor>) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, ...vendor } : v));
  };

  const deleteVendor = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  // Parts
  const addPart = (part: Omit<Part, 'id'>) => {
    const newPart: Part = {
      ...part,
      id: `part-${Date.now()}`,
    };
    setParts([...parts, newPart]);
  };

  const updatePart = (id: string, part: Partial<Part>) => {
    setParts(parts.map(p => p.id === id ? { ...p, ...part } : p));
  };

  const deletePart = (id: string) => {
    setParts(parts.filter(p => p.id !== id));
  };

  // Incoming Articles
  const addIncomingArticle = (article: Omit<IncomingArticle, 'id' | 'dateCreated' | 'status'>) => {
    const newArticle: IncomingArticle = {
      ...article,
      id: `article-${Date.now()}`,
      dateCreated: new Date().toISOString(),
      status: 'pending',
    };
    setIncomingArticles([...incomingArticles, newArticle]);
  };

  const updateIncomingArticle = (id: string, article: Partial<IncomingArticle>) => {
    setIncomingArticles(incomingArticles.map(a => a.id === id ? { ...a, ...article } : a));

    // If the article is approved, update the inventory
    if (article.status === 'approved') {
      const updatedArticle = incomingArticles.find(a => a.id === id);
      if (updatedArticle) {
        const part = parts.find(p => p.partNumber === updatedArticle.partNumber);
        if (part) {
          const finalQuantity = article.finalAcceptedQuantity || updatedArticle.quantity;
          updatePart(part.id, { 
            currentStock: part.currentStock + finalQuantity 
          });
        }
      }
    }
  };

  const deleteIncomingArticle = (id: string) => {
    setIncomingArticles(incomingArticles.filter(a => a.id !== id));
  };

  // Inventory Out
  const addInventoryOut = (out: Omit<InventoryOut, 'id' | 'dateOut'>) => {
    const newOut: InventoryOut = {
      ...out,
      id: `out-${Date.now()}`,
      dateOut: new Date().toISOString(),
    };
    setInventoryOut([...inventoryOut, newOut]);

    // Update inventory for each part
    newOut.items.forEach(item => {
      const part = parts.find(p => p.partNumber === item.partNumber);
      if (part) {
        updatePart(part.id, { 
          currentStock: part.currentStock - item.quantity 
        });
      }
    });
  };

  const updateInventoryOut = (id: string, out: Partial<InventoryOut>) => {
    setInventoryOut(inventoryOut.map(o => o.id === id ? { ...o, ...out } : o));
  };

  const deleteInventoryOut = (id: string) => {
    setInventoryOut(inventoryOut.filter(o => o.id !== id));
  };

  const value = {
    vendors,
    parts,
    incomingArticles,
    inventoryOut,
    currentUser,
    isAuthenticated,
    isInitialized,
    addVendor,
    updateVendor,
    deleteVendor,
    addPart,
    updatePart,
    deletePart,
    addIncomingArticle,
    updateIncomingArticle,
    deleteIncomingArticle,
    addInventoryOut,
    updateInventoryOut,
    deleteInventoryOut,
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse text-neutral-600">Loading...</div>
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

