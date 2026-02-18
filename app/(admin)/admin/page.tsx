'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAdminView } from '@/lib/admin-view-context';
import { useAdminStore } from '@/store/admin-store';

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
        className="mb-8"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2" style={{ color: '#333' }}>
          📝 Editar Contenido Devocional ✨
        </h2>
        <p className="text-sm mt-1" style={{ color: '#666', opacity: 0.8 }}>
          Selecciona un mes para editar los devocionales de cada día
        </p>
      </motion.div>

      {isLoadingMonths ? (
        <div className="flex justify-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }}
            style={{ width: 32, height: 32, borderWidth: 3, borderStyle: 'solid', borderColor: '#FFB6D9', borderTopColor: '#FF6B9D', borderRadius: '50%' }}
          />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
        >
          {months.map((item) => (
            <motion.button
              key={item.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05, y: -10, rotate: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push(`/admin/${item.id}`)}
              className="text-center cursor-pointer border-none relative overflow-hidden"
              style={{
                background: 'white',
                borderRadius: '22px',
                padding: '1.2rem 1rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              }}
            >
              <motion.div
                className="block mb-2"
                style={{ fontSize: '2rem' }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
              >
                {item.icon_name}
              </motion.div>
              <h3
                className="font-bold tracking-wide"
                style={{ fontSize: '0.8rem', color: '#333' }}
              >
                {item.name?.toUpperCase()}
              </h3>
              <p
                className="mt-1 font-medium"
                style={{ fontSize: '0.7rem', opacity: 0.8, color: '#666' }}
              >
                {item.theme}
              </p>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
