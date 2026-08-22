import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  type Firestore,
  type DocumentData,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  type FirebaseStorage,
} from "firebase/storage";
import { getAnalytics, isSupported as isAnalyticsSupported, type Analytics } from "firebase/analytics";

export const ADMIN_EMAILS: string[] = (() => {
  const envList = import.meta.env?.VITE_ADMIN_EMAILS;
  if (envList && typeof envList === 'string') {
    return envList
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
  }
  const single = import.meta.env?.VITE_ADMIN_EMAIL;
  if (single && typeof single === 'string') {
    return [single.trim().toLowerCase(), "davidbyanmwijage@gmail.com"];
  }
  return ["mwijaydavie@gmail.com", "davidbyanmwijage@gmail.com"];
})();

export const ADMIN_EMAIL = ADMIN_EMAILS[0];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.includes(clean);
}

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

export const firebaseReady = true;

app = initializeApp(firebaseConfig);
auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Safe Analytics initialization for browser environments
if (typeof window !== "undefined") {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics optional in restricted or local contexts
    });
}

export {
  app,
  auth,
  db,
  storage,
  analytics,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
};
export type { User };

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
};

export const logOut = () => signOut(auth);

// Generic Firestore helpers
export async function getDocsFrom<T>(colName: string): Promise<({ id: string } & T)[]> {
  try {
    const snap = await getDocs(collection(db, colName));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as { id: string } & T));
  } catch (err) {
    console.warn(`Firestore read failed for collection "${colName}":`, err);
    return [];
  }
}

export async function getDocData<T>(colName: string, docId: string): Promise<T | null> {
  try {
    const snap = await getDoc(doc(db, colName, docId));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as { id: string } & T) : null;
  } catch (err) {
    console.warn(`Firestore read failed for document "${colName}/${docId}":`, err);
    return null;
  }
}

export async function saveDoc(colName: string, docId: string, data: DocumentData) {
  try {
    await setDoc(doc(db, colName, docId), data, { merge: true });
  } catch (err) {
    console.warn(`Firestore write failed for document "${colName}/${docId}":`, err);
  }
}

export async function removeDoc(colName: string, docId: string) {
  try {
    await deleteDoc(doc(db, colName, docId));
  } catch (err) {
    console.warn(`Firestore delete failed for document "${colName}/${docId}":`, err);
  }
}

/**
 * Uploads a file (image or video) to Firebase Storage and returns its public download URL.
 * Reports progress via the optional onProgress callback (0-100).
 */
export function uploadMedia(
  file: File,
  folder = "projects",
  onProgress?: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${folder}/${Date.now()}-${safeName}`;
    const fileRef = storageRef(storage, path);
    const task = uploadBytesResumable(fileRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(pct);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Lightweight Telegram Notification helper for admin alerts.
 */
export async function notifyTelegramAdmin(title: string, details: string) {
  const token = import.meta.env?.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env?.VITE_TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const text = `🔔 *${title}*\n\n${details}`;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.warn("Telegram notification failed:", err);
  }
}
