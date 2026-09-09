import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal, robust ScrollToTop component:
 * 1. Automatically scrolls to the top (0, 0) on every route navigation across desktop and mobile.
 * 2. If a user clicks a link (in Navbar, Footer, or elsewhere) pointing to the CURRENT page they are already on,
 *    it smoothly scrolls the page back to the top.
 * 3. Handles mobile Safari / Android scrollRestoration and edge cases.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  // 1. Force scroll to top on route / search changes
  useEffect(() => {
    // Disable browser default scroll restoration if available so browser doesn't fight our scroll
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    // Immediate reset
    resetScroll();

    // Re-check on next animation frame after React completes DOM render
    const frameId = requestAnimationFrame(resetScroll);

    return () => cancelAnimationFrame(frameId);
  }, [pathname, search]);

  // 2. Global listener for same-page link clicks (e.g. Clicking "Home" while already on Home)
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find the closest enclosing anchor element
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Skip external links, tel:, mailto:, javascript:
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
      if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;

      try {
        const targetUrl = new URL(href, window.location.origin);

        // Normalize paths (strip trailing slashes for comparison)
        const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
        const destinationPath = targetUrl.pathname.replace(/\/+$/, '') || '/';

        // Check if clicking a link pointing to the same page
        if (currentPath === destinationPath && (!targetUrl.search || targetUrl.search === window.location.search)) {
          // If it's a hash anchor like #section, let browser or smooth scroll handle it
          if (targetUrl.hash) {
            const targetElement = document.querySelector(targetUrl.hash);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
              return;
            }
          }

          // Same page link clicked without hash -> smoothly scroll to top
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          if (document.documentElement) {
            document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
          }
          if (document.body) {
            document.body.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      } catch {
        // In case of invalid URL string, safely ignore
      }
    };

    document.addEventListener('click', handleLinkClick, { passive: true });
    return () => document.removeEventListener('click', handleLinkClick);
  }, [pathname]);

  return null;
}
