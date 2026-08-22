import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const { user, isAdmin, loading, signIn, signOut, adminEmails } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071127]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2563eb] border-t-transparent" />
      </div>
    );
  }

  // If user is already authenticated as an authorized administrator, redirect to /admin
  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSigningIn(true);
    try {
      const loggedUser = await signIn();
      if (!loggedUser) {
        setSigningIn(false);
        return;
      }
      const email = loggedUser.email?.toLowerCase().trim();
      const isAllowed = email && adminEmails.map((e) => e.toLowerCase().trim()).includes(email);
      if (!isAllowed) {
        setErrorMsg(
          `Access restricted: Signed in as ${loggedUser.email}. Only authorized administrators (${adminEmails.join(' / ')}) have access to the Admin Workspace.`
        );
        await signOut();
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#071127] px-6 text-[#f5f8ff]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0a1633] p-8 text-center shadow-2xl sm:p-10"
      >
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1e40af] text-lg font-bold shadow-lg shadow-[#2563eb]/25">
          MD
        </div>

        <h1 className="serif text-3xl sm:text-4xl text-white">
          Mwijay<span className="text-[#60a5fa]">Studio</span>
        </h1>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Administrator Workspace
        </p>

        <div className="my-6 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-left text-xs text-white/60">
          <div className="flex items-center gap-2 font-medium text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Authorized Administrators</span>
          </div>
          <div className="mt-1 space-y-0.5">
            {adminEmails.map((em) => (
              <p key={em} className="font-mono text-[11px] text-[#60a5fa]">{em}</p>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-white/40 leading-relaxed">
            Public clients and visitors access the site directly without login. This portal is restricted to Mwijay Studio operations.
          </p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300 text-left leading-relaxed"
          >
            {errorMsg}
          </motion.div>
        )}

        <button
          type="button"
          disabled={signingIn}
          onClick={handleGoogleSignIn}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-[#0a1633] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#f5f8ff] disabled:opacity-50"
        >
          {signingIn ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0a1633] border-t-transparent" />
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </>
          )}
        </button>

        <div className="mt-8 border-t border-white/8 pt-6">
          <Link
            to="/"
            className="text-xs uppercase tracking-widest text-white/40 transition hover:text-white"
          >
            ← Return to public website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
