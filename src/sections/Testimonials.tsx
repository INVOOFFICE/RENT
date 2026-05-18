import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Christine Eve',
    role: 'Client',
    avatar: '/images/team-2.jpg',
    text: 'Grâce à leur excellent service, leurs prix compétitifs et leur support client. C\'est vraiment rafraîchissant de bénéficier d\'une attention si personnalisée.',
  },
  {
    id: 2,
    name: 'Mike Hardson',
    role: 'Client',
    avatar: '/images/team-1.jpg',
    text: 'Grâce à leur excellent service, leurs prix compétitifs et leur support client. C\'est vraiment rafraîchissant de bénéficier d\'une attention si personnalisée.',
  },
  {
    id: 3,
    name: 'Shirley Smith',
    role: 'Client',
    avatar: '/images/team-3.jpg',
    text: 'Grâce à leur excellent service, leurs prix compétitifs et leur support client. C\'est vraiment rafraîchissant de bénéficier d\'une attention si personnalisée.',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useScrollAnimation<HTMLElement>({ animation: 'fadeInUp' });

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={sectionRef} className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Testimonial */}
          <div className="text-center max-w-2xl mx-auto">
            {/* Avatars Row */}
            <div className="flex items-center justify-center gap-3 mb-8">
              {testimonials.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setCurrent(i)}
                  className={`w-[60px] h-[60px] rounded-full overflow-hidden border-3 transition-all duration-300 ${
                    i === current
                      ? 'border-remons-primary scale-110'
                      : 'border-transparent opacity-60 hover:opacity-80'
                  }`}
                >
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Quote */}
            <p className="text-remons-gray text-base sm:text-lg font-inter leading-relaxed italic mb-6">
              &ldquo;{testimonials[current].text}&rdquo;
            </p>

            {/* Name */}
            <h4 className="font-poppins text-xl font-semibold text-remons-dark mb-1">
              {testimonials[current].name}
            </h4>
            <span className="text-remons-primary text-[13px] font-inter font-medium uppercase tracking-wider">
              {testimonials[current].role}
            </span>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-remons-border flex items-center justify-center hover:bg-remons-primary hover:text-white hover:border-remons-primary transition-all duration-300"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-remons-border flex items-center justify-center hover:bg-remons-primary hover:text-white hover:border-remons-primary transition-all duration-300"
              aria-label="Témoignage suivant"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
