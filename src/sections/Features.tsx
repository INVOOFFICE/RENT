import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { MousePointerClick } from 'lucide-react';

export default function Features() {
  const sectionRef = useScrollAnimation<HTMLElement>({ animation: 'fadeInUp' });

  return (
    <section ref={sectionRef} className="bg-white py-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-0 rounded-2xl overflow-hidden shadow-card">
          {/* Image 1 */}
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
            <img
              src="/images/car-1.jpg"
              alt="Remise des clés"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Image 2 */}
          <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
            <img
              src="/images/car-5.jpg"
              alt="Client avec le concessionnaire"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Info Card */}
          <div className="bg-remons-blue p-8 md:p-10 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-5">
              <MousePointerClick size={24} className="text-white" />
            </div>
            <h4 className="font-poppins text-xl font-semibold text-white mb-3">
              Réservations Plus Rapides &amp; Faciles
            </h4>
            <p className="text-white/80 text-sm font-inter leading-relaxed">
              Un service rapide et fiable pour toutes vos locations de voitures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
