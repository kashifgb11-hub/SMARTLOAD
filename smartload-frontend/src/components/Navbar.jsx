import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { scrollToSection } from '../utils/scroll';

const links = [
  { id: 'home', label: 'Home' },
  { id: 'energy-predictor', label: 'Energy Predictor' },
  { id: 'optimize', label: 'Optimize' },
];

function BuildingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5L20 9V21H4V9L12 3.5Z"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9.5 21V14.5H14.5V21" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 11H9.5M8 13.5H9.5M14.5 11H16M14.5 13.5H16" stroke="#FFFFFF" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = links.map((link) => document.getElementById(link.id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 bg-primary transition-shadow duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BuildingIcon />
          <div className="flex flex-col justify-center leading-tight">
            <span className="text-brand text-white">SmartLoad</span>
            <span className="hidden sm:block text-[11px] text-blue-200 -mt-0.5">
              Predict Building Energy Demand Before You Build
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {links.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className={`relative py-2 text-body font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-white/75 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-white rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
