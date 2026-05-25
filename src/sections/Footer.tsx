
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';
import { img } from '@/lib/utils';
import { useState } from 'react';
import TermsModal from '@/components/TermsModal';
import PrivacyModal from '@/components/PrivacyModal';

const socialLinks = [
  {
    name: 'Facebook',
    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  },
  {
    name: 'Twitter',
    path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
  },
  {
    name: 'LinkedIn',
    path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  },
  {
    name: 'YouTube',
    path: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z M9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02z',
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
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-remons-primary transition-colors duration-300"
                aria-label={link.name}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={link.path} />
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
