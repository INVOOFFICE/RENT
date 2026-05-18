import { useState } from 'react';
import { Phone, Search, ChevronDown, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', href: '#', hasDropdown: true },
  { label: 'À Propos', href: '#about' },
  { label: 'Galerie', href: '#gallery' },
  { label: 'Voitures', href: '#cars', hasDropdown: true },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-remons-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 shrink-0">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <rect width="44" height="44" rx="10" fill="#FF3B30"/>
              <path d="M12 28c0-3 2.5-5.5 5.5-5.5h3.5c2 0 3.5 1 4.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M11 29.5h22" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="17" cy="29.5" r="3" stroke="white" strokeWidth="1.5"/>
              <circle cx="27" cy="29.5" r="3" stroke="white" strokeWidth="1.5"/>
              <path d="M14.5 27.5l-1.5-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 22h10l-1.5-4h-7z" stroke="white" strokeWidth="1.5"/>
            </svg>
            <div className="leading-tight">
              <span className="font-poppins font-bold text-[18px] text-remons-dark tracking-tight block">REMONS</span>
              <span className="font-inter text-[10px] text-remons-gray tracking-widest uppercase block -mt-0.5">car rental</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1 font-poppins text-[15px] font-medium text-remons-dark hover:text-remons-primary transition-colors"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown size={12} className="mt-0.5" />}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-remons-primary flex items-center justify-center">
                <Phone size={18} className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] text-remons-gray font-inter">Appelez à tout moment</p>
                <p className="text-[15px] font-poppins font-semibold text-remons-dark">+92 (8800) - 9850</p>
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-10 bg-remons-border" />

            {/* Search */}
            <button className="p-2 hover:text-remons-primary transition-colors" aria-label="Rechercher">
              <Search size={20} />
            </button>

            {/* CTA Button */}
            <a
              href="#cars"
              className="bg-remons-primary text-white font-poppins text-sm font-semibold px-6 py-3 rounded-full hover:bg-remons-primary-dark hover:-translate-y-0.5 hover:shadow-button transition-all duration-300"
            >
              Trouver une Voiture
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-remons-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block font-poppins text-base font-medium text-remons-dark hover:text-remons-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#cars"
              className="block bg-remons-primary text-white font-poppins text-sm font-semibold px-6 py-3 rounded-full text-center mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trouver une Voiture
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
