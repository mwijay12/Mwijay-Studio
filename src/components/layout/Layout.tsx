import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Nav from './Nav';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import HomeReloadGuard from './HomeReloadGuard';
import Loader from '../ui/Loader';
import AIFloatingIcon from '../ui/AIFloatingIcon';
import ChatBot from '../ui/ChatBot';
import SmoothScroll from '../ui/SmoothScroll';
import PageTransition from '../ui/PageTransition';
import ScrollProgress from '../ui/ScrollProgress';
import CinematicScrollEffects from '../ui/CinematicScrollEffects';
import ToastViewport from '../ui/ToastViewport';
import AnnouncementBanner from '../ui/AnnouncementBanner';
import { currentAnnouncement } from '../../data/announcement';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem('mwijay-loaded') === '1';
  });
  // Height of the announcement banner (0 when hidden/dismissed). The nav bar
  // and page content shift down by this amount so nothing overlaps it.
  const [bannerHeight, setBannerHeight] = useState(0);

  const handleDone = () => {
    sessionStorage.setItem('mwijay-loaded', '1');
    setLoaded(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f8ff] text-[#0a1633]">
      <SmoothScroll />
      <ScrollProgress />
      <CinematicScrollEffects />
      {!loaded && <Loader onDone={handleDone} />}
      <ScrollToTop />
      <HomeReloadGuard />
      <ToastViewport />
      <AnnouncementBanner announcement={currentAnnouncement} onHeightChange={setBannerHeight} />
      <Nav topOffset={bannerHeight} />
      {/* Reserves space equal to the banner so fixed nav + content aren't hidden behind it. */}
      <div style={{ height: bannerHeight }} className="transition-[height] duration-300" />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <ChatBot onStartProject={() => navigate('/start')} />
      <Footer />
    </div>
  );
}
