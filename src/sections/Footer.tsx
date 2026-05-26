
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import { img } from '@/lib/utils';
import { useState } from 'react';
import TermsModal from '@/components/TermsModal';
import PrivacyModal from '@/components/PrivacyModal';

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/louervoituremarrakech/',
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/yacouttours_rent_a_car/',
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
  },
];

export default function Footer() {
  const { t } = useTranslation();
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  return (
    <footer id="contact" className="bg-remons-secondary pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-10 mb-10 border-b border-white/10">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <img src={img('/pwa.png')} alt="Yacout Tours" className="h-28 w-auto" />
          </a>

          {/* Tagline */}
          <p className="text-white/80 font-poppins text-lg font-semibold">
            {t('footer.tagline')}
          </p>

          {/* Social */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-remons-primary transition-colors duration-300"
                aria-label={link.name}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {link.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm font-inter">
            &copy; {new Date().getFullYear()} {t('footer.copyright')} — {t('common.address')} — {t('common.phone')}
            {' — '}
            <button onClick={() => setTermsOpen(true)} className="underline hover:text-white transition-colors">
              {t('footer.terms')}
            </button>
            {' — '}
            <button onClick={() => setPrivacyOpen(true)} className="underline hover:text-white transition-colors">
              {t('footer.privacy')}
            </button>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-remons-primary hover:text-white transition-all duration-300"
            aria-label={t('footer.backToTop')}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  );
}
