'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HiChevronRight } from 'react-icons/hi';
import { HiHome } from 'react-icons/hi2';
import { useUserView } from '@/lib/user-view-context';
import { useUserStore } from '@/store/user-store';

const DAYS_IN_MONTH: Record<string, number> = {
  Enero: 31, Febrero: 28, Marzo: 31, Abril: 30, Mayo: 31, Junio: 30,
  Julio: 31, Agosto: 31, Septiembre: 30, Octubre: 31, Noviembre: 30, Diciembre: 31,
};

const dayContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.15 } },
};
const dayCardVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' as const } },
};

export default function UserDaysPage() {
  const params = useParams();
  const router = useRouter();
  const monthId = Number(params.monthId);
  const { setIsFullScreen } = useUserView();
  const { months, fetchMonths, fetchDevotionals, getDevotional, isLoadingDevotionals } = useUserStore();

  const month = months.find((m) => m.id === monthId);

  useEffect(() => {
    setIsFullScreen(true);
    if (months.length === 0) fetchMonths();
    fetchDevotionals(monthId);
  }, [monthId, setIsFullScreen, fetchMonths, fetchDevotionals, months.length]);

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

  const daysInMonth = DAYS_IN_MONTH[month.name] ?? 30;

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
        <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
          <span>{month.icon_name}</span> {month.name}
        </span>
      </motion.div>

      {/* Month Title */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-400 flex items-center justify-center gap-2">
          <span>{month.icon_name}</span> {month.name} 2026
        </h2>
        <p className="text-sm text-gray-400 mt-1 italic">{month.theme}</p>
      </motion.div>

      {/* Days Grid */}
      {isLoadingDevotionals ? (
        <div className="flex justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }}
            className="w-8 h-8 border-3 border-pink-300 border-t-pink-500 rounded-full"
          />
        </div>
      ) : (
        <motion.div
          variants={dayContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 sm:gap-3 mb-8"
        >
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dev = getDevotional(monthId, day);
            const hasContent = !!dev?.title;
            return (
              <motion.div
                key={day}
                variants={dayCardVariants}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/dashboard/${monthId}/${day}`)}
                className="relative rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer border bg-blue-50/50 border-blue-100/50 shadow-sm hover:shadow-md transition-all"
              >
                <p className="text-lg sm:text-2xl font-extrabold text-gray-700 mb-1">{day}</p>
                {hasContent && <span className="text-xs text-green-400">📖</span>}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-300 hover:bg-blue-400 text-white rounded-full px-6 py-2.5 flex items-center gap-2 shadow-md text-sm font-semibold"
          >
            <HiHome size={16} /> Página principal
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
