'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HiChevronRight } from 'react-icons/hi';
import { HiArrowRight } from 'react-icons/hi2';
import { useUserView } from '@/lib/user-view-context';
import { useUserStore } from '@/store/user-store';

const DAYS_IN_MONTH: Record<string, number> = {
  Enero: 31, Febrero: 28, Marzo: 31, Abril: 30, Mayo: 31, Junio: 30,
  Julio: 31, Agosto: 31, Septiembre: 30, Octubre: 31, Noviembre: 30, Diciembre: 31,
};

export default function UserDayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const monthId = Number(params.monthId);
  const day = Number(params.day);
  const { setIsFullScreen } = useUserView();
  const { months, fetchMonths, fetchDevotionals, getDevotional, fetchActivity, activityUrl } = useUserStore();

  const month = months.find((m) => m.id === monthId);
  const devotional = getDevotional(monthId, day);
  const daysInMonth = month ? (DAYS_IN_MONTH[month.name] ?? 30) : 30;

  useEffect(() => {
    setIsFullScreen(true);
    if (months.length === 0) fetchMonths();
    fetchDevotionals(monthId);
    fetchActivity(monthId, day);
  }, [monthId, day, setIsFullScreen, fetchMonths, fetchDevotionals, fetchActivity, months.length]);

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
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-pink-500 transition-colors cursor-pointer"
        >
          <span>🏠</span> Inicio
        </button>
        <HiChevronRight className="text-gray-300" size={16} />
        <button
          onClick={() => router.push(`/dashboard/${monthId}`)}
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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="bg-white rounded-3xl p-8 sm:p-10 text-center mb-6 border border-gray-100 shadow-sm"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
          {day} de {month.name.toLowerCase()}
        </h2>
        <motion.div
          className="text-5xl sm:text-6xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          {month.icon_name}
        </motion.div>
        <h3 className="text-2xl sm:text-3xl font-extrabold italic bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          {devotional?.title ?? 'Devocional del día'}
        </h3>
        <div className="mt-6 border-t-2 border-dashed border-pink-200" />
      </motion.div>

      {/* Verse */}
      {devotional?.verse_text && (
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
            &ldquo;{devotional.verse_text}&rdquo;
          </p>
          <p className="text-right text-sm font-bold text-pink-400 italic">
            - {devotional.verse_reference}
          </p>
        </motion.div>
      )}

      {/* Reflection */}
      {devotional?.reflection_content && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mb-6"
        >
          <h3 className="text-xl sm:text-2xl font-extrabold italic text-pink-400 flex items-center gap-2 mb-3">
            <span>🔮</span> Para ti:
          </h3>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
            {devotional.reflection_content}
          </p>
        </motion.div>
      )}

      {/* Prayer */}
      {devotional?.prayer_content && (
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
            {devotional.prayer_content}
          </p>
        </motion.div>
      )}

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
          className="bg-green-300 hover:bg-green-400 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-md transition-all"
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
          whileHover={activityUrl ? { scale: 1.05, y: -3 } : {}}
          whileTap={activityUrl ? { scale: 0.95 } : {}}
          onClick={() => {
            if (activityUrl) window.open(activityUrl, '_blank');
          }}
          className={`rounded-2xl p-5 sm:p-6 text-center shadow-md transition-all ${
            activityUrl
              ? 'bg-blue-300 hover:bg-blue-400 cursor-pointer'
              : 'bg-gray-200 cursor-not-allowed opacity-50'
          }`}
        >
          <div className="text-3xl sm:text-4xl mb-2">🎨</div>
          <p className={`text-xs sm:text-sm font-bold ${activityUrl ? 'text-white' : 'text-gray-400'}`}>
            {activityUrl ? 'Actividades' : 'Sin actividad'}
          </p>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push(`/dashboard/${monthId}`)}
            className="bg-purple-300 hover:bg-purple-400 text-white rounded-full px-5 py-2.5 flex items-center gap-2 shadow-md text-sm font-semibold"
          >
            📅 Volver al calendario
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-purple-300 hover:bg-purple-400 text-white rounded-full px-5 py-2.5 flex items-center gap-2 shadow-md text-sm font-semibold"
          >
            🏠 Página principal
          </Button>
        </motion.div>

        {day < daysInMonth && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push(`/dashboard/${monthId}/${day + 1}`)}
              className="bg-purple-300 hover:bg-purple-400 text-white rounded-full px-5 py-2.5 flex items-center gap-2 shadow-md text-sm font-semibold"
            >
              Día siguiente <HiArrowRight size={14} />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
