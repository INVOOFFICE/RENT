import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Car } from '@/lib/supabase';

interface CarFormProps {
  car?: Car | null;
  onSave: (data: Partial<Car>) => Promise<void>;
  onCancel: () => void;
}

const defaultForm = {
  name: '',
  category: 'CAT A' as const,
  price: 0,
  duration: 'jour',
  seats: 5,
  transmission: 'Manuelle',
  doors: 4,
  fuel: 'Essence',
  image: '',
  active: true,
};

const CATEGORIES = ['CAT A', 'CAT B', 'CAT C', 'CAT D'] as const;

export default function CarForm({ car, onSave, onCancel }: CarFormProps) {
  const [form, setForm] = useState(() => {
    if (!car) return defaultForm;
    return {
      name: car.name,
      category: car.category as typeof defaultForm.category,
      price: car.price,
      duration: car.duration,
      seats: car.seats,
      transmission: car.transmission,
      doors: car.doors,
      fuel: car.fuel,
      image: car.image,
      active: car.active,
    };
  });
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(car?.image || null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let imageUrl = form.image;

    if (file) {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('car-images').upload(fileName, file);
      if (uploadError) {
        alert('Erreur upload: ' + uploadError.message);
        setSaving(false);
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('car-images').getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
      setUploading(false);
    }

    await onSave({ ...form, image: imageUrl });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Nom</label>
          <input
            type="text" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as typeof defaultForm.category })}
            className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary bg-white"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Prix base (EUR/jour)</label>
          <input
            type="number" required min={0} value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Places</label>
          <input
            type="number" required min={1} value={form.seats}
            onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
            className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Transmission</label>
          <input
            type="text" required value={form.transmission}
            onChange={(e) => setForm({ ...form, transmission: e.target.value })}
            className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Portes</label>
          <input
            type="number" required min={1} value={form.doors}
            onChange={(e) => setForm({ ...form, doors: Number(e.target.value) })}
            className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Carburant</label>
          <input
            type="text" required value={form.fuel}
            onChange={(e) => setForm({ ...form, fuel: e.target.value })}
            className="w-full border border-remons-border rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-2 focus:ring-remons-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-inter font-medium text-remons-dark mb-1">Image</label>
          <input
            type="file" accept="image/*"
            onChange={handleFileSelect}
            className="w-full border border-remons-border rounded-xl px-3 py-2 text-sm font-inter file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-remons-primary file:text-white hover:file:bg-remons-primary-dark"
          />
          {preview && (
            <img src={preview} alt="Aperçu" className="mt-2 h-20 w-28 object-cover rounded-lg border border-remons-border" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox" id="active" checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
          className="rounded border-remons-border"
        />
        <label htmlFor="active" className="text-sm font-inter text-remons-dark">Voiture active</label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit" disabled={saving || uploading}
          className="bg-remons-primary text-white font-poppins text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-remons-primary-dark transition-colors disabled:opacity-50"
        >
          {uploading ? 'Upload...' : saving ? 'Enregistrement...' : car ? 'Mettre à jour' : 'Ajouter'}
        </button>
        <button
          type="button" onClick={onCancel}
          className="text-remons-gray font-inter text-sm hover:text-remons-dark transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
