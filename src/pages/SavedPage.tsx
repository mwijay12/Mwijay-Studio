import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PageHero from '../components/ui/PageHero';
import Reveal from '../components/ui/Reveal';

export default function SavedPage() {
  const { saved, toggleSave, clearSaved } = useApp();
  const projects = saved.filter((s) => s.type === 'project');
  const posts = saved.filter((s) => s.type === 'post');

  return (
    <>
      <PageHero
        dark
        eyebrow="Collection"
        title={
          <>
            Your <span className="italic text-[#c4552e]">saved</span> items
          </>
        }
        subtitle={
          saved.length
            ? `${saved.length} item${saved.length === 1 ? '' : 's'} stored in this browser.`
            : 'Bookmark projects and articles as you explore — they’ll show up here.'
        }
      />

      <section className="bg-[#0a1633] pb-24 text-[#f5f8ff]">
        <div className="mx-auto max-w-7xl px-6">
          {saved.length > 0 && (
            <div className="mb-10 flex justify-end">
              <button
                type="button"
                onClick={clearSaved}
                className="text-sm uppercase tracking-widest text-[#f4f0e8]/50 transition hover:text-[#c4552e]"
              >
                Clear all
              </button>
            </div>
          )}

          {saved.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#f4f0e8]/15 py-24 text-center">
              <p className="serif text-3xl">Nothing saved yet</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  to="/work"
                  className="rounded-full bg-[#c4552e] px-6 py-3 text-sm font-medium"
                >
                  Browse work
                </Link>
                <Link
                  to="/journal"
                  className="rounded-full border border-[#f4f0e8]/20 px-6 py-3 text-sm"
                >
                  Read journal
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {projects.length > 0 && (
                <div>
                  <h2 className="text-sm uppercase tracking-widest text-[#f4f0e8]/40">
                    Projects · {projects.length}
                  </h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((item, i) => (
                      <Reveal key={item.id} delay={i * 60} className="group relative">
                        <Link to={`/work/${item.slug}`} className="block overflow-hidden rounded-2xl">
                          <div className="aspect-[4/3] overflow-hidden bg-[#2a2420]">
                            <img
                              src={item.img}
                              alt={item.title}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />
                          </div>
                          <h3 className="serif mt-4 text-2xl transition group-hover:text-[#c4552e]">
                            {item.title}
                          </h3>
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleSave(item)}
                          className="absolute right-3 top-3 rounded-full bg-[#c4552e] px-3 py-1.5 text-xs uppercase tracking-wider"
                        >
                          Remove
                        </button>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}

              {posts.length > 0 && (
                <div>
                  <h2 className="text-sm uppercase tracking-widest text-[#f4f0e8]/40">
                    Articles · {posts.length}
                  </h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((item, i) => (
                      <Reveal key={item.id} delay={i * 60} className="group relative">
                        <Link
                          to={`/journal/${item.slug}`}
                          className="block overflow-hidden rounded-2xl"
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-[#2a2420]">
                            <img
                              src={item.img}
                              alt={item.title}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />
                          </div>
                          <h3 className="serif mt-4 text-2xl transition group-hover:text-[#c4552e]">
                            {item.title}
                          </h3>
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleSave(item)}
                          className="absolute right-3 top-3 rounded-full bg-[#c4552e] px-3 py-1.5 text-xs uppercase tracking-wider"
                        >
                          Remove
                        </button>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
