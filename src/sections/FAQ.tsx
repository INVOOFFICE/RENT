import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'Comment réserver une voiture ?',
    answer: 'La réservation est simple et rapide. Choisissez votre véhicule, sélectionnez vos dates de prise en charge et de retour, puis confirmez votre réservation en ligne. Notre équipe vous contactera pour finaliser les détails.',
  },
  {
    id: 2,
    question: 'Quels sont les modes de paiement acceptés ?',
    answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard), les virements bancaires et les paiements en espèces lors de la prise en charge du véhicule.',
  },
  {
    id: 3,
    question: 'Puis-je annuler ma réservation ?',
    answer: 'Oui, vous pouvez annuler votre réservation jusqu\'à 24 heures avant la date de prise en charge sans frais. Des frais de 50 % s\'appliquent pour les annulations tardives.',
  },
  {
    id: 4,
    question: 'Y a-t-il une limite de kilométrage ?',
    answer: 'Nos forfaits incluent un kilométrage illimité sur la plupart de nos véhicules. Certains modèles premium peuvent avoir une limite journalière, veuillez vérifier les conditions lors de la réservation.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(3);
  const sectionRef = useScrollAnimation<HTMLElement>({ animation: 'fadeInUp' });
  const leftRef = useScrollAnimation<HTMLDivElement>({ animation: 'fadeInLeft' });
  const rightRef = useScrollAnimation<HTMLDivElement>({
    animation: 'fadeInRight',
    childSelector: '.faq-item',
    stagger: 0.1,
  });

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section ref={sectionRef} className="bg-remons-light-gray py-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-16">
          {/* Left */}
          <div ref={leftRef}>
            <span className="text-remons-primary text-[13px] font-inter font-medium uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="font-poppins text-3xl sm:text-[42px] font-bold text-remons-dark leading-[1.2] mt-3">
              Questions Fréquemment Posées
            </h2>
            {/* Decorative car SVG */}
            <svg
              className="mt-8 opacity-10"
              width="200"
              height="100"
              viewBox="0 0 200 100"
              fill="none"
            >
              <path
                d="M20 60c0-20 15-35 40-35h30c15 0 28 7 35 20"
                stroke="#1A1A2E"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="45" cy="60" r="18" stroke="#1A1A2E" strokeWidth="3" fill="none" />
              <circle cx="155" cy="60" r="18" stroke="#1A1A2E" strokeWidth="3" fill="none" />
              <path d="M30 55l-10-25" stroke="#1A1A2E" strokeWidth="3" fill="none" />
              <path d="M35 30h90l-10-20H45z" stroke="#1A1A2E" strokeWidth="3" fill="none" />
            </svg>
          </div>

          {/* Right - Accordion */}
          <div ref={rightRef} className="space-y-0">
            {faqs.map((faq) => (
              <div key={faq.id} className="faq-item border-b border-remons-border">
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="font-poppins text-lg font-semibold text-remons-dark pr-4 group-hover:text-remons-primary transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-remons-gray shrink-0 transition-transform duration-300 ${
                      openId === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openId === faq.id ? 'max-h-48 pb-5' : 'max-h-0'
                  }`}
                >
                  <p className="text-remons-gray text-base font-inter leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
