'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleDevotionalProgress(
  monthId: number,
  dayNumber: number,
  isCompleted: boolean
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  try {
    if (isCompleted) {
      // Si SÍ está completado -> DELETE
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
      // Si NO está completado -> INSERT
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          month_id: monthId,
          day_number: dayNumber,
          is_completed: true,
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
