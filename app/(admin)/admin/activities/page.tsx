'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HiArrowLeft } from 'react-icons/hi';
import { FiSave } from 'react-icons/fi';
import { HiXMark, HiCheck } from 'react-icons/hi2';

const monthsData = [
  { month: 'ENERO', emoji: '❄️', days: 31 },
  { month: 'FEBRERO', emoji: '❤️', days: 29 },
  { month: 'MARZO', emoji: '🌷', days: 31 },
  { month: 'ABRIL', emoji: '🌸', days: 30 },
  { month: 'MAYO', emoji: '🌼', days: 31 },
  { month: 'JUNIO', emoji: '🌻', days: 30 },
  { month: 'JULIO', emoji: '💧', days: 31 },
  { month: 'AGOSTO', emoji: '⭐', days: 31 },
  { month: 'SEPTIEMBRE', emoji: '📖', days: 30 },
  { month: 'OCTUBRE', emoji: '🍂', days: 31 },
  { month: 'NOVIEMBRE', emoji: '🕯️', days: 30 },
  { month: 'DICIEMBRE', emoji: '🎄', days: 31 },
];

interface DayLink {
  day: number;
  url: string;
  saved: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

export default function ActivitiesPage() {
  const [selectedMonth, setSelectedMonth] = useState<typeof monthsData[0] | null>(null);
  const [links, setLinks] = useState<DayLink[]>([]);
  const [savingDay, setSavingDay] = useState<number | null>(null);

  const handleSelectMonth = (month: typeof monthsData[0]) => {
    setSelectedMonth(month);
    // Generate all days for the month with empty URLs
    setLinks(
      Array.from({ length: month.days }, (_, i) => ({
        day: i + 1,
        url: '',
        saved: false,
      }))
    );
  };

  const handleBack = () => {
    setSelectedMonth(null);
    setLinks([]);
  };

  const handleUpdateUrl = (day: number, url: string) => {
    setLinks(links.map(l => (l.day === day ? { ...l, url, saved: false } : l)));
  };

  const handleSaveDay = async (day: number) => {
    setSavingDay(day);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLinks(links.map(l => (l.day === day ? { ...l, saved: true } : l)));
    setSavingDay(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {!selectedMonth ? (
          /* ── Month Selection View ── */
          <motion.div
            key="months"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            <div className="bg-orange-50/60 rounded-3xl border border-orange-100/60 p-6 sm:p-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-700 flex items-center gap-2">
                  <span>🌸</span>
                  Gestionar Enlaces para Actividades
                  <span>✨</span>
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                  Selecciona un mes y configura los enlaces de Google Drive para cada día 📁
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
              >
                {monthsData.map((item) => (
                  <motion.button
                    key={item.month}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleSelectMonth(item)}
                    className="bg-white rounded-full py-3 px-4 text-center shadow-sm hover:shadow-md border border-gray-100 hover:border-pink-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span className="text-xs sm:text-sm font-bold text-gray-600 tracking-wide">
                      {item.month}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* ── Day Cards Grid View ── */
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            {/* Back button + Title */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  className="rounded-full border-gray-200 hover:bg-pink-50 hover:border-pink-200"
                >
                  <HiArrowLeft size={16} />
                </Button>
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-600 flex items-center gap-2">
                <span>📅</span>
                Días de {selectedMonth.month}
              </h2>
            </div>

            {/* Days Grid */}
            <div className="bg-orange-50/60 rounded-3xl border border-orange-100/60 p-5 sm:p-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {links.map((link) => (
                  <motion.div
                    key={link.day}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-2xl p-5 border border-pink-100/60 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-pink-400 italic">
                        Día {link.day}
                      </h3>
                      {link.saved ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                          <HiCheck size={12} />
                          Configurado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">
                          <HiXMark size={12} />
                          Sin configurar
                        </span>
                      )}
                    </div>

                    {/* URL Input */}
                    <Input
                      value={link.url}
                      onChange={(e) => handleUpdateUrl(link.day, e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="border-gray-200 text-sm rounded-xl mb-3 focus:border-pink-300 bg-gray-50/50"
                    />

                    {/* Save Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        onClick={() => handleSaveDay(link.day)}
                        disabled={savingDay === link.day || !link.url.trim()}
                        className="w-full bg-blue-300 hover:bg-blue-400 text-white rounded-xl py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                      >
                        <FiSave size={14} />
                        {savingDay === link.day ? 'Guardando...' : 'Guardar Enlace'}
                      </Button>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
