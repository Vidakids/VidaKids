'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HiChevronRight, HiCheck } from 'react-icons/hi';
import { HiHome, HiArrowRight } from 'react-icons/hi2';
import {
  MONTHS,
  MONTH_NAMES_LOWER,
  getDayData,
  getMonthPhrase,
  type MonthData,
} from '@/lib/devotional-data';

/* ── Animation variants ── */
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
  visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.15 } },
};
const dayCardVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' as const } },
};

type ViewState = 'months' | 'days' | 'detail';

export default function UserDashboard() {
  const [view, setView] = useState<ViewState>('months');
  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());

  const getKey = (month: string, day: number) => `${month}-${day}`;
  const isCompleted = (month: string, day: number) => completedDays.has(getKey(month, day));

  const goToMonths = () => { setView('months'); setSelectedMonth(null); };
  const goToDays = (month: MonthData) => { setSelectedMonth(month); setView('days'); };
  const goToDay = (day: number) => { setSelectedDay(day); setView('detail'); };
  const backToDays = () => setView('days');

  const toggleComplete = () => {
    if (!selectedMonth) return;
    const key = getKey(selectedMonth.month, selectedDay);
    const next = new Set(completedDays);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setCompletedDays(next);
  };

  const nextDay = () => {
    if (selectedMonth && selectedDay < selectedMonth.days) {
      setSelectedDay(selectedDay + 1);
    }
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
      {view === 'detail' && (
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: -15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {MONTHS.map((item) => (
            <motion.div
              key={item.month}
              variants={cardVariants}
              whileHover={{ scale: 1.04, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => goToDays(item)}
              className={`${item.color} rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center cursor-pointer border border-white/50 shadow-sm hover:shadow-lg transition-shadow`}
            >
              <motion.div
                className="text-4xl sm:text-5xl mb-4"
                whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.4 }}
              >
                {item.emoji}
              </motion.div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-700 tracking-wide mb-1">
                {item.month}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 italic">{getMonthPhrase(item.month)}</p>
            </motion.div>
          ))}
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-400 flex items-center justify-center gap-2">
              <span>{selectedMonth.emoji}</span> {selectedMonth.month} 2026
            </h2>
            <p className="text-sm text-gray-400 mt-1 italic">{getMonthPhrase(selectedMonth.month)}</p>
          </motion.div>

          <motion.div
            variants={dayContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 sm:gap-3 mb-8"
          >
            {Array.from({ length: selectedMonth.days }, (_, i) => i + 1).map((day) => {
              const done = isCompleted(selectedMonth.month, day);
              const data = getDayData(selectedMonth.month, day);
              return (
                <motion.div
                  key={day}
                  variants={dayCardVariants}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToDay(day)}
                  className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer border transition-all ${
                    done
                      ? 'bg-green-50 border-green-300 shadow-md shadow-green-100/50'
                      : 'bg-blue-50/50 border-blue-100/50 shadow-sm hover:shadow-md'
                  }`}
                >
                  {done && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5"
                    >
                      <div className="w-5 h-5 bg-green-400 rounded-md flex items-center justify-center">
                        <HiCheck className="text-white" size={12} />
                      </div>
                    </motion.div>
                  )}
                  <p className="text-lg sm:text-2xl font-extrabold text-gray-700 mb-1">{day}</p>
                  <span className="text-lg sm:text-xl">{data.emoji}</span>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={goToMonths}
                className="bg-blue-300 hover:bg-blue-400 text-white rounded-full px-6 py-2.5 flex items-center gap-2 shadow-md text-sm font-semibold"
              >
                <HiHome size={16} /> Página principal
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* ═══════════════ DAY DETAIL ═══════════════ */}
      {view === 'detail' && selectedMonth && (() => {
        const dayData = getDayData(selectedMonth.month, selectedDay);
        return (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            {breadcrumb}

            {/* Day Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-white rounded-3xl p-8 sm:p-10 text-center mb-6 border border-gray-100 shadow-sm"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
                {selectedDay} de {MONTH_NAMES_LOWER[selectedMonth.month]}
              </h2>
              <motion.div
                className="text-5xl sm:text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                {dayData.emoji}
              </motion.div>
              <h3 className="text-2xl sm:text-3xl font-extrabold italic bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {dayData.theme} {dayData.emoji}
              </h3>
              <div className="mt-6 border-t-2 border-dashed border-pink-200" />
            </motion.div>

            {/* Versículo del día */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-6 sm:p-8 mb-6 border border-orange-100/60"
            >
              <p className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-1.5">
                <span>📖</span> Versículo del día:
              </p>
              <p className="text-base sm:text-lg font-semibold text-gray-700 italic leading-relaxed mb-4">
                &ldquo;{dayData.verseText}&rdquo;
              </p>
              <p className="text-right text-sm font-bold text-pink-400 italic">
                - {dayData.verseRef}
              </p>
            </motion.div>

            {/* Para ti */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mb-6"
            >
              <h3 className="text-xl sm:text-2xl font-extrabold italic text-pink-400 flex items-center gap-2 mb-3">
                <span>🔮</span> Para ti:
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                ✨ {dayData.devotional}
              </p>
            </motion.div>

            {/* Oración del día */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-purple-50/70 rounded-3xl p-6 sm:p-8 mb-8 border border-purple-100/60"
            >
              <h3 className="text-xl sm:text-2xl font-extrabold italic text-purple-400 flex items-center gap-2 mb-3">
                <span>🙏</span> Oración del día:
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {dayData.prayer}
              </p>
            </motion.div>

            {/* Action Cards */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 mb-6"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleComplete}
                className={`rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all ${
                  isCompleted(selectedMonth.month, selectedDay)
                    ? 'bg-green-400 shadow-lg shadow-green-200/50'
                    : 'bg-green-300 hover:bg-green-400 shadow-md'
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2">✅</div>
                <p className="text-xs sm:text-sm font-bold text-white">Completado</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-300 hover:bg-pink-400 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-md transition-all"
              >
                <div className="text-3xl sm:text-4xl mb-2">📖</div>
                <p className="text-xs sm:text-sm font-bold text-white">Lee la historia</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-300 hover:bg-blue-400 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-md transition-all"
              >
                <div className="text-3xl sm:text-4xl mb-2">🎨</div>
                <p className="text-xs sm:text-sm font-bold text-white">Actividades</p>
              </motion.div>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={backToDays}
                  className="bg-purple-300 hover:bg-purple-400 text-white rounded-full px-5 py-2.5 flex items-center gap-2 shadow-md text-sm font-semibold"
                >
                  📅 Volver al calendario
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={goToMonths}
                  className="bg-purple-300 hover:bg-purple-400 text-white rounded-full px-5 py-2.5 flex items-center gap-2 shadow-md text-sm font-semibold"
                >
                  🏠 Página principal
                </Button>
              </motion.div>

              {selectedDay < selectedMonth.days && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={nextDay}
                    className="bg-purple-300 hover:bg-purple-400 text-white rounded-full px-5 py-2.5 flex items-center gap-2 shadow-md text-sm font-semibold"
                  >
                    Día siguiente <HiArrowRight size={14} />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        );
      })()}
    </AnimatePresence>
  );
}
