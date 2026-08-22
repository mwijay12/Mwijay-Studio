import { useCallback, useEffect, useState } from "react";
import {
  getDocsFrom,
  getDocData,
  saveDoc,
  removeDoc,
} from "../lib/firebase";
import type { DocumentData } from "firebase/firestore";

export function useFirestoreCollection<T>(colName: string) {
  const [data, setData] = useState<({ id: string } & T)[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const docs = await getDocsFrom<T>(colName);
      setData(docs);
    } catch {
      // Firestore not configured — silently fall back
    }
    setLoading(false);
  }, [colName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useFirestoreDoc<T>(colName: string, docId: string | null) {
  const [data, setData] = useState<({ id: string } & T) | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const doc = await getDocData<T>(colName, docId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setData(doc as any);
    } catch {
      setData(null);
    }
    setLoading(false);
  }, [colName, docId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

export function useFirestoreWrite(colName: string) {
  const save = useCallback(
    async (docId: string, data: DocumentData) => {
      await saveDoc(colName, docId, data);
    },
    [colName]
  );

  const remove = useCallback(
    async (docId: string) => {
      await removeDoc(colName, docId);
    },
    [colName]
  );

  return { save, remove };
}
