import { useRef, useState } from 'react';
import { projects as localProjects, type Project } from '../../data/projects';
import { useFirestoreCollection, useFirestoreWrite } from '../../hooks/useFirestore';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadMedia, firebaseReady } from '../../lib/firebase';

const COL = 'projects';

const empty: Omit<Project, 'id'> = {
  slug: '',
  title: '',
  client: '',
  tag: '',
  category: 'Branding',
  year: '',
  img: '',
  previewVideo: '',
  gallery: [],
  summary: '',
  challenge: '',
  solution: '',
  results: [],
  services: [],
  featured: false,
  color: '#2563eb',
  liveUrl: '',
  status: 'In Progress',
};

export default function AdminProjects() {
  const { data: remote, refresh } = useFirestoreCollection<Project>(COL);
  const { save, remove } = useFirestoreWrite(COL);

  const [editing, setEditing] = useState<(Project & { id: string }) | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<typeof empty & { id?: string }>({ ...empty });
  const [saving, setSaving] = useState(false);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const all = remote.length > 0 ? remote : [...localProjects.map((p) => ({ ...p }))];

  const startEdit = (p: (typeof all)[number]) => {
    setEditing(p);
    setCreating(false);
    setForm({ ...p });
  };

  const startCreate = () => {
    const id = crypto.randomUUID();
    setCreating(true);
    setEditing(null);
    setForm({ ...empty, slug: 'new-' + id.slice(0, 8), id });
  };

  const handleSave = async () => {
    if (!form.title || !form.slug) return;
    setSaving(true);
    await save(form.id || form.slug, form);
    await refresh();
    setSaving(false);
    setEditing(null);
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    await refresh();
  };

  const setField = (k: keyof typeof form, v: string | boolean | string[]) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const handleCoverUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadError('');
    setUploadingCover(true);
    setCoverProgress(0);
    try {
      const url = await uploadMedia(file, 'projects/covers', setCoverProgress);
      setField('img', url);
    } catch (err) {
      setUploadError(
        firebaseReady
          ? 'Upload failed. Check your Firebase Storage rules and try again.'
          : 'Firebase Storage isn\u2019t configured yet — set VITE_FIREBASE_* env vars to enable uploads.'
      );
      console.error(err);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleVideoUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadError('');
    setUploadingVideo(true);
    setVideoProgress(0);
    try {
      const url = await uploadMedia(file, 'projects/videos', setVideoProgress);
      setField('previewVideo', url);
    } catch (err) {
      setUploadError(
        firebaseReady
          ? 'Upload failed. Check your Firebase Storage rules and try again.'
          : 'Firebase Storage isn\u2019t configured yet — set VITE_FIREBASE_* env vars to enable uploads.'
      );
      console.error(err);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleGalleryUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadError('');
    setUploadingGallery(true);
    try {
      const url = await uploadMedia(file, 'projects/gallery');
      setField('gallery', [...form.gallery, url]);
    } catch (err) {
      setUploadError(
        firebaseReady
          ? 'Upload failed. Check your Firebase Storage rules and try again.'
          : 'Firebase Storage isn\u2019t configured yet — set VITE_FIREBASE_* env vars to enable uploads.'
      );
      console.error(err);
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (url: string) => {
    setField('gallery', form.gallery.filter((g) => g !== url));
  };

  const open = !!creating || !!editing;

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="serif text-4xl">Projects</h2>
          <p className="mt-1 text-sm text-[#f5f8ff]/50">{all.length} total</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-full bg-[#2563eb] px-6 py-2.5 text-sm font-medium"
        >
          + New project
        </button>
      </div>

      {!firebaseReady && (
        <div className="mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
          <span className="font-semibold">Firebase setup required.</span>{' '}
          Edits remain local and media uploads are unavailable until your{' '}
          <code className="rounded bg-black/20 px-1.5 py-0.5">VITE_FIREBASE_*</code>{' '}
          environment variables and Storage bucket are configured.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {all.map((p) => (
          <div
            key={p.id || p.slug}
            className="group rounded-2xl border border-[#f5f8ff]/10 bg-[#0d1f40] overflow-hidden"
          >
            <div className="aspect-[16/10] bg-[#2a2420]">
              {p.img && (
                <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="serif text-2xl">{p.title || 'Untitled'}</h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-wider ${
                    p.status === 'Completed'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  {p.status === 'Completed' ? 'Live' : 'WIP'}
                </span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wider text-[#f5f8ff]/40">
                {p.tag || p.category}
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  className="rounded-full border border-[#f5f8ff]/15 px-3 py-1.5 text-xs uppercase tracking-wider hover:border-[#2563eb]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id || p.slug)}
                  className="rounded-full border border-[#f5f8ff]/15 px-3 py-1.5 text-xs uppercase tracking-wider text-red-400 hover:border-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0a1633]/90 py-10 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="w-full max-w-2xl rounded-3xl border border-[#f5f8ff]/10 bg-[#0d1f40] p-6 md:p-10"
            >
              <h3 className="serif text-3xl">
                {creating ? 'New project' : 'Edit project'}
              </h3>

              <div className="mt-8 space-y-5">
                <Field label="Title">
                  <input
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Slug">
                    <input
                      value={form.slug}
                      onChange={(e) => setField('slug', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Client">
                    <input
                      value={form.client}
                      onChange={(e) => setField('client', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Tag">
                    <input
                      value={form.tag}
                      onChange={(e) => setField('tag', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Year">
                    <input
                      value={form.year}
                      onChange={(e) => setField('year', e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
                {/* ── Fallback / preview media ── */}
                <div className="rounded-2xl border border-[#f5f8ff]/10 bg-[#0a1633]/40 p-4">
                  <p className="mb-3 text-xs uppercase tracking-wider text-[#f5f8ff]/50">
                    Live preview fallback media
                  </p>
                  <p className="mb-4 text-xs text-[#f5f8ff]/35">
                    Shown on the project page before someone loads the real live preview — and
                    used automatically if the live site can't be embedded.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Cover image */}
                    <Field label="Cover image (fallback poster)">
                      <div className="flex items-center gap-2">
                        <input
                          value={form.img}
                          onChange={(e) => setField('img', e.target.value)}
                          placeholder="https:// or upload →"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          disabled={uploadingCover}
                          className="flex-shrink-0 rounded-xl border border-[#f5f8ff]/15 px-3 py-2.5 text-xs uppercase tracking-wider hover:border-[#2563eb] disabled:opacity-50"
                        >
                          {uploadingCover ? `${Math.round(coverProgress)}%` : 'Upload'}
                        </button>
                        <input
                          ref={coverInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                        />
                      </div>
                      {form.img && (
                        <div className="mt-2 h-20 w-full overflow-hidden rounded-lg bg-black/20">
                          <img src={form.img} alt="cover preview" className="h-full w-full object-cover" />
                        </div>
                      )}
                    </Field>

                    {/* Preview video */}
                    <Field label="Fallback video (optional)">
                      <div className="flex items-center gap-2">
                        <input
                          value={form.previewVideo || ''}
                          onChange={(e) => setField('previewVideo', e.target.value)}
                          placeholder="https:// or upload →"
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          disabled={uploadingVideo}
                          className="flex-shrink-0 rounded-xl border border-[#f5f8ff]/15 px-3 py-2.5 text-xs uppercase tracking-wider hover:border-[#2563eb] disabled:opacity-50"
                        >
                          {uploadingVideo ? `${Math.round(videoProgress)}%` : 'Upload'}
                        </button>
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/mp4,video/webm"
                          className="hidden"
                          onChange={(e) => handleVideoUpload(e.target.files?.[0])}
                        />
                      </div>
                      {form.previewVideo && (
                        <div className="mt-2 h-20 w-full overflow-hidden rounded-lg bg-black/20">
                          <video src={form.previewVideo} className="h-full w-full object-cover" muted loop autoPlay playsInline />
                        </div>
                      )}
                    </Field>
                  </div>

                  {/* Gallery uploads */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-[#f5f8ff]/45">Gallery images</span>
                      <button
                        type="button"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={uploadingGallery}
                        className="rounded-full border border-[#f5f8ff]/15 px-3 py-1 text-[11px] uppercase tracking-wider hover:border-[#2563eb] disabled:opacity-50"
                      >
                        {uploadingGallery ? 'Uploading…' : '+ Add image'}
                      </button>
                      <input
                        ref={galleryInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleGalleryUpload(e.target.files?.[0])}
                      />
                    </div>
                    {form.gallery.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {form.gallery.map((g) => (
                          <div key={g} className="group relative h-16 w-16 overflow-hidden rounded-lg bg-black/20">
                            <img src={g} alt="" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(g)}
                              className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white opacity-0 transition group-hover:opacity-100"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <p className="mt-3 text-xs text-red-400">{uploadError}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Live URL">
                    <input
                      value={form.liveUrl || ''}
                      onChange={(e) => setField('liveUrl', e.target.value)}
                      placeholder="https://…"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(e) => setField('status', e.target.value)}
                      className={inputClass}
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </Field>
                </div>
                <Field label="Summary">
                  <textarea
                    value={form.summary}
                    onChange={(e) => setField('summary', e.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                </Field>
                <Field label="Challenge">
                  <textarea
                    value={form.challenge}
                    onChange={(e) => setField('challenge', e.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                </Field>
                <Field label="Solution">
                  <textarea
                    value={form.solution}
                    onChange={(e) => setField('solution', e.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                </Field>
                <Field label="Results (comma separated)">
                  <input
                    value={form.results.join(', ')}
                    onChange={(e) =>
                      setField(
                        'results',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Services (comma separated)">
                  <input
                    value={form.services.join(', ')}
                    onChange={(e) =>
                      setField(
                        'services',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    className={inputClass}
                  />
                </Field>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setField('featured', e.target.checked)}
                  />
                  <span className="text-sm text-[#f5f8ff]/60">Featured project</span>
                </label>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-[#2563eb] px-6 py-3 text-sm font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setCreating(false);
                  }}
                  className="rounded-full border border-[#f5f8ff]/20 px-6 py-3 text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-[#f5f8ff]/15 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[#2563eb]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-[#f5f8ff]/45">
        {label}
      </span>
      {children}
    </label>
  );
}
