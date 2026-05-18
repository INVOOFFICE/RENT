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
          <div ref={imagesRef} className="grid grid-cols-3 grid-rows-2 gap-4">
            {/* Large left image */}
            <div className="gallery-item row-span-2 relative rounded-xl overflow-hidden group">
              <img
                src={img('/images/car-1.jpg')}
                alt="Galerie 1"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-remons-primary/0 group-hover:bg-remons-primary/20 transition-colors duration-300" />
            </div>

            {/* Top middle */}
            <div className="gallery-item relative rounded-xl overflow-hidden group">
              <img
                src={img('/images/car-3.jpg')}
                alt="Galerie 2"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-remons-primary/0 group-hover:bg-remons-primary/20 transition-colors duration-300" />
            </div>

            {/* Top right - tall */}
            <div className="gallery-item row-span-2 relative rounded-xl overflow-hidden group">
              <img
                src={img('/images/car-6.jpg')}
                alt="Galerie 3"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-remons-primary/0 group-hover:bg-remons-primary/20 transition-colors duration-300" />
            </div>

            {/* Bottom middle */}
            <div className="gallery-item relative rounded-xl overflow-hidden group">
              <img
                src={img('/images/car-4.jpg')}
                alt="Galerie 4"
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-remons-primary/0 group-hover:bg-remons-primary/20 transition-colors duration-300" />
            </div>
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
              <button className="w-14 h-14 rounded-full bg-white text-remons-primary flex items-center justify-center mx-auto hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
