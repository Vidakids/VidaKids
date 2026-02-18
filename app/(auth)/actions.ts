'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Server Action para login con email y contraseña.
 * 1. Autentica con Supabase Auth (signInWithPassword)
 * 2. Consulta la tabla profiles para obtener el rol
 * 3. Redirige según el rol: admin → /admin, user → /dashboard
 */
export async function login(
  prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validación básica
  if (!email || !password) {
    return { error: 'Por favor ingresa tu email y contraseña' };
  }

  const supabase = await createClient();

  // 1. Autenticar con Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: 'Usuario o contraseña incorrectos' };
  }

  // 2. Consultar el rol del usuario en la tabla profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();


  const role = profile?.role ?? 'user';

  // 3. Redirigir según el rol
  // redirect() lanza un error interno de Next.js que detiene la ejecución,
  // por eso va al final y fuera de try/catch.
  if (role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}
