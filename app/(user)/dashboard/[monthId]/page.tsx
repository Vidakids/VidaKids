'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiChevronRight, HiHome } from 'react-icons/hi2';
import { useUserView } from '@/lib/user-view-context';
import { useUserStore } from '@/store/user-store';

const DAYS_IN_MONTH: Record<string, number> = {
  Enero: 31, Febrero: 28, Marzo: 31, Abril: 30, Mayo: 31, Junio: 30,
  Julio: 31, Agosto: 31, Septiembre: 30, Octubre: 31, Noviembre: 30, Diciembre: 31,
};

const allIllustrations = [
  "💕", "⭐", "🌸", "🙏", "🌈", "🦋", "🌻", "🌙", "💐", "☀️", "💖", "💫"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export default function UserDaysPage() {
  const params = useParams();
  const router = useRouter();
  const monthId = Number(params.monthId);
  const { setIsFullScreen } = useUserView();
  const { months, fetchMonths, fetchDevotionals } = useUserStore();

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
          className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  const daysInMonth = DAYS_IN_MONTH[month.name] ?? 30;
  const currentYear = 2026; // Hardcoded as per image "ENERO 2026"

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb Navigation - Top Bar Style */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-full px-6 py-3 mb-8 shadow-sm flex items-center gap-3 w-fit"
      >
         <button 
           onClick={() => router.push('/dashboard')}
           className="flex items-center gap-2 text-gray-600 font-bold hover:text-pink-500 transition-colors"
         >
            <HiHome size={20} className="text-orange-400" />
            <span>Inicio</span>
         </button>

         <HiChevronRight className="text-gray-300" />

         <div className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-extrabold flex items-center gap-2">
            <span>{month.icon_name}</span>
            <span>{month.name.toUpperCase()}</span>
         </div>
      </motion.div>

      {/* Page Title & Theme */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl sm:text-4xl font-black text-pink-300 drop-shadow-sm flex items-center justify-center gap-3 mb-2">
            <span>{month.icon_name}</span>
            <span>{month.name.toUpperCase()} {currentYear}</span>
        </h1>
        <p className="text-gray-500 font-medium text-lg">{month.theme}</p>
      </motion.div>

      {/* Days Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-12"
      >
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
           // We map the array repeatedly: illustration = array[(day - 1) % length]
           const illustration = allIllustrations[(day - 1) % allIllustrations.length];
           
           // Placeholder logic for specific styling as per image
           // e.g., Day 1 is 'completed' (Green), other days are default (Blue)
           // In real app, check `readDays.includes(day)`
           const isCompleted = false; // logic to be implemented later 
           
           return (
             <motion.div
               key={day}
               variants={itemVariants}
               whileHover={{ y: -5, scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => router.push(`/dashboard/${monthId}/${day}`)}
               className={`
                  relative aspect-[4/5] sm:aspect-square flex flex-col items-center justify-center cursor-pointer transition-all
                  ${isCompleted 
                      ? 'bg-green-100 border-2 border-green-400 shadow-green-200' 
                      : 'bg-gradient-to-b from-blue-50 to-blue-100 hover:from-white hover:to-blue-50 shadow-sm hover:shadow-md'
                  }
               `}
               style={{ borderRadius: '25px' }}
             >
                {/* Checkmark for completed */}
                {isCompleted && (
                    <div className="absolute top-3 right-3 text-green-500">
                        <svg className="w-5 h-5 bg-white rounded-full p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}

                <span className={`text-2xl sm:text-3xl font-black mb-2 ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                    {day}
                </span>
                <span className="text-xl sm:text-2xl filter drop-shadow-sm">
                    {illustration}
                </span>
             </motion.div>
           );
        })}
      </motion.div>

      {/* Bottom Action Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center pb-10"
      >
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 bg-blue-200 hover:bg-blue-300 text-blue-700 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-1"
          >
             <span>🏠</span> Página principal
          </button>
      </motion.div>

    </div>
  );
}
