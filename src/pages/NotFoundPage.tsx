import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="text-sm uppercase tracking-widest text-[#c4552e]">404</span>
      <h1 className="serif mt-4 text-6xl md:text-8xl">Page not found</h1>
      <p className="mt-4 max-w-md text-[#14110f]/60">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="rounded-full bg-[#0a1633] px-6 py-3 text-sm font-medium text-[#f5f8ff]"
        >
          Back home
        </Link>
        <Link
          to="/work"
          className="rounded-full border border-[#14110f]/20 px-6 py-3 text-sm"
        >
          Browse work
        </Link>
      </div>
    </section>
  );
}
