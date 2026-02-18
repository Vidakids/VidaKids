import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/tipos';

type Month = Tables<'months'>;
type Devotional = Tables<'devotionals'>;

interface DevotionalForm {
  title: string;
  story_title: string;
  story_content: string;
  verse_text: string;
  verse_reference: string;
  reflection_content: string;
  prayer_content: string;
  image_url: string | null;
}

interface AdminStore {
  // Estado
  months: Month[];
  devotionals: Devotional[];
  isLoadingMonths: boolean;
  isLoadingDevotionals: boolean;
  isSaving: boolean;
  saved: boolean;

  // Acciones — Meses
  fetchMonths: () => Promise<void>;
  updateMonth: (id: number, data: Partial<Month>) => Promise<void>;

  // Acciones — Devocionales
  fetchDevotionals: (monthId: number) => Promise<void>;
  getDevotional: (monthId: number, dayNumber: number) => Devotional | undefined;
  saveDevotional: (monthId: number, dayNumber: number, form: DevotionalForm) => Promise<void>;

  // UI
  setSaved: (v: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => {
  const supabase = createClient();

  return {
    months: [],
    devotionals: [],
    isLoadingMonths: false,
    isLoadingDevotionals: false,
    isSaving: false,
    saved: false,

    fetchMonths: async () => {
      set({ isLoadingMonths: true });
      const { data } = await supabase
        .from('months')
        .select('*')
        .order('id');
      set({ months: data ?? [], isLoadingMonths: false });
    },

    updateMonth: async (id, updates) => {
      const { error } = await supabase
        .from('months')
        .update(updates)
        .eq('id', id);

      if (!error) {
        set((s) => ({
          months: s.months.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      }
    },

    fetchDevotionals: async (monthId) => {
      set({ isLoadingDevotionals: true });
      const { data } = await supabase
        .from('devotionals')
        .select('*')
        .eq('month_id', monthId)
        .order('day_number');
      set({ devotionals: data ?? [], isLoadingDevotionals: false });
    },

    getDevotional: (monthId, dayNumber) => {
      return get().devotionals.find(
        (d) => d.month_id === monthId && d.day_number === dayNumber
      );
    },

    saveDevotional: async (monthId, dayNumber, form) => {
      set({ isSaving: true });
      const { error } = await supabase
        .from('devotionals')
        .upsert(
          {
            month_id: monthId,
            day_number: dayNumber,
            title: form.title,
            story_title: form.story_title,
            story_content: form.story_content,
            verse_text: form.verse_text,
            verse_reference: form.verse_reference,
            reflection_content: form.reflection_content,
            prayer_content: form.prayer_content,
            image_url: form.image_url,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'month_id,day_number' }
        );

      if (!error) {
        // Actualizar el devocional en el estado local
        const existing = get().devotionals.find(
          (d) => d.month_id === monthId && d.day_number === dayNumber
        );
        if (existing) {
          set((s) => ({
            devotionals: s.devotionals.map((d) =>
              d.month_id === monthId && d.day_number === dayNumber
                ? { ...d, ...form, updated_at: new Date().toISOString() }
                : d
            ),
          }));
        } else {
          // Refetch si es nuevo
          await get().fetchDevotionals(monthId);
        }
      }

      set({ isSaving: false, saved: !error });
    },

    setSaved: (v) => set({ saved: v }),
  };
});
