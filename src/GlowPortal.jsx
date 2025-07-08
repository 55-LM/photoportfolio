import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function GlowPortal({ src, left, top, width, height, show, opacity = 1, zIndex = 9999 }) {
  if (!src || !width || !height || width <= 0 || height <= 0) {
    console.warn('GlowPortal not rendering due to invalid props:', { src, width, height });
    return null;
  }

  // Create a div for the portal if it doesn't exist
  useEffect(() => {
    let el = document.getElementById('glow-portal-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'glow-portal-root';
      document.body.appendChild(el);
    }
    return () => {
      // Optionally clean up
      // document.body.removeChild(el);
    };
  }, []);

  const portalRoot = document.getElementById('glow-portal-root');
  if (!portalRoot) return null;

  return createPortal(
    <img
      className="gallery-glow"
      src={src}
      alt=""
      aria-hidden="true"
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        pointerEvents: show ? 'auto' : 'none',
        opacity: show ? Math.min(opacity * 1.5, 1) : 0, // Increase opacity
        filter: 'blur(60px) brightness(1.5)', // Brighter and less diffused
        borderRadius: '50%',
        transition: 'opacity 0.4s ease-in-out, left 0.2s ease, top 0.2s ease, width 0.2s ease, height 0.2s ease',
      }}
    />,
    portalRoot
  );
} 