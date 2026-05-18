import Marquee from 'react-fast-marquee';

const partners = [
  { id: 1, name: 'AUTO RACING' },
  { id: 2, name: 'CAR BRAND' },
  { id: 3, name: 'TOPCARS' },
  { id: 4, name: 'EZCO' },
  { id: 5, name: 'DETAILING' },
  { id: 6, name: 'MOTORSPORT' },
];

export default function Partners() {
  return (
    <section className="bg-white py-16 border-t border-remons-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Marquee speed={40} gradient={false} pauseOnHover>
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex items-center justify-center mx-10 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer"
            >
              {/* SVG Logo Placeholder */}
              <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
                <path
                  d="M10 35c0-8 5-14 14-14h10c6 0 10 3 12 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle
                  cx="20"
                  cy="35"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="54"
                  cy="35"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <text
                  x="68"
                  y="34"
                  fontFamily="Poppins"
                  fontWeight="700"
                  fontSize="12"
                  fill="currentColor"
                >
                  {partner.name}
                </text>
              </svg>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
