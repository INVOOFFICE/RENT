import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { MousePointerClick, MapPin, ChevronDown } from 'lucide-react';
import { img } from '@/lib/utils';
import { DatePicker } from '@/components/DatePicker';

const PHONE = '212661341407';

export default function About() {
  const { t } = useTranslation();
  const locations = [
    'Marrakech ville', 'Aéroport Marrakech',
    'Casablanca ville', 'Aéroport Casablanca',
    'Rabat ville', 'Aéroport Rabat',
    'Agadir ville', 'Aéroport Agadir',
    'Fès ville', 'Aéroport Fès',
    'Ouarzazate ville', 'Aéroport Ouarzazate',
    'Essaouira ville', 'Aéroport Essaouira',
    'Tanger ville', 'Aéroport Tanger',
  ];

  const features = [
    {
      icon: MousePointerClick,
      titleKey: 'booking',
    },
    {
      icon: MapPin,
      titleKey: 'locations',
    },
  ];
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [carNames, setCarNames] = useState<string[]>([]);
  const [location, setLocation] = useState(locations[0]);
  const [vehicleType, setVehicleType] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/cars.json`)
      .then((res) => res.json())
      .then((data) => setCarNames(data.map((c: { name: string }) => c.name)))
      .catch(() => {});
  }, []);

  const handleBooking = () => {
    const message = [
      t('about.bookingTitle'),
      '',
      t('about.locationField') + location,
      t('about.vehicleField') + (vehicleType || t('about.notSpecified')),
      t('about.startField') + (fromDate || t('about.notSpecifiedF')),
      t('about.endField') + (toDate || t('about.notSpecifiedF')),
    ].join('\n');
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };
  const sectionRef = useScrollAnimation<HTMLElement>({ animation: 'fadeInUp' });
  const leftRef = useScrollAnimation<HTMLDivElement>({
    animation: 'fadeInUp',
    childSelector: '.animate-item',
    stagger: 0.1,
  });
  const rightRef = useScrollAnimation<HTMLDivElement>({
    animation: 'fadeInRight',
    delay: 0.2,
  });

  return (
    <section id="about" ref={sectionRef} className="bg-remons-light-gray py-[100px] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[55%_45%] gap-16 items-center">
          {/* Left Content */}
          <div ref={leftRef}>
            {/* Subtitle */}
            <div className="flex items-center gap-3 mb-4 animate-item">
              <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
                <path d="M2 12c0-4 3-7 7-7h5c3 0 5 1.5 6 4" stroke="#08B5F4" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <circle cx="8" cy="12" r="3" stroke="#08B5F4" strokeWidth="1.5" fill="none"/>
                <circle cx="24" cy="12" r="3" stroke="#08B5F4" strokeWidth="1.5" fill="none"/>
                <path d="M6 10l-2-5" stroke="#08B5F4" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="text-remons-primary text-[13px] font-inter font-medium uppercase tracking-wider">
                {t('about.subtitle')}
              </span>
            </div>

            <h2 className="font-poppins text-3xl sm:text-[42px] font-bold text-remons-dark leading-[1.2] mb-6 animate-item"
              dangerouslySetInnerHTML={{ __html: t('about.title') }} />

            <p className="text-remons-gray text-base font-inter leading-relaxed mb-10 animate-item">
              {t('about.description')}
            </p>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((f) => (
                <div key={f.titleKey} className="animate-item">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-remons-primary to-remons-primary-light shadow-button flex items-center justify-center mb-4">
                    <f.icon size={24} className="text-white" />
                  </div>
                  <h4 className="font-poppins text-lg font-semibold text-remons-dark mb-1">
                    {t(`about.features.${f.titleKey}.title`)}
                  </h4>
                  <p className="text-remons-gray text-sm font-inter">{t(`about.features.${f.titleKey}.desc`)}</p>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="animate-item mt-10">
              <div className="flex items-center gap-3 mb-4">
                <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
                  <path d="M2 12c0-4 3-7 7-7h5c3 0 5 1.5 6 4" stroke="#08B5F4" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <circle cx="8" cy="12" r="3" stroke="#08B5F4" strokeWidth="1.5" fill="none"/>
                  <circle cx="24" cy="12" r="3" stroke="#08B5F4" strokeWidth="1.5" fill="none"/>
                  <path d="M6 10l-2-5" stroke="#08B5F4" strokeWidth="1.5" fill="none"/>
                </svg>
                <span className="text-remons-primary text-[13px] font-inter font-medium uppercase tracking-wider">
                  NOS AVANTAGES
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Sans caution', 'Sans carte de crédit', '2ᵉ conducteur gratuit', 'Siège enfant gratuit', 'Sans acompte', 'Assistance 7/7'].map((tag) => (
                  <span key={tag} className="inline-block bg-remons-primary/10 text-remons-primary text-xs font-medium px-3 py-1.5 rounded-full border border-remons-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-remons-gray text-sm font-inter leading-relaxed mb-4">
                Livraison gratuite à l'aéroport et centre-ville de Marrakech. Location disponible à Casablanca, Agadir, Rabat, Fès, Tanger et Essaouira.
              </p>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-remons-gray font-inter">WhatsApp :</span>
                <a href="https://wa.me/212661341407" target="_blank" rel="noopener noreferrer" className="text-remons-primary hover:text-remons-primary-dark font-medium transition-colors">
                  +212 6 61 34 14 07
                </a>
                <span className="text-remons-gray/40">|</span>
                <a href="https://wa.me/212662357104" target="_blank" rel="noopener noreferrer" className="text-remons-primary hover:text-remons-primary-dark font-medium transition-colors">
                  +212 6 62 35 71 04
                </a>
              </div>
            </div>
          </div>

          {/* Right - Image + Form */}
          <div ref={rightRef} className="relative">
            <img
              src={img('/images/about-man.png')}
              alt={t('about.consultantAlt')}
              loading="lazy"
              className="w-full max-w-[400px] mx-auto object-contain relative z-10"
            />

            {/* Floating Form */}
            <div className="premium-panel absolute bottom-[-30px] right-0 lg:right-[-20px] w-[300px] max-w-full rounded-3xl p-6 z-20">
              <div className="space-y-3">
                <div>
                  <label className="block text-white text-[12px] font-inter font-medium mb-1.5">
                    Lieu de prise en charge / Livraison
                  </label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white rounded-lg px-3 py-2.5 pr-8 appearance-none font-inter text-remons-dark text-sm focus:outline-none"
                    >
                      {locations.map((loc) => (
                        <option key={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-remons-gray pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-white text-[12px] font-inter font-medium mb-1.5">
                      {t('about.startDateLabel')}
                    </label>
                    <DatePicker
                      value={fromDate}
                      onChange={setFromDate}
                    />
                  </div>
                  <div>
                    <label className="block text-white text-[12px] font-inter font-medium mb-1.5">
                      {t('about.endDateLabel')}
                    </label>
                    <DatePicker
                      value={toDate}
                      onChange={setToDate}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-[12px] font-inter font-medium mb-1.5">
                    {t('about.vehicleLabel')}
                  </label>
                  <div className="relative">
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full bg-white rounded-lg px-3 py-2.5 pr-8 appearance-none font-inter text-remons-dark text-sm focus:outline-none"
                    >
                      <option value="">{t('about.vehiclePlaceholder')}</option>
                      {carNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-remons-gray pointer-events-none" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleBooking}
                  className="w-full bg-remons-secondary text-white font-poppins text-sm font-semibold py-2.5 rounded-lg hover:bg-slate-950 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {t('about.bookNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
