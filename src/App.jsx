import Gallery from './Gallery';
import logo from './assets/Personal_Brand_Logo.png';
import instalogo from './assets/instalogo.png';
import footerlogo from './assets/footerlogo.png';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const body = document.body;
    const observer = new MutationObserver(() => {
      const lightbox = document.querySelector('.lightbox-open');
      if (lightbox) {
        body.classList.add('no-scroll');
      } else {
        body.classList.remove('no-scroll');
      }
    });
    observer.observe(body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen text-white bg-[#0C0C0C]">
      {/* Top right to left window light beams removed */}
      {/* (No beams-container or beam divs) */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
      <header className="pt-12 pb-8">
        {/* Logo and Social Media Section */}
        <div className="flex justify-between items-center gap-6 mb-6 md:pl-3 lg:pl-5">
            <img
                src={logo}
                alt="Logo"
                className="w-24 h-auto object-contain"
            />
            <div className="flex space-x-4 md:pr-3 lg:pr-5">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={instalogo} alt="Instagram" className="w-6 h-6 object-contain" />
            </a>
            </div>
        </div>
        
        {/* Bio Section */}
        <div className="md:pl-3 lg:pl-5">
            <p
                className="whitespace-nowrap bg-gradient-to-b from-[#AFAFAF] to-[#606060] bg-clip-text text-transparent"
                style={{
                  fontFamily: 'Neue Montreal',
                  fontWeight: 300,
                  fontSize: 'clamp(12px, 2.5vw, 18px)',
                  lineHeight: 1.2,
                }}
            >
                Based in <span>Toronto</span>.
                <span style={{ display: 'inline-block', marginLeft: '0.75em' }}>Finding <span>clarity</span> in <span>chaos</span>.</span>
            </p>
        </div>
        </header>
        {/* Gallery */}
        <Gallery glowOpacity={0.9} />

        {/* Footer */}
        <footer
          className="border-t border-[#333] mt-16 pt-6 pb-10 text-sm md:text-base bg-[#0C0C0C]"
          style={{ color: '#4E4E4E', fontFamily: 'Neue Montreal', fontWeight: 300 }}
        >
          <div className="flex flex-row justify-between items-center w-full">
            <img src={footerlogo} alt="Footer Logo" className="w-8 h-auto object-contain" />
            <span>© 2025</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;