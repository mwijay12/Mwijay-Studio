import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  auth,
  signInWithGoogle,
  logOut,
  onAuthStateChanged,
  ADMIN_EMAIL,
  ADMIN_EMAILS,
  isAdminEmail,
  type User,
} from "../lib/firebase";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminEmail: string;
  adminEmails: string[];
  signIn: () => Promise<User | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const isAdmin = useMemo(() => {
    if (!user || !user.email) return false;
    return isAdminEmail(user.email);
  }, [user]);

  const signIn = useCallback(async () => {
    try {
      const result = await signInWithGoogle();
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.warn("Sign-in failed or was cancelled:", error);
      return null;
    }
  }, []);

  const signOutFn = useCallback(async () => {
    await logOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      adminEmail: ADMIN_EMAIL,
      adminEmails: ADMIN_EMAILS,
      signIn,
      signOut: signOutFn,
    }),
    [user, loading, isAdmin, signIn, signOutFn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
