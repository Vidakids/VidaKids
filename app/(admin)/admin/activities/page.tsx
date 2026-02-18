'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminStore } from '@/store/admin-store';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/tipos';
import { HiArrowLeft, HiSave, HiExternalLink } from 'react-icons/hi';

type Activity = Tables<'activities'>;
type Month = Tables<'months'>;

const DAYS_IN_MONTH: Record<string, number> = {
  Enero: 31, Febrero: 28, Marzo: 31, Abril: 30, Mayo: 31, Junio: 30,
  Julio: 31, Agosto: 31, Septiembre: 30, Octubre: 31, Noviembre: 30, Diciembre: 31,
};

interface DayLink {
  day: number;
  url: string;
  saved: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export default function ActivitiesPage() {
  const { months, fetchMonths, isLoadingMonths } = useAdminStore();
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [links, setLinks] = useState<DayLink[]>([]);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    if (months.length === 0) {
      fetchMonths().then(() => { if (cancelled) return; });
    }
    return () => { cancelled = true; };
  }, [fetchMonths, months.length]);

  const handleSelectMonth = async (month: Month) => {
    setSelectedMonth(month);
    setIsLoadingActivities(true);
    const daysInMonth = DAYS_IN_MONTH[month.name] ?? 30;

    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('month_id', month.id)
      .order('day_number');

    const activityMap = new Map<number, Activity>();
    activities?.forEach((a) => activityMap.set(a.day_number, a));

    setLinks(
      Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const existing = activityMap.get(day);
        return { day, url: existing?.drive_url ?? '', saved: existing?.is_configured ?? false };
      })
    );

    setIsLoadingActivities(false);
  };

  const handleBack = () => {
    setSelectedMonth(null);
    setLinks([]);
  };

  const handleUpdateUrl = (day: number, url: string) => {
    setLinks(links.map(l => (l.day === day ? { ...l, url, saved: false } : l)));
  };

  const handleSaveDay = async (day: number) => {
    if (!selectedMonth) return;
    setSavingDay(day);

    const link = links.find(l => l.day === day);
    const url = link?.url?.trim() ?? '';

    const { error } = await supabase
      .from('activities')
      .upsert(
        {
          month_id: selectedMonth.id,
          day_number: day,
          drive_url: url || null,
          is_configured: !!url,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'month_id,day_number' }
      );

    if (!error) {
      setLinks(links.map(l => (l.day === day ? { ...l, saved: true } : l)));
    }

    setSavingDay(null);
  };

  const configuredCount = links.filter(l => l.saved).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <AnimatePresence mode="wait">
        {!selectedMonth ? (
          /* ── Month Selection ── */
          <motion.div
            key="months"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[20px] sm:rounded-[30px] p-5 sm:p-8 border-2 border-amber-100">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 sm:mb-8"
              >
                <h2 className="flex flex-col sm:flex-row sm:items-center gap-2 text-xl sm:text-2xl font-bold text-gray-800">
                   <span>🌸 Gestionar Actividades ✨</span>
                </h2>
                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  Selecciona un mes para configurar los enlaces de Google Drive 📁
                </p>
              </motion.div>

              {isLoadingMonths ? (
                <div className="flex justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-3 border-pink-300 border-t-pink-500 rounded-full"
                  />
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                >
                  {months.map((item) => (
                    <motion.button
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleSelectMonth(item)}
                      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center gap-2 border-2 border-transparent hover:border-amber-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <span className="text-3xl sm:text-4xl">{item.icon_name}</span>
                      <span className="font-bold text-sm sm:text-base text-gray-700">
                        {item.name?.toUpperCase()}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ── Day Editor ── */
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full font-semibold shadow-sm hover:bg-gray-50 text-sm"
                  >
                    <HiArrowLeft /> Volver
                  </motion.button>
                  
                   <div>
                        <h2 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-gray-800">
                            {selectedMonth.icon_name} Actividades de {selectedMonth.name}
                        </h2>
                   </div>
               </div>

                <span className="self-start sm:self-auto px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold">
                    {configuredCount}/{links.length} configurados
                </span>
            </div>

            {/* Activities Grid */}
            <div className="bg-white rounded-[20px] sm:rounded-[30px] p-4 sm:p-6 shadow-sm border border-gray-100">
              {isLoadingActivities ? (
                <div className="flex justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-3 border-pink-300 border-t-pink-500 rounded-full"
                  />
                </div>
              ) : (
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
                      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-5 border border-gray-200 hover:border-pink-200 transition-colors"
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-700 text-base sm:text-lg">
                          Día {link.day}
                        </h3>
                         {link.saved ? (
                             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                 ✅ Listo
                             </span>
                         ) : (
                             <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                                 Pendiente
                             </span>
                         )}
                      </div>

                      {/* URL Input */}
                      <input
                        value={link.url}
                        onChange={(e) => handleUpdateUrl(link.day, e.target.value)}
                        placeholder="Pegar enlace de Drive..."
                        className="w-full px-3 py-2.5 mb-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-100 outline-none transition-all placeholder:text-gray-400"
                      />

                      {/* Actions */}
                      <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleSaveDay(link.day)}
                            disabled={savingDay === link.day || !link.url.trim()}
                            whileTap={link.url.trim() ? { scale: 0.95 } : {}}
                            className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {savingDay === link.day ? '...' : <div className="flex items-center justify-center gap-1"><HiSave /> Guardar</div>}
                          </motion.button>
                          
                          {link.url.trim() && (
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                                title="Probar enlace"
                              >
                                  <HiExternalLink size={18} />
                              </a>
                          )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
