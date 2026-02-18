'use server';

import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/tipos';

/**
 * Cliente con Service Role Key para operaciones admin
 * (crear/eliminar usuarios en Supabase Auth)
 */
function getAdminClient() {
  return createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Crear un nuevo usuario con email y contraseña.
 * 1. Crea el usuario en Supabase Auth (admin API)
 * 2. Inserta el perfil en la tabla profiles
 */
export async function createUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;

  if (!email || !password || !username) {
    return { error: 'Todos los campos son obligatorios' };
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  const admin = getAdminClient();

  // 1. Crear usuario en Auth
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Confirmar email automáticamente
  });

  if (authError) {
    if (authError.message.includes('already been registered')) {
      return { error: 'Este email ya está registrado' };
    }
    return { error: `Error al crear usuario: ${authError.message}` };
  }

  // 2. Insertar perfil
  const { error: profileError } = await admin
    .from('profiles')
    .upsert({
      id: authData.user.id,
      username,
      role: 'user',
    }, { onConflict: 'id' });

  if (profileError) {
    return { error: `Usuario creado pero error en perfil: ${profileError.message}` };
  }

  return { success: true, userId: authData.user.id };
}

/**
 * Eliminar un usuario.
 * 1. Elimina de Supabase Auth (cascade elimina el perfil si hay trigger)
 * 2. Elimina el perfil manualmente por seguridad
 */
export async function deleteUser(userId: string) {
  const admin = getAdminClient();

  // Eliminar de Auth
  const { error: authError } = await admin.auth.admin.deleteUser(userId);

  if (authError) {
    return { error: `Error al eliminar: ${authError.message}` };
  }

  // Eliminar perfil y progreso
  await admin.from('user_progress').delete().eq('user_id', userId);
  await admin.from('profiles').delete().eq('id', userId);

  return { success: true };
}

/**
 * Obtener lista de usuarios con su progreso de devocionales.
 */
export async function getUsers() {
  const supabase = await createClient();

  // Obtener perfiles (excluyendo admins)
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message, users: [] };
  }

  // Obtener conteo de progreso por usuario
  const admin = getAdminClient();
  const { data: progress } = await admin
    .from('user_progress')
    .select('user_id, is_completed')
    .eq('is_completed', true);

  // Mapear conteos
  const progressMap = new Map<string, number>();
  progress?.forEach((p) => {
    const count = progressMap.get(p.user_id ?? '') ?? 0;
    progressMap.set(p.user_id ?? '', count + 1);
  });

  // Obtener emails de Auth (solo con service role)
  const { data: authUsers } = await admin.auth.admin.listUsers();
  const emailMap = new Map<string, string>();
  authUsers?.users?.forEach((u) => {
    emailMap.set(u.id, u.email ?? '');
  });

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    username: p.username ?? 'Sin nombre',
    email: emailMap.get(p.id) ?? '',
    role: p.role ?? 'user',
    avatar_url: p.avatar_url,
    created_at: p.created_at,
    devotionalsRead: progressMap.get(p.id) ?? 0,
  }));

  return { users, error: null };
}
