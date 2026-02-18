import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/tipos';

type Month = Tables<'months'>;
type Devotional = Tables<'devotionals'>;

interface UserStore {
  months: Month[];
  completedDays: Set<string>;
  devotionals: Devotional[];
  activityUrl: string | null;
  isLoadingMonths: boolean;
  isLoadingDevotionals: boolean;

  fetchMonths: () => Promise<void>;
  fetchDevotionals: (monthId: number) => Promise<void>;
  getDevotional: (monthId: number, dayNumber: number) => Devotional | undefined;
  fetchActivity: (monthId: number, dayNumber: number) => Promise<void>;
  fetchProgress: (monthId: number) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => {
  const supabase = createClient();

  return {
    months: [],
    devotionals: [],
    activityUrl: null,
    completedDays: new Set(),
    isLoadingMonths: false,
    isLoadingDevotionals: false,

    fetchMonths: async () => {
      set({ isLoadingMonths: true });
      const { data } = await supabase
        .from('months')
        .select('*')
        .order('id');
      set({ months: data ?? [], isLoadingMonths: false });
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

    fetchActivity: async (monthId, dayNumber) => {
      set({ activityUrl: null });
      const { data } = await supabase
        .from('activities')
        .select('drive_url')
        .eq('month_id', monthId)
        .eq('day_number', dayNumber)
        .eq('is_configured', true)
        .single();
      set({ activityUrl: data?.drive_url ?? null });
    },

    fetchProgress: async (monthId) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_progress')
        .select('day_number')
        .eq('user_id', user.id)
        .eq('month_id', monthId)
        .eq('completed', true);

      if (data) {
        set((state) => {
            const newSet = new Set(state.completedDays);
            data.forEach(d => newSet.add(`${monthId}-${d.day_number}`));
            return { completedDays: newSet };
        });
      }
    },
  };
});
