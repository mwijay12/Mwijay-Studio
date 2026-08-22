import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LOADER_KEY = 'mwijay-loaded';
const HOME_RELOAD_KEY = 'ms-home-hard-refresh';

/**
 * Forces the homepage to boot as a fresh document when returning from any
 * other route.
 *
 * Why this exists:
 * the homepage has a pinned GSAP horizontal-scroll section. After SPA route
 * transitions, browser history back to `/` can leave that pinned section in a
 * bad measured state under the transition curtain. A true document refresh is
 * the most reliable and user-approved fix here.
 *
 * It only triggers when the previous SPA route was not `/` and the new route is
 * `/`. Before reloading it clears the loader session flag, so the 0-100 loader
 * plays again exactly like a fresh visit. The reload flag prevents loops.
 */
export default function HomeReloadGuard() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const current = location.pathname;
    const previous = previousPath.current;
    const pendingReload = sessionStorage.getItem(HOME_RELOAD_KEY) === '1';

    // We are on the freshly reloaded homepage. Clear the loop guard.
    if (current === '/' && pendingReload && previous === current) {
      sessionStorage.removeItem(HOME_RELOAD_KEY);
    }

    if (current === '/' && previous !== '/' && !pendingReload) {
      sessionStorage.removeItem(LOADER_KEY);
      sessionStorage.setItem(HOME_RELOAD_KEY, '1');

      // Stop Lenis before reload so no scroll inertia carries into the browser
      // navigation task while the document is being torn down.
      window.__mwijayLenis?.stop();
      window.location.reload();
      return;
    }

    previousPath.current = current;
  }, [location.pathname]);

  return null;
}