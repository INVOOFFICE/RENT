import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ImagePlus } from 'lucide-react';
import { img } from '@/lib/utils';

export default function Gallery() {
  const sectionRef = useScrollAnimation<HTMLElement>({
    animation: 'fadeIn',
  });
  const imagesRef = useScrollAnimation<HTMLDivElement>({
    animation: 'scaleIn',
    childSelector: '.gallery-item',
    stagger: 0.1,
  });

  return (
    <section id="gallery" ref={sectionRef} className="bg-remons-light-gray py-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
          {/* Masonry Grid */}
          <div ref={imagesRef} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="gallery-item aspect-[4/3] relative rounded-xl overflow-hidden group">
                <img
                  src={img(`/images/car-${i + 1}.jpg`)}
                  alt={`Galerie ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-remons-primary/0 group-hover:bg-remons-primary/20 transition-colors duration-300" />
              </div>
            ))}
          </div>

          {/* Info Panel */}
          <div className="relative rounded-xl overflow-hidden flex items-center justify-center min-h-[300px]">
            {/* Diagonal gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-remons-primary to-remons-blue" />
            
            <div className="relative z-10 text-center p-8">
              <div className="w-14 h-14 rounded-full border-2 border-white/40 flex items-center justify-center mx-auto mb-6">
                <ImagePlus size={28} className="text-white" />
              </div>
              <h3 className="font-poppins text-2xl font-bold text-white leading-tight mb-6">
                Location de Voitures
                <br />
                de Confiance
                <br />
                &amp; Fiable
              </h3>
              <a
                href="#cars"
                className="w-14 h-14 rounded-full bg-white text-remons-primary flex items-center justify-center mx-auto hover:scale-110 hover:shadow-lg transition-all duration-300"
              >
                <span className="text-2xl font-bold">+</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
