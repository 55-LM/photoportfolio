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
      <div className="overflow-visible pb-20 sm:pb-12" style={{ overflow: 'visible' }}>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-x-8 p-6 [column-gap:2rem] overflow-visible" style={{ overflow: 'visible' }}>
          {imageEntries.map(([path, mod], i) => {
            const [glowDataUrl, setGlowDataUrl] = useState(null);

            const handleLoad = (e) => {
              const img = e.target;
              const w = img.naturalWidth;
              const h = img.naturalHeight;
              const bleed = 30;

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

            return (
              <div
                key={i}
                className="inline-block w-full mb-8 break-inside-avoid group cursor-pointer overflow-visible"
              >
                <div className="relative w-full overflow-visible">
                  <div className="relative inline-block">
                    {glowDataUrl && (
                      <img
                        src={glowDataUrl}
                        alt=""
                        aria-hidden="true"
                        className={clsx(
                          'absolute z-0 blur-2xl transition-opacity duration-500 pointer-events-none',
                          {
                            'opacity-100': showGlow,
                            'group-hover:opacity-80 opacity-0': !showGlow,
                          }
                        )}
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: 'calc(100% + 60px)',
                          height: 'calc(100% + 60px)',
                        }}
                      />
                    )}
                    <img
                      src={mod.default}
                      alt={`Photo ${i}`}
                      onLoad={handleLoad}
                      onClick={!isTouchDevice ? handleClick : undefined}
                      onTouchStart={isTouchDevice ? handleClick : undefined}
                      className="block h-auto object-cover relative z-10"
                    />
                  </div>
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