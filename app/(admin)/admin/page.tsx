'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HiChevronRight, HiCheck } from 'react-icons/hi';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2';
import { FiSave } from 'react-icons/fi';
import {
  MONTHS,
  MONTH_NAMES_LOWER,
  getDayData,
  saveDayData,
  getMonthPhrase,
  saveMonthPhrase,
  type DayData,
  type MonthData,
} from '@/lib/devotional-data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};
const dayContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.1 } },
};
const dayCardVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' as const } },
};

type ViewState = 'months' | 'days' | 'editor';

export default function AdminDashboard() {
  const [view, setView] = useState<ViewState>('months');
  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [dayForm, setDayForm] = useState<DayData>({
    emoji: '', theme: '', verseText: '', verseRef: '', devotional: '', prayer: '',
  });
  const [monthPhrase, setMonthPhrase] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadDayForm = useCallback((month: string, day: number) => {
    setDayForm(getDayData(month, day));
  }, []);

  const goToMonths = () => { setView('months'); setSelectedMonth(null); };

  const goToDays = (month: MonthData) => {
    setSelectedMonth(month);
    setMonthPhrase(getMonthPhrase(month.month));
    setView('days');
  };

  const goToEditor = (day: number) => {
    if (!selectedMonth) return;
    setSelectedDay(day);
    loadDayForm(selectedMonth.month, day);
    setSaved(false);
    setView('editor');
  };

  const backToDays = () => { setView('days'); setSaved(false); };

  const handleSave = async () => {
    if (!selectedMonth) return;
    setIsSaving(true);
    // Simulate small delay for UX
    await new Promise(r => setTimeout(r, 400));
    saveDayData(selectedMonth.month, selectedDay, dayForm);
    saveMonthPhrase(selectedMonth.month, monthPhrase);
    setIsSaving(false);
    setSaved(true);
  };

  const handlePrevDay = () => {
    if (!selectedMonth || selectedDay <= 1) return;
    const prev = selectedDay - 1;
    setSelectedDay(prev);
    loadDayForm(selectedMonth.month, prev);
    setSaved(false);
  };

  const handleNextDay = () => {
    if (!selectedMonth || selectedDay >= selectedMonth.days) return;
    const next = selectedDay + 1;
    setSelectedDay(next);
    loadDayForm(selectedMonth.month, next);
    setSaved(false);
  };



  /* ── Field updater ── */
  const updateField = (field: keyof DayData, value: string) => {
    setDayForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  /* ── Breadcrumb ── */
  const breadcrumb = (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-full px-5 py-3 mb-6 flex items-center gap-2 shadow-sm border border-gray-100 w-fit"
    >
      <button
        onClick={goToMonths}
        className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors cursor-pointer"
      >
        <span>🏠</span> Inicio
      </button>
      {selectedMonth && (
        <>
          <HiChevronRight className="text-gray-300" size={16} />
          <button
            onClick={backToDays}
            className="flex items-center gap-1.5 text-sm font-bold text-gray-500 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <span>{selectedMonth.emoji}</span> {selectedMonth.month}
          </button>
        </>
      )}
      {view === 'editor' && (
        <>
          <HiChevronRight className="text-gray-300" size={16} />
          <span className="text-sm font-bold text-white bg-pink-400 px-3.5 py-1 rounded-full">
            Día {selectedDay}
          </span>
        </>
      )}
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {/* ═══════════════ MONTH GRID ═══════════════ */}
      {view === 'months' && (
        <motion.div
          key="months"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-700 flex items-center gap-2">
              <span>📝</span> Editar Contenido Devocional <span>✨</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Selecciona un mes para editar los devocionales de cada día
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5"
          >
            {MONTHS.map((item) => (
              <motion.div
                key={item.month}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => goToDays(item)}
                className={`bg-gradient-to-br ${item.color} rounded-2xl p-5 sm:p-7 text-center cursor-pointer border border-white/60 shadow-sm hover:shadow-xl transition-shadow`}
              >
                <motion.div
                  className="text-3xl sm:text-4xl mb-3"
                  whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                >
                  {item.emoji}
                </motion.div>
                <h3 className="text-xs sm:text-sm font-extrabold text-gray-700 tracking-wide">
                  {item.month}
                </h3>
                <p className="text-xs text-gray-400 mt-1 italic">{getMonthPhrase(item.month)}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* ═══════════════ DAYS GRID ═══════════════ */}
      {view === 'days' && selectedMonth && (
        <motion.div
          key="days"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
        >
          {breadcrumb}

          {/* Month Title + Phrase Editor */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-center mb-4"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-400 flex items-center justify-center gap-2">
              <span>{selectedMonth.emoji}</span> {selectedMonth.month} 2026
            </h2>
          </motion.div>

          {/* Editable month phrase */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex items-center gap-2 justify-center mb-8"
          >
            <Label className="text-sm text-gray-400">Frase del mes:</Label>
            <Input
              value={monthPhrase}
              onChange={(e) => setMonthPhrase(e.target.value)}
              className="max-w-xs text-center text-sm border-gray-200 rounded-xl"
              placeholder="Frase del mes..."
            />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="sm"
                onClick={() => { saveMonthPhrase(selectedMonth.month, monthPhrase); }}
                className="bg-pink-400 hover:bg-pink-500 text-white rounded-full text-xs px-3"
              >
                <FiSave size={12} />
              </Button>
            </motion.div>
          </motion.div>

          {/* Days grid */}
          <motion.div
            variants={dayContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-2.5 mb-6"
          >
            {Array.from({ length: selectedMonth.days }, (_, i) => i + 1).map((day) => {
              const data = getDayData(selectedMonth.month, day);
              return (
                <motion.div
                  key={day}
                  variants={dayCardVariants}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToEditor(day)}
                  className="relative rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer border bg-blue-50/50 border-blue-100/50 shadow-sm hover:shadow-md hover:border-pink-200 transition-all"
                >
                  <p className="text-lg sm:text-xl font-extrabold text-gray-700 mb-0.5">{day}</p>
                  <span className="text-base sm:text-lg">{data.emoji}</span>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={goToMonths}
                className="bg-blue-300 hover:bg-blue-400 text-white rounded-full px-5 py-2 text-sm font-semibold shadow-md"
              >
                🏠 Volver a meses
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ═══════════════ DAY EDITOR ═══════════════ */}
      {view === 'editor' && selectedMonth && (
        <motion.div
          key="editor"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
        >
          {breadcrumb}

          {/* Day Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-400">
              {selectedMonth.emoji} {selectedDay} de {MONTH_NAMES_LOWER[selectedMonth.month]}
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
            {/* Emoji + Theme row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                  😊 Emoji del día
                </Label>
                <Input
                  value={dayForm.emoji}
                  onChange={(e) => updateField('emoji', e.target.value)}
                  className="border-gray-200 rounded-xl"
                  placeholder="❤️"
                />
              </div>
              <div>
                <Label className="text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1">
                  ✨ Tema del día
                </Label>
                <Input
                  value={dayForm.theme}
                  onChange={(e) => updateField('theme', e.target.value)}
                  className="border-gray-200 rounded-xl"
                  placeholder="Amor"
                />
              </div>
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
                    value={dayForm.verseText}
                    onChange={(e) => updateField('verseText', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-pink-300 focus:outline-none resize-none bg-white"
                    placeholder="En el principio creó Dios los cielos y la tierra."
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-400 mb-1">Referencia bíblica</Label>
                  <Input
                    value={dayForm.verseRef}
                    onChange={(e) => updateField('verseRef', e.target.value)}
                    className="border-gray-200 rounded-xl"
                    placeholder="Génesis 1:1"
                  />
                </div>
              </div>
            </div>

            {/* Devotional */}
            <div>
              <h3 className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-1.5">
                🔮 Para ti (Mensaje devocional)
              </h3>
              <textarea
                value={dayForm.devotional}
                onChange={(e) => updateField('devotional', e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-pink-300 focus:outline-none resize-none bg-white"
                placeholder="Escribe el mensaje devocional para este día..."
              />
            </div>

            {/* Prayer */}
            <div className="bg-purple-50/70 rounded-2xl p-5 border border-purple-100/60">
              <h3 className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-1.5">
                🙏 Oración del día
              </h3>
              <textarea
                value={dayForm.prayer}
                onChange={(e) => updateField('prayer', e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:border-pink-300 focus:outline-none resize-none bg-white"
                placeholder="Escribe la oración del día..."
              />
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 mb-3">👁️ Vista previa</h3>
              <div className="text-center mb-3">
                <span className="text-4xl">{dayForm.emoji}</span>
                <p className="text-lg font-extrabold italic bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mt-2">
                  {dayForm.theme} {dayForm.emoji}
                </p>
              </div>
              <div className="bg-orange-50/60 rounded-xl p-3 mb-3">
                <p className="text-sm italic text-gray-700">&ldquo;{dayForm.verseText}&rdquo;</p>
                <p className="text-xs font-bold text-pink-400 text-right mt-1">- {dayForm.verseRef}</p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">✨ {dayForm.devotional}</p>
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
                  onClick={handlePrevDay}
                  disabled={selectedDay <= 1}
                  variant="outline"
                  className="rounded-full px-4 py-2.5 text-sm font-semibold border-gray-200 hover:bg-pink-50 disabled:opacity-40"
                >
                  <HiArrowLeft size={14} /> Día anterior
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleNextDay}
                  disabled={selectedDay >= selectedMonth.days}
                  variant="outline"
                  className="rounded-full px-4 py-2.5 text-sm font-semibold border-gray-200 hover:bg-pink-50 disabled:opacity-40"
                >
                  Día siguiente <HiArrowRight size={14} />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={backToDays}
                  className="bg-purple-300 hover:bg-purple-400 text-white rounded-full px-5 py-2.5 text-sm font-semibold shadow-md"
                >
                  📅 Volver al calendario
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
