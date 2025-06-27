import Gallery from './Gallery';
import logo from './assets/Personal_Brand_Logo.png';
import xlogo from './assets/xlogo.png';
import instalogo from './assets/instalogo.png';
import footerlogo from './assets/footerlogo.png';
import { useEffect } from 'react';

function App() {
  //Scrolling is disabled when lightbox is open
  useEffect(() => {
    const body = document.body;
    const observer = new MutationObserver(() => {
      const lightbox = document.querySelector('.lightbox-open');
      if (lightbox) {
        body.classList.add('overflow-hidden');
      } else {
        body.classList.remove('overflow-hidden');
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="grain-bg relative min-h-screen text-white"
      style={{ backgroundColor: '#0C0C0C' }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
        {/*Header*/}
        <header className="pt-12 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/*Logo and Bio*/}
            <div className="flex flex-col items-start space-y-4 md:pl-2 lg:pl-4">
              <img
                src={logo}
                alt="Logo"
                className="w-24 h-auto object-contain"
              />
              <p
                className="text-sm sm:text-base max-w-2xl leading-relaxed bg-gradient-to-b from-[#AFAFAF] to-[#606060] bg-clip-text text-transparent"
                style={{ fontFamily: 'Neue Montreal', fontWeight: 300 }}
              >
                Photographer based in Toronto. Finding clarity in chaos.
              </p>
            </div>

            {/*Social Media*/}
            <div className="flex space-x-4 md:pr-2 lg:pr-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src={xlogo} alt="X" className="w-6 h-6 object-contain" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={instalogo} alt="Instagram" className="w-6 h-6 object-contain" />
              </a>
            </div>
          </div>
        </header>

        {/*Gallery*/}
        <Gallery glowOpacity={0.9} />

        {/*Footer*/}
        <footer
          className="border-t border-[#333] mt-16 pt-6 pb-10 text-sm md:text-base"
          style={{ color: '#4E4E4E' }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <img
              src={footerlogo}
              alt="Footer Logo"
              className="w-8 h-auto object-contain"
            />
            <span style={{ fontFamily: 'Neue Montreal', fontWeight: 300 }}>
              © 2025
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;