import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getDocsFrom,
  saveDoc,
  removeDoc,
  notifyTelegramAdmin,
} from '../lib/firebase';

export type SavedItem = {
  id: string;
  type: 'project' | 'post';
  title: string;
  slug: string;
  img: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  budget: string;
  services: string[];
  message: string;
  createdAt: string;
  status: 'New' | 'Replied' | 'Closed';
};

export type PageVisit = {
  path: string;
  title: string;
  ts: string;
  referrer: string;
};

export type Invoice = {
  id: string;
  number: string;
  clientName: string;
  clientEmail: string;
  items: { desc: string; qty: number; rate: number }[];
  currency: string;
  status: 'Draft' | 'Sent' | 'Paid';
  createdAt: string;
  dueDate: string;
  notes: string;
};

type AppContextValue = {
  saved: SavedItem[];
  toggleSave: (item: SavedItem) => void;
  isSaved: (id: string) => boolean;
  clearSaved: () => void;
  inquiries: Inquiry[];
  addInquiry: (data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => Promise<void>;
  newsletterEmail: string | null;
  subscribeNewsletter: (email: string) => Promise<void>;
  visits: PageVisit[];
  invoices: Invoice[];
  addInvoice: (data: Omit<Invoice, 'id' | 'createdAt'>) => Promise<void>;
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  refreshRemoteData: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

const SAVED_KEY = 'ms-saved';
const INQUIRY_KEY = 'ms-inquiries';
const NEWS_KEY = 'ms-newsletter';
const VISITS_KEY = 'ms-visits';
const INVOICES_KEY = 'ms-invoices';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<SavedItem[]>(() => readJSON(SAVED_KEY, []));
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => readJSON(INQUIRY_KEY, []));
  const [newsletterEmail, setNewsletterEmail] = useState<string | null>(() =>
    localStorage.getItem(NEWS_KEY)
  );
  const [visits, setVisits] = useState<PageVisit[]>(() => readJSON(VISITS_KEY, []));
  const [invoices, setInvoices] = useState<Invoice[]>(() => readJSON(INVOICES_KEY, []));

  // Sync state to localStorage cache
  useEffect(() => { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); }, [saved]);
  useEffect(() => { localStorage.setItem(INQUIRY_KEY, JSON.stringify(inquiries)); }, [inquiries]);
  useEffect(() => { localStorage.setItem(VISITS_KEY, JSON.stringify(visits)); }, [visits]);
  useEffect(() => { localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices)); }, [invoices]);

  // Remote data fetcher to synchronize with Firebase Firestore
  const refreshRemoteData = useCallback(async () => {
    try {
      // 1. Inquiries
      const remoteInquiries = await getDocsFrom<Inquiry>('inquiries');
      if (remoteInquiries.length > 0) {
        setInquiries((prev) => {
          const map = new Map<string, Inquiry>();
          remoteInquiries.forEach((item) => map.set(item.id, item));
          prev.forEach((item) => {
            if (!map.has(item.id)) map.set(item.id, item);
          });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          return merged;
        });
      }

      // 2. Invoices
      const remoteInvoices = await getDocsFrom<Invoice>('invoices');
      if (remoteInvoices.length > 0) {
        setInvoices((prev) => {
          const map = new Map<string, Invoice>();
          remoteInvoices.forEach((item) => map.set(item.id, item));
          prev.forEach((item) => {
            if (!map.has(item.id)) map.set(item.id, item);
          });
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          return merged;
        });
      }
    } catch (err) {
      console.warn('Firestore initial sync note:', err);
    }
  }, []);

  useEffect(() => {
    refreshRemoteData();
  }, [refreshRemoteData]);

  // Visitor tracking — log page views
  useEffect(() => {
    const logVisit = () => {
      const visit: PageVisit = {
        path: window.location.pathname + window.location.hash,
        title: document.title,
        ts: new Date().toISOString(),
        referrer: document.referrer || 'Direct',
      };
      setVisits((prev) => [visit, ...prev].slice(0, 500));
    };
    logVisit();
    window.addEventListener('popstate', logVisit);
    return () => window.removeEventListener('popstate', logVisit);
  }, []);

  const toggleSave = useCallback((item: SavedItem) => {
    setSaved((prev) => {
      const exists = prev.some((s) => s.id === item.id);
      return exists ? prev.filter((s) => s.id !== item.id) : [...prev, item];
    });
  }, []);

  const isSaved = useCallback((id: string) => saved.some((s) => s.id === id), [saved]);
  const clearSaved = useCallback(() => setSaved([]), []);

  const addInquiry = useCallback(async (data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const inquiry: Inquiry = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'New',
    };

    // Save locally
    setInquiries((prev) => [inquiry, ...prev]);

    // Save to Firestore
    try {
      await saveDoc('inquiries', inquiry.id, inquiry);
    } catch (err) {
      console.warn('Inquiry Firestore sync error:', err);
    }

    // Telegram Bot Notification for David
    notifyTelegramAdmin(
      'New Inquiry Received — Mwijay Studio',
      `👤 *Name:* ${inquiry.name}\n📧 *Email:* ${inquiry.email}\n🏢 *Company:* ${inquiry.company || 'N/A'}\n💰 *Budget:* ${inquiry.budget}\n🛠 *Services:* ${inquiry.services.join(', ') || 'N/A'}\n\n📝 *Message:*\n${inquiry.message}`
    );
  }, []);

  const updateInquiryStatus = useCallback(async (id: string, status: Inquiry['status']) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    try {
      await saveDoc('inquiries', id, { status });
    } catch (err) {
      console.warn('Inquiry status Firestore update error:', err);
    }
  }, []);

  const subscribeNewsletter = useCallback(async (email: string) => {
    localStorage.setItem(NEWS_KEY, email);
    setNewsletterEmail(email);
    try {
      await saveDoc('newsletters', email.replace(/[^a-zA-Z0-9]/g, '_'), {
        email,
        subscribedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Newsletter Firestore sync error:', err);
    }
  }, []);

  const addInvoice = useCallback(async (data: Omit<Invoice, 'id' | 'createdAt'>) => {
    const inv: Invoice = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setInvoices((prev) => [inv, ...prev]);
    try {
      await saveDoc('invoices', inv.id, inv);
    } catch (err) {
      console.warn('Invoice Firestore sync error:', err);
    }
  }, []);

  const updateInvoice = useCallback(async (id: string, data: Partial<Invoice>) => {
    setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
    try {
      await saveDoc('invoices', id, data);
    } catch (err) {
      console.warn('Invoice Firestore update error:', err);
    }
  }, []);

  const deleteInvoice = useCallback(async (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    try {
      await removeDoc('invoices', id);
    } catch (err) {
      console.warn('Invoice Firestore delete error:', err);
    }
  }, []);

  const value = useMemo(
    () => ({
      saved,
      toggleSave,
      isSaved,
      clearSaved,
      inquiries,
      addInquiry,
      updateInquiryStatus,
      newsletterEmail,
      subscribeNewsletter,
      visits,
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      refreshRemoteData,
    }),
    [
      saved,
      toggleSave,
      isSaved,
      clearSaved,
      inquiries,
      addInquiry,
      updateInquiryStatus,
      newsletterEmail,
      subscribeNewsletter,
      visits,
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      refreshRemoteData,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
