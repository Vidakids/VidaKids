'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateMonthAction(monthId: number, data: { theme?: string }) {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('No autenticado');
  }

  // 2. Admin check (Optional but recommended if RLS relies on simple auth)
  // If your RLS already checks for profile.role = 'admin', this might be redundant but safe.
  // However, fetching the profile here ensures we know the role for sure.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  console.log('User Role Check:', profile?.role); // Debug

  if (profile?.role !== 'admin') {
    throw new Error('No autorizado');
  }

  // 3. Update
  const { error } = await supabase
    .from('months')
    .update(data)
    .eq('id', monthId);

  if (error) {
    console.error('Error updating month:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin');
  revalidatePath('/admin/' + monthId);
  revalidatePath('/dashboard'); // Update user view too
  
  return { success: true };
}
