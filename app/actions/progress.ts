'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleDevotionalProgress(
  monthId: number,
  dayNumber: number,
  currentStatus: boolean
) {
  // Await the client creation as per Next.js 15 / Supabase SSR patterns
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  try {
    if (currentStatus) {
      // Si ya estaba completado, borrar
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .match({
          user_id: user.id,
          month_id: monthId,
          day_number: dayNumber,
        });

      if (error) throw error;
    } else {
      // Si no estaba completado, insertar
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          month_id: monthId,
          day_number: dayNumber,
          completed: true,
          completed_at: new Date().toISOString(),
        });

      if (error) throw error;
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error toggling progress:', error);
    return { success: false, error: 'Error al actualizar el progreso' };
  }
}
