import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

interface LegalSection {
  title: string;
  content: string;
}

export default function TermsModal({ open, onClose }: TermsModalProps) {
  const { t } = useTranslation();
  const sections = t('legal.terms.sections', { returnObjects: true }) as LegalSection[];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-elevated overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-remons-border">
          <h2 className="font-poppins text-xl font-bold text-remons-dark">
            {t('legal.terms.title')}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-remons-light-gray flex items-center justify-center hover:bg-remons-primary hover:text-white transition-colors shrink-0"
            aria-label={t('common.close')}
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-poppins text-base font-semibold text-remons-dark mb-2">
                {section.title}
              </h3>
              {section.content.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('- ')) {
                  return (
                    <li key={i} className="text-remons-gray text-sm font-inter leading-relaxed ml-4 list-disc">
                      {trimmed.slice(2)}
                    </li>
                  );
                }
                if (!trimmed) return null;
                return (
                  <p key={i} className="text-remons-gray text-sm font-inter leading-relaxed mb-1">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
