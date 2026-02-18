import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/tipos';

type Profile = Tables<'profiles'>;

interface AuthState {
  // Estado
  user: { id: string; email: string } | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;

  // Acciones
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const supabase = createClient();

  return {
    user: null,
    profile: null,
    isLoading: true,
    error: null,

    initialize: async () => {
      set({ isLoading: true });

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        set({ user: null, profile: null, isLoading: false });
        return;
      }

      // Obtener perfil con rol
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      set({
        user: { id: user.id, email: user.email ?? '' },
        profile,
        isLoading: false,
      });
    },

    signOut: async () => {
      await supabase.auth.signOut();
      set({ user: null, profile: null, error: null });
    },

    setError: (error) => set({ error }),
  };
});
