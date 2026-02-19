'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HiChevronRight, HiX } from 'react-icons/hi';
import { HiArrowRight, HiHome, HiBookOpen } from 'react-icons/hi2';
import { useUserView } from '@/lib/user-view-context';
import { useUserStore } from '@/store/user-store';
import CompleteButton from '@/components/devotional/complete-button';

const DAYS_IN_MONTH: Record<string, number> = {
  Enero: 31, Febrero: 28, Marzo: 31, Abril: 30, Mayo: 31, Junio: 30,
  Julio: 31, Agosto: 31, Septiembre: 30, Octubre: 31, Noviembre: 30, Diciembre: 31,
};

interface UserDayDetailViewProps {
  monthId: number;
  day: number;
  initialIsCompleted: boolean;
}

export default function UserDayDetailView({ 
  monthId, 
  day, 
  initialIsCompleted 
}: UserDayDetailViewProps) {
  const router = useRouter();
  const { setIsFullScreen } = useUserView();
  const { 
    months, 
    fetchMonths, 
    fetchDevotionals, 
    getDevotional, 
    fetchActivity, 
    activityUrl,
  } = useUserStore();
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  // Intentamos obtener datos del store (client-side cache)
  // Si quisiéramos ser 100% server components, esto también vendría por props.
  const month = months.find((m) => m.id === monthId);
  const devotional = getDevotional(monthId, day);
  const daysInMonth = month ? (DAYS_IN_MONTH[month.name] ?? 30) : 30;

  useEffect(() => {
    setIsFullScreen(true);
    if (months.length === 0) fetchMonths();
    fetchDevotionals(monthId);
    fetchActivity(monthId, day);
    // Ya no hacemos fetchProgress aquí porque viene del server
  }, [monthId, day, setIsFullScreen, fetchMonths, fetchDevotionals, fetchActivity, months.length]);

  if (!month) {
    return (
      <div className="flex justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-3 border-pink-300 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-full px-4 py-2 mb-6 flex items-center gap-2 shadow-sm border border-gray-100 w-fit"
      >
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-pink-500 transition-colors"
        >
          <HiHome size={16} />
        </button>
        <HiChevronRight className="text-gray-300" size={14} />
        <button
          onClick={() => router.push(`/dashboard/${monthId}`)}
          className="text-sm font-semibold text-gray-500 hover:text-pink-500 transition-colors"
        >
          {month.name}
        </button>
        <HiChevronRight className="text-gray-300" size={14} />
        <span className="text-sm font-bold text-pink-500 bg-pink-50 px-3 py-0.5 rounded-full">
          Día {day}
        </span>
      </motion.div>

      {/* Header Card (45px radius) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ borderRadius: '45px', background: 'white' }}
        className="p-8 sm:p-10 text-center mb-6 shadow-sm border border-gray-100 relative overflow-hidden"
      >
         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300" />
         
        <h2 className="text-lg sm:text-xl font-bold text-gray-400 mb-2 uppercase tracking-wide">
          {day} de {month.name}
        </h2>
        
        <h3 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-4 leading-tight">
          {devotional?.title ?? 'Devocional del día'}
        </h3>
        
        <div className="flex justify-center gap-4 text-4xl sm:text-5xl my-4">
             <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
             >
                {month.icon_name}
             </motion.div>
        </div>
      </motion.div>

      {/* Verse Section (30px radius) */}
      {devotional?.verse_text && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ borderRadius: '30px' }}
          className="bg-orange-50 p-6 sm:p-8 mb-6 border border-orange-100"
        >
          <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            📖 Versículo Clave
          </p>
          <p className="text-lg sm:text-xl font-serif text-gray-700 italic leading-relaxed mb-4 text-center">
            &ldquo;{devotional.verse_text}&rdquo;
          </p>
          <p className="text-center text-sm font-bold text-gray-500">
            — {devotional.verse_reference}
          </p>
        </motion.div>
      )}

      {/* Reflection */}
      {devotional?.reflection_content && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8 px-2"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            💡 Para pensar...
          </h3>
          <p className="text-base text-gray-600 leading-relaxed whitespace-pre-line">
            {devotional.reflection_content}
          </p>
        </motion.div>
      )}

      {/* Prayer Section (30px radius) */}
      {devotional?.prayer_content && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ borderRadius: '30px' }}
          className="bg-purple-50 p-6 sm:p-8 mb-8 border border-purple-100"
        >
          <h3 className="text-lg font-bold text-purple-500 mb-3 flex items-center gap-2">
            🙏 Oremos juntos
          </h3>
          <p className="text-base text-gray-700 leading-relaxed italic">
            {devotional.prayer_content}
          </p>
        </motion.div>
      )}

      {/* Action Buttons (30px radius) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8"
      >
        {/* 1. Completado (Green) - Server Action Component */}
        <CompleteButton 
          monthId={monthId} 
          dayNumber={day} 
          initialIsCompleted={initialIsCompleted} 
        />

        {/* 2. Lee la historia (Pink) */}
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsStoryOpen(true)}
            style={{ borderRadius: '30px' }}
            className="p-6 min-h-[140px] bg-pink-300 hover:bg-pink-400 text-white shadow-lg shadow-pink-200 flex flex-col items-center justify-center gap-3"
        >
            <div className="p-4 rounded-xl bg-white/20">
                <HiBookOpen size={32} />
            </div>
            <span className="font-bold text-lg">Lee la historia</span>
        </motion.button>

        <motion.button
            whileHover={activityUrl ? { scale: 1.02 } : {}}
            whileTap={activityUrl ? { scale: 0.98 } : {}}
            onClick={() => {
                if (activityUrl) window.open(activityUrl, '_blank');
            }}
            disabled={!activityUrl}
            style={{ borderRadius: '30px' }}
            className={`p-4 font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${
                activityUrl 
                ? 'bg-blue-400 hover:bg-blue-500 text-white shadow-blue-200' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
            🎨 {activityUrl ? 'Ver Actividad' : 'Sin Actividad'}
        </motion.button>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
            onClick={() => router.push(`/dashboard/${monthId}`)}
            className="bg-gray-800 text-white rounded-full text-xs px-4 py-2 sm:text-base sm:px-6 sm:py-2"
        >
            ← Volver al calendario
        </Button>
        
        {day < daysInMonth && (
             <Button
                onClick={() => router.push(`/dashboard/${monthId}/${day + 1}`)}
                className="bg-gray-800 text-white rounded-full text-xs px-4 py-2 sm:text-base sm:px-6 sm:py-2"
            >
                Siguiente Día <HiArrowRight className="ml-2" />
            </Button>
        )}
      </div>

      {/* Story Overlay (50px card + Animated Characters) */}
      <AnimatePresence>
        {isStoryOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-2xl"
                    style={{ borderRadius: '50px', padding: '3rem 2rem' }}
                >
                    <button 
                        onClick={() => setIsStoryOpen(false)}
                        className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                        <HiX size={24} className="text-gray-500" />
                    </button>

                    <div className="text-center mb-8">
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl mb-4 inline-block"
                        >
                            🦁
                        </motion.div>
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
                            {devotional?.story_title || 'Historia Bíblica'}
                        </h2>
                        <p className="text-pink-500 font-bold">¡Una aventura increíble!</p>
                    </div>

                    <div className="space-y-4 text-gray-600 text-lg leading-relaxed text-center whitespace-pre-line">
                        {devotional?.story_content ? (
                            <p>{devotional.story_content}</p>
                        ) : (
                            <p>No hay historia disponible para este día.</p>
                        )}
                        
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="flex justify-center gap-4 text-4xl mt-8 opacity-80"
                        >
                            <span>👧</span>
                            <span>✨</span>
                            <span>👦</span>
                        </motion.div>
                    </div>
                    
                    <div className="mt-10 text-center">
                        <Button 
                            onClick={() => setIsStoryOpen(false)}
                            className="bg-pink-400 hover:bg-pink-500 text-white rounded-full px-8 py-3 text-lg font-bold shadow-lg shadow-pink-200"
                        >
                            ¡Entendido! 👍
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
