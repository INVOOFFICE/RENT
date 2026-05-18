import { Mail, MapPin } from 'lucide-react';

const socialLinks = [
  { name: 'Facebook', href: '#' },
  { name: 'Twitter', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'YouTube', href: '#' },
];

export default function TopBar() {
  return (
    <div className="bg-remons-secondary text-white hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[42px]">
          {/* Left */}
          <div className="flex items-center gap-4 text-[13px] font-inter">
            <a href="mailto:info@example.com" className="flex items-center gap-2 hover:text-remons-primary transition-colors">
              <Mail size={14} />
              <span>info@example.com</span>
            </a>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>88 Broklyn Golden Street, New York</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 text-[13px] font-inter">
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-remons-primary transition-colors">Aide</a>
              <a href="#" className="hover:text-remons-primary transition-colors">Support</a>
              <a href="#" className="hover:text-remons-primary transition-colors">Contact</a>
            </div>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-remons-primary transition-colors"
                  aria-label={link.name}
                >
                  {link.name === 'Facebook' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  )}
                  {link.name === 'Twitter' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                    </svg>
                  )}
                  {link.name === 'LinkedIn' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  )}
                  {link.name === 'YouTube' && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
