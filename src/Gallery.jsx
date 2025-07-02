import { useState } from 'react';
import clsx from 'clsx';
import Masonry from 'react-masonry-css';
import GlowPortal from './GlowPortal';

const images = import.meta.glob('./images/*.{jpg,jpeg,png}', { eager: true });

export default function Gallery() {
  const imageEntries = Object.entries(images);

  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tappedIndex, setTappedIndex] = useState(null);
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
  const bleed = isMobile ? 4 : 16;
  const [glowPortal, setGlowPortal] = useState({ show: false, src: null, left: 0, top: 0, width: 0, height: 0, opacity: 0.15 });

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setLightboxSrc(null), 200);
  };

  return (
    <>
      <div className="overflow-visible pb-20 sm:pb-12 w-full max-w-full" style={{ overflow: 'visible' }}>
        <Masonry
          breakpointCols={{
            default: 4,
            1280: 4,
            1024: 3,
            640: 2,
            0: 1,
          }}
          className="my-masonry-grid p-0 sm:p-6"
          columnClassName="my-masonry-grid_column"
        >
          {imageEntries.map(([path, mod], i) => {
            const [glowDataUrl, setGlowDataUrl] = useState(null);

            const handleLoad = (e) => {
              const img = e.target;
              const w = img.naturalWidth;
              const h = img.naturalHeight;

              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = w;
              canvas.height = h;
              ctx.drawImage(img, 0, 0);

              const glowCanvas = document.createElement('canvas');
              const glowCtx = glowCanvas.getContext('2d');
              glowCanvas.width = w + bleed * 2;
              glowCanvas.height = h + bleed * 2;

              glowCtx.drawImage(canvas, bleed, bleed);

              const topRow = ctx.getImageData(0, 0, w, 1);
              for (let y = 0; y < bleed; y++) {
                glowCtx.putImageData(topRow, bleed, y);
              }

              const bottomRow = ctx.getImageData(0, h - 1, w, 1);
              for (let y = 0; y < bleed; y++) {
                glowCtx.putImageData(bottomRow, bleed, h + bleed + y);
              }

              const leftCol = ctx.getImageData(0, 0, 1, h);
              for (let x = 0; x < bleed; x++) {
                glowCtx.putImageData(leftCol, x, bleed);
              }

              const rightCol = ctx.getImageData(w - 1, 0, 1, h);
              for (let x = 0; x < bleed; x++) {
                glowCtx.putImageData(rightCol, w + bleed + x, bleed);
              }

              const topLeft = ctx.getImageData(0, 0, 1, 1);
              const topRight = ctx.getImageData(w - 1, 0, 1, 1);
              const bottomLeft = ctx.getImageData(0, h - 1, 1, 1);
              const bottomRight = ctx.getImageData(w - 1, h - 1, 1, 1);

              for (let y = 0; y < bleed; y++) {
                for (let x = 0; x < bleed; x++) {
                  glowCtx.putImageData(topLeft, x, y);
                  glowCtx.putImageData(topRight, w + bleed + x, y);
                  glowCtx.putImageData(bottomLeft, x, h + bleed + y);
                  glowCtx.putImageData(bottomRight, w + bleed + x, h + bleed + y);
                }
              }

              setGlowDataUrl(glowCanvas.toDataURL());
            };

            const handleClick = (e) => {
              if (isTouchDevice) {
                e.preventDefault();
                if (tappedIndex === i) {
                  setLightboxSrc(e.target.src);
                  setTappedIndex(null);
                  setTimeout(() => setIsAnimating(true), 20);
                } else {
                  setTappedIndex(i);
                  return;
                }
              } else {
                setLightboxSrc(e.target.src);
                setTimeout(() => setIsAnimating(true), 20);
              }
            };

            const showGlow = isTouchDevice ? tappedIndex === i : false;
            const handleShowGlow = (e) => {
              if (!glowDataUrl) return;
              const rect = e.target.getBoundingClientRect();
              const scrollX = window.scrollX || window.pageXOffset;
              const scrollY = window.scrollY || window.pageYOffset;
              const width = rect.width + bleed * 2;
              const height = rect.height + bleed * 2;
              if (!glowDataUrl || width <= 0 || height <= 0) {
                console.warn('Invalid glow portal values:', { glowDataUrl, width, height });
                return;
              }
              setGlowPortal({
                show: true,
                src: glowDataUrl,
                left: rect.left + scrollX - bleed,
                top: rect.top + scrollY - bleed,
                width,
                height,
                opacity: 0.5,
              });
            };
            const handleHideGlow = () => setGlowPortal((g) => ({ ...g, show: false }));

            return (
              <div
                key={i}
                className="inline-block w-full mb-8 break-inside-avoid group cursor-pointer overflow-visible"
                onMouseEnter={!isTouchDevice ? handleShowGlow : undefined}
                onMouseLeave={!isTouchDevice ? handleHideGlow : undefined}
                onTouchStart={isTouchDevice ? (e) => { handleShowGlow(e); handleClick(e); } : undefined}
                onTouchEnd={isTouchDevice ? handleHideGlow : undefined}
              >
                <div className="relative w-full overflow-visible">
                  <div className="relative inline-block">
                    <img
                      src={mod.default}
                      alt={`Photo ${i}`}
                      onLoad={handleLoad}
                      onClick={!isTouchDevice ? handleClick : undefined}
                      className="block h-auto object-cover relative z-10"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </Masonry>
      </div>

      {lightboxSrc && (
        <div className="lightbox-open fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 pt-16">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-4xl font-light bg-gradient-to-b from-[#AFAFAF] to-[#606060] bg-clip-text text-transparent z-20"
          >
            ×
          </button>

          <div
            className={clsx(
              'relative z-10 transform transition-all duration-300 ease-out',
              isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            )}
          >
            <img
              src={lightboxSrc}
              alt="Enlarged"
              className="max-w-[90vw] max-h-[90vh] object-contain relative z-10"
            />
          </div>
        </div>
      )}

      <GlowPortal {...glowPortal} zIndex={2} />
    </>
  );
}