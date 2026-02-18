'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HiArrowLeft } from 'react-icons/hi';
import { FiSave } from 'react-icons/fi';
import { HiXMark, HiCheck } from 'react-icons/hi2';
import { useAdminStore } from '@/store/admin-store';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/tipos';

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
  const { months, fetchMonths, isLoadingMonths } = useAdminStore();
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null);
  const [links, setLinks] = useState<DayLink[]>([]);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    if (months.length === 0) {
      fetchMonths().then(() => {
        if (cancelled) return;
      });
    }
    return () => { cancelled = true; };
  }, [fetchMonths, months.length]);

  const handleSelectMonth = async (month: Month) => {
    setSelectedMonth(month);
    setIsLoadingActivities(true);

    const daysInMonth = DAYS_IN_MONTH[month.name] ?? 30;

    // Fetch existing activities for this month
    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('month_id', month.id)
      .order('day_number');

    // Build a map of existing activities
    const activityMap = new Map<number, Activity>();
    activities?.forEach((a) => activityMap.set(a.day_number, a));

    // Generate all day links, filling in existing data
    setLinks(
      Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const existing = activityMap.get(day);
        return {
          day,
          url: existing?.drive_url ?? '',
          saved: existing?.is_configured ?? false,
        };
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
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
                >
                  {months.map((item) => (
                    <motion.button
                      key={item.id}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleSelectMonth(item)}
                      className="bg-white rounded-full py-3 px-4 text-center shadow-sm hover:shadow-md border border-gray-100 hover:border-pink-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span className="text-base">{item.icon_name}</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-600 tracking-wide">
                        {item.name?.toUpperCase()}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
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
                <span>{selectedMonth.icon_name}</span>
                Días de {selectedMonth.name}
              </h2>
              <span className="text-sm text-gray-400 bg-green-50 px-3 py-1 rounded-full font-medium">
                {configuredCount}/{links.length} configurados
              </span>
            </div>

            {/* Days Grid */}
            <div className="bg-orange-50/60 rounded-3xl border border-orange-100/60 p-5 sm:p-8">
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
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
