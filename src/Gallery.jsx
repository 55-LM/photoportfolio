import { useState } from 'react';
import { FastAverageColor } from 'fast-average-color';
import clsx from 'clsx';

const images = import.meta.glob('./images/*.{jpg,jpeg,png}', { eager: true });

export default function Gallery({ glowOpacity = 0.9 }) {
  const imageEntries = Object.entries(images);
  const fac = new FastAverageColor();

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
      <div className="overflow-visible">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 p-4 overflow-visible">
          {imageEntries.map(([path, mod], i) => {
            const [glowColor, setGlowColor] = useState('rgba(255,255,255,0.2)');

            const handleLoad = (e) => {
              const color = fac.getColor(e.target);
              const rgba = `rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, ${glowOpacity})`;
              setGlowColor(rgba);
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

            return (
              <div
                key={i}
                className="relative mb-6 break-inside-avoid group cursor-pointer overflow-visible"
              >
                <div
                  className={clsx(
                    'absolute inset-[-40px] blur-3xl transition-opacity duration-500 z-0 pointer-events-none',
                    {
                      'opacity-100': showGlow,
                      'group-hover:opacity-100 opacity-0': !showGlow,
                    }
                  )}
                  style={{ background: glowColor }}
                ></div>

                <img
                  src={mod.default}
                  alt={`Photo ${i}`}
                  onLoad={handleLoad}
                  onClick={handleClick}
                  className="w-full h-auto object-cover relative z-10"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
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