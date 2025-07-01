import { useState } from 'react';
import clsx from 'clsx';

const images = import.meta.glob('./images/*.{jpg,jpeg,png}', { eager: true });

export default function Gallery() {
  const imageEntries = Object.entries(images);

  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [tappedIndex, setTappedIndex] = useState(null);
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setLightboxSrc(null), 200);
  };

  return (
    <>
      <div className="overflow-visible pb-20 sm:pb-12">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-x-8 p-6 [column-gap:2rem]">
          {imageEntries.map(([path, mod], i) => {
            const [glowDataUrl, setGlowDataUrl] = useState(null);

            const handleLoad = (e) => {
              const img = e.target;
              const w = img.naturalWidth;
              const h = img.naturalHeight;
              const bleed = window.innerWidth < 640 ? 15 : 30; // smaller bleed on mobile

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

              // Edge replication
              const topRow = ctx.getImageData(0, 0, w, 1);
              const bottomRow = ctx.getImageData(0, h - 1, w, 1);
              const leftCol = ctx.getImageData(0, 0, 1, h);
              const rightCol = ctx.getImageData(w - 1, 0, 1, h);
              const topLeft = ctx.getImageData(0, 0, 1, 1);
              const topRight = ctx.getImageData(w - 1, 0, 1, 1);
              const bottomLeft = ctx.getImageData(0, h - 1, 1, 1);
              const bottomRight = ctx.getImageData(w - 1, h - 1, 1, 1);

              for (let y = 0; y < bleed; y++) {
                glowCtx.putImageData(topRow, bleed, y);
                glowCtx.putImageData(bottomRow, bleed, h + bleed + y);
              }

              for (let x = 0; x < bleed; x++) {
                glowCtx.putImageData(leftCol, x, bleed);
                glowCtx.putImageData(rightCol, w + bleed + x, bleed);
              }

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
                if (tappedIndex === i) {
                  setLightboxSrc(e.target.src);
                  setTappedIndex(null);
                  setTimeout(() => setIsAnimating(true), 20);
                } else {
                  setTappedIndex(i);
                }
              } else {
                setLightboxSrc(e.target.src);
                setTimeout(() => setIsAnimating(true), 20);
              }
            };

            const showGlow = isTouchDevice ? tappedIndex === i : false;
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

            return (
              <div
                key={i}
                className="inline-block w-full mb-8 break-inside-avoid group cursor-pointer px-[15px] sm:px-0"
              >
                <div className="relative w-full overflow-visible">
                  {glowDataUrl && (
                    <img
                      src={glowDataUrl}
                      alt=""
                      aria-hidden="true"
                      className={clsx(
                        'absolute top-[px] left-[px] sm:top-[px] sm:left-[px] z-0 transition-opacity duration-500 pointer-events-none',
                        'blur-xl sm:blur-2xl',
                        {
                          'opacity-100': showGlow,
                          'group-hover:opacity-80 opacity-0': !showGlow,
                        }
                      )}
                      style={{
                        width: isMobile ? 'calc(100%)' : 'calc(100%)',
                        height: isMobile ? 'calc(100%)' : 'calc(100%)',
                      }}
                    />
                  )}

                  <img
                    src={mod.default}
                    alt={`Photo ${i}`}
                    onLoad={handleLoad}
                    onClick={handleClick}
                    className="w-full h-auto object-cover relative z-10"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {lightboxSrc && (
        <div className="lightbox-open fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
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
    </>
  );
}