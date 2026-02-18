'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAdminView } from '@/lib/admin-view-context';
import { useAdminStore } from '@/store/admin-store';

/* ── Helpers ── */
const MONTH_COLORS: Record<string, string> = {
  '#E3F2FD': 'from-blue-100 to-blue-50',
  '#FFE4F0': 'from-pink-100 to-pink-50',
  '#FFE4E9': 'from-rose-100 to-rose-50',
  '#F3E5F5': 'from-purple-100 to-purple-50',
  '#FFF8E1': 'from-amber-100 to-amber-50',
  '#FFF9C4': 'from-yellow-100 to-yellow-50',
  '#E1F5FE': 'from-sky-100 to-sky-50',
  '#FFF3E0': 'from-orange-100 to-orange-50',
  '#F8BBD0': 'from-pink-200 to-pink-100',
  '#FFE0B2': 'from-orange-200 to-orange-100',
  '#F1E4F3': 'from-violet-100 to-violet-50',
  '#E8F5E9': 'from-green-100 to-green-50',
};

function getGradient(hex: string | null) {
  return MONTH_COLORS[hex ?? ''] ?? 'from-gray-100 to-gray-50';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function AdminMonthsPage() {
  const router = useRouter();
  const { setIsFullScreen } = useAdminView();
  const { months, isLoadingMonths, fetchMonths } = useAdminStore();

  useEffect(() => {
    setIsFullScreen(false);
    fetchMonths();
  }, [fetchMonths, setIsFullScreen]);

  return (
    <div>
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

      {isLoadingMonths ? (
        <div className="flex justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }}
            className="w-8 h-8 border-3 border-pink-300 border-t-pink-500 rounded-full"
          />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5"
        >
          {months.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/admin/${item.id}`)}
              className={`bg-gradient-to-br ${getGradient(item.color_hex)} rounded-2xl p-5 sm:p-7 text-center cursor-pointer border border-white/60 shadow-sm hover:shadow-xl transition-shadow`}
            >
              <motion.div
                className="text-3xl sm:text-4xl mb-3"
                whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
              >
                {item.icon_name}
              </motion.div>
              <h3 className="text-xs sm:text-sm font-extrabold text-gray-700 tracking-wide">
                {item.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1 italic">{item.theme}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
