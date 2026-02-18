'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HiChevronRight, HiCheck } from 'react-icons/hi';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2';
import { FiSave } from 'react-icons/fi';
import { useAdminView } from '@/lib/admin-view-context';
import { useAdminStore } from '@/store/admin-store';

const DAYS_IN_MONTH: Record<string, number> = {
  Enero: 31, Febrero: 28, Marzo: 31, Abril: 30, Mayo: 31, Junio: 30,
  Julio: 31, Agosto: 31, Septiembre: 30, Octubre: 31, Noviembre: 30, Diciembre: 31,
};

interface DayForm {
  title: string;
  verse_text: string;
  verse_reference: string;
  reflection_content: string;
  prayer_content: string;
  image_url: string | null;
}

const emptyForm: DayForm = {
  title: '', verse_text: '', verse_reference: '',
  reflection_content: '', prayer_content: '', image_url: null,
};

export default function AdminDayEditorPage() {
  const params = useParams();
  const router = useRouter();
  const monthId = Number(params.monthId);
  const day = Number(params.day);
  const { setIsFullScreen } = useAdminView();
  const {
    months, isSaving, saved, setSaved,
    fetchMonths, fetchDevotionals, getDevotional, saveDevotional,
  } = useAdminStore();

  const [dayForm, setDayForm] = useState<DayForm>(emptyForm);
  const month = months.find((m) => m.id === monthId);
  const daysInMonth = month ? (DAYS_IN_MONTH[month.name] ?? 30) : 30;

  const loadFormFromStore = () => {
    const dev = getDevotional(monthId, day);
    if (dev) {
      setDayForm({
        title: dev.title ?? '',
        verse_text: dev.verse_text ?? '',
        verse_reference: dev.verse_reference ?? '',
        reflection_content: dev.reflection_content ?? '',
        prayer_content: dev.prayer_content ?? '',
        image_url: dev.image_url,
      });
    } else {
      setDayForm(emptyForm);
    }
    setSaved(false);
  };

  useEffect(() => {
    setIsFullScreen(true);
    if (months.length === 0) fetchMonths();
    fetchDevotionals(monthId).then(() => {
      loadFormFromStore();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthId, day]);

  const updateField = (field: keyof DayForm, value: string) => {
    setDayForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    await saveDevotional(monthId, day, dayForm);
  };

  const goToDay = (d: number) => {
    router.push(`/admin/${monthId}/${d}`);
  };

  if (!month) {
    return (
      <div className="flex justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }}
          className="w-8 h-8 border-3 border-pink-300 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-full px-5 py-3 mb-6 flex items-center gap-2 shadow-sm border border-gray-100 w-fit"
      >
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors cursor-pointer"
        >
          <span>🏠</span> Inicio
        </button>
        <HiChevronRight className="text-gray-300" size={16} />
        <button
          onClick={() => router.push(`/admin/${monthId}`)}
          className="flex items-center gap-1.5 text-sm font-bold text-gray-500 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <span>{month.icon_name}</span> {month.name}
        </button>
        <HiChevronRight className="text-gray-300" size={16} />
        <span className="text-sm font-bold text-white bg-pink-400 px-3.5 py-1 rounded-full">
          Día {day}
        </span>
      </motion.div>

      {/* Day Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-400">
          {month.icon_name} {day} de {month.name.toLowerCase()}
        </h2>
        <p className="text-sm text-gray-400 mt-1">Editando el devocional de este día</p>
      </motion.div>

      {/* Editor Form */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-5"
      >
        {/* Title */}
        <div>
          <Label className="text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
            📖 Título del devocional
          </Label>
          <Input
            value={dayForm.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="border-gray-200 rounded-xl"
            placeholder="El Osito Generoso 🐻💕"
          />
        </div>

        {/* Verse */}
        <div className="bg-orange-50/60 rounded-2xl p-5 border border-orange-100/60">
          <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-1.5">
            📖 Versículo del día
          </h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-400 mb-1">Texto del versículo</Label>
              <textarea
                value={dayForm.verse_text}
                onChange={(e) => updateField('verse_text', e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-pink-300 focus:outline-none resize-none bg-white"
                placeholder="En el principio creó Dios los cielos y la tierra."
              />
            </div>
            <div>
              <Label className="text-xs text-gray-400 mb-1">Referencia bíblica</Label>
              <Input
                value={dayForm.verse_reference}
                onChange={(e) => updateField('verse_reference', e.target.value)}
                className="border-gray-200 rounded-xl"
                placeholder="Génesis 1:1"
              />
            </div>
          </div>
        </div>

        {/* Reflection */}
        <div>
          <h3 className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-1.5">
            🔮 Historia / Reflexión
          </h3>
          <textarea
            value={dayForm.reflection_content}
            onChange={(e) => updateField('reflection_content', e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-pink-300 focus:outline-none resize-none bg-white"
            placeholder="Escribe la historia o reflexión para este día..."
          />
        </div>

        {/* Prayer */}
        <div className="bg-purple-50/70 rounded-2xl p-5 border border-purple-100/60">
          <h3 className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-1.5">
            🙏 Oración del día
          </h3>
          <textarea
            value={dayForm.prayer_content}
            onChange={(e) => updateField('prayer_content', e.target.value)}
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-pink-300 focus:outline-none resize-none bg-white"
            placeholder="Escribe la oración del día..."
          />
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 mb-3">👁️ Vista previa</h3>
          <div className="text-center mb-3">
            <p className="text-lg font-extrabold italic bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mt-2">
              {dayForm.title || 'Sin título'}
            </p>
          </div>
          <div className="bg-orange-50/60 rounded-xl p-3 mb-3">
            <p className="text-sm italic text-gray-700">&ldquo;{dayForm.verse_text}&rdquo;</p>
            <p className="text-xs font-bold text-pink-400 text-right mt-1">- {dayForm.verse_reference}</p>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
            {dayForm.reflection_content}
          </p>
        </div>

        {/* Save + Nav buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className={`rounded-full px-6 py-2.5 flex items-center gap-2 text-sm font-bold shadow-md ${
                saved
                  ? 'bg-green-400 hover:bg-green-500 text-white'
                  : 'bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white'
              }`}
            >
              {saved ? <HiCheck size={16} /> : <FiSave size={15} />}
              {isSaving ? 'Guardando...' : saved ? 'Guardado ✓' : 'Guardar cambios'}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => goToDay(day - 1)}
              disabled={day <= 1}
              variant="outline"
              className="rounded-full px-4 py-2.5 text-sm font-semibold border-gray-200 hover:bg-pink-50 disabled:opacity-40"
            >
              <HiArrowLeft size={14} /> Día anterior
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => goToDay(day + 1)}
              disabled={day >= daysInMonth}
              variant="outline"
              className="rounded-full px-4 py-2.5 text-sm font-semibold border-gray-200 hover:bg-pink-50 disabled:opacity-40"
            >
              Día siguiente <HiArrowRight size={14} />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push(`/admin/${monthId}`)}
              className="bg-purple-300 hover:bg-purple-400 text-white rounded-full px-5 py-2.5 text-sm font-semibold shadow-md"
            >
              📅 Volver al calendario
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
