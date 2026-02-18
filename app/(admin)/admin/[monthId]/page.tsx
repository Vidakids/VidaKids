'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HiChevronRight } from 'react-icons/hi';
import { FiSave } from 'react-icons/fi';
import { useAdminView } from '@/lib/admin-view-context';
import { useAdminStore } from '@/store/admin-store';

const DAYS_IN_MONTH: Record<string, number> = {
  Enero: 31, Febrero: 28, Marzo: 31, Abril: 30, Mayo: 31, Junio: 30,
  Julio: 31, Agosto: 31, Septiembre: 30, Octubre: 31, Noviembre: 30, Diciembre: 31,
};

const dayContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.1 } },
};
const dayCardVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' as const } },
};

export default function AdminDaysPage() {
  const params = useParams();
  const router = useRouter();
  const monthId = Number(params.monthId);
  const { setIsFullScreen } = useAdminView();
  const {
    months, isLoadingDevotionals,
    fetchMonths, fetchDevotionals, getDevotional, updateMonth,
  } = useAdminStore();

  const month = useMemo(() => months.find((m) => m.id === monthId), [months, monthId]);
  const [themeValue, setThemeValue] = useState(month?.theme ?? '');

  useEffect(() => {
    setIsFullScreen(true);
    if (months.length === 0) fetchMonths();
    fetchDevotionals(monthId);
  }, [monthId, setIsFullScreen, fetchMonths, fetchDevotionals, months.length]);

  // Sync theme when month data arrives
  const monthTheme = month?.theme ?? '';
  useEffect(() => {
    setThemeValue(monthTheme);
  }, [monthTheme]);

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
          onClick={() => router.push('/admin')}
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
        transition={{ delay: 0.12 }}
        className="text-center mb-4"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-pink-400 flex items-center justify-center gap-2">
          <span>{month.icon_name}</span> {month.name} 2026
        </h2>
      </motion.div>

      {/* Editable theme */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="flex items-center gap-2 justify-center mb-8"
      >
        <Label className="text-sm text-gray-400">Tema del mes:</Label>
        <Input
          value={themeValue}
          onChange={(e) => setThemeValue(e.target.value)}
          className="max-w-xs text-center text-sm border-gray-200 rounded-xl"
          placeholder="Tema del mes..."
        />
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            size="sm"
            onClick={() => updateMonth(monthId, { theme: themeValue })}
            className="bg-pink-400 hover:bg-pink-500 text-white rounded-full text-xs px-3"
          >
            <FiSave size={12} />
          </Button>
        </motion.div>
      </motion.div>

      {/* Days grid */}
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
          className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-2.5 mb-6"
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
                onClick={() => router.push(`/admin/${monthId}/${day}`)}
                className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer border shadow-sm hover:shadow-md hover:border-pink-200 transition-all ${
                  hasContent
                    ? 'bg-green-50/50 border-green-200/50'
                    : 'bg-blue-50/50 border-blue-100/50'
                }`}
              >
                <p className="text-lg sm:text-xl font-extrabold text-gray-700 mb-0.5">{day}</p>
                {hasContent && <span className="text-xs text-green-400">✓</span>}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <div className="flex justify-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/admin')}
            className="bg-blue-300 hover:bg-blue-400 text-white rounded-full px-5 py-2 text-sm font-semibold shadow-md"
          >
            🏠 Volver a meses
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
