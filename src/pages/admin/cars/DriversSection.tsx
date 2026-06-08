import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, User, CarTaxiFront, Luggage, Moon } from 'lucide-react';

export default function DriversSection() {
  const [id, setId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [pricePerHour, setPricePerHour] = useState(10);
  const [halfDayPrice, setHalfDayPrice] = useState(40);
  const [fullDayPrice, setFullDayPrice] = useState(70);
  const [price24h, setPrice24h] = useState(120);
  const [airportExtra, setAirportExtra] = useState(15);
  const [nightExtra, setNightExtra] = useState(20);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('drivers_settings').select('*').limit(1).then(({ data, error }) => {
      if (error) {
        setErrorMsg(error.message);
      } else if (data && data.length > 0) {
        const row = data[0];
        setId(row.id);
        setEnabled(row.enabled);
        setPricePerHour(row.price_per_hour);
        setHalfDayPrice(row.half_day_price);
        setFullDayPrice(row.full_day_price);
        setPrice24h(row.price_24h);
        setAirportExtra(row.airport_extra);
        setNightExtra(row.night_extra);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setErrorMsg(null);
    setSaved(false);
    setSaving(true);

    const payload = {
      enabled,
      price_per_hour: pricePerHour,
      half_day_price: halfDayPrice,
      full_day_price: fullDayPrice,
      price_24h: price24h,
      airport_extra: airportExtra,
      night_extra: nightExtra,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (id) {
      ({ error } = await supabase.from('drivers_settings').update(payload).eq('id', id));
    } else {
      ({ error } = await supabase.from('drivers_settings').insert(payload));
    }

    setSaving(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-remons-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Activation */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-remons-primary" />
          <h3 className="font-poppins text-base font-semibold text-remons-dark">Service chauffeur privé</h3>
        </div>
        <p className="text-xs text-remons-gray font-inter mb-4">
          Activer ou désactiver la réservation de chauffeurs privés sur le site.
        </p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="rounded border-remons-border text-remons-primary focus:ring-remons-primary"
          />
          <span className="text-sm font-inter font-medium text-remons-dark">
            {enabled ? 'Service activé' : 'Service désactivé'}
          </span>
        </label>
      </div>

      {/* Tarifs */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <CarTaxiFront size={18} className="text-remons-primary" />
          <h3 className="font-poppins text-base font-semibold text-remons-dark">Tarifs (EUR)</h3>
        </div>
        <p className="text-xs text-remons-gray font-inter mb-4">
          Prix de base pour les prestations de chauffeur privé.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Prix par heure</label>
            <input
              type="number" min={0} step={0.01} value={pricePerHour}
              onChange={(e) => setPricePerHour(Number(e.target.value))}
              className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Demi-journée (4h)</label>
            <input
              type="number" min={0} step={0.01} value={halfDayPrice}
              onChange={(e) => setHalfDayPrice(Number(e.target.value))}
              className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Journée complète (8h)</label>
            <input
              type="number" min={0} step={0.01} value={fullDayPrice}
              onChange={(e) => setFullDayPrice(Number(e.target.value))}
              className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-inter font-medium text-remons-dark mb-1">24h</label>
            <input
              type="number" min={0} step={0.01} value={price24h}
              onChange={(e) => setPrice24h(Number(e.target.value))}
              className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
            />
          </div>
        </div>
      </div>

      {/* Suppléments */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Luggage size={18} className="text-remons-primary" />
          <h3 className="font-poppins text-base font-semibold text-remons-dark">Suppléments (EUR)</h3>
        </div>
        <p className="text-xs text-remons-gray font-inter mb-4">
          Frais additionnels pour services spécifiques.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Supplément aéroport</label>
            <input
              type="number" min={0} step={0.01} value={airportExtra}
              onChange={(e) => setAirportExtra(Number(e.target.value))}
              className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Supplément nuit</label>
            <div className="flex items-center gap-2">
              <Moon size={16} className="text-remons-gray shrink-0" />
              <input
                type="number" min={0} step={0.01} value={nightExtra}
                onChange={(e) => setNightExtra(Number(e.target.value))}
                className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
              />
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-remons-primary font-inter">{errorMsg}</div>
      )}

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-remons-primary text-white font-poppins text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-remons-primary-dark transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        {saved && <span className="text-sm text-green-600 font-inter">✓ Configuration enregistrée</span>}
      </div>
    </div>
  );
}
