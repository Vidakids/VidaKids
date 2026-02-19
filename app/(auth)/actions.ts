'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/schemas';

/**
 * Server Action para login con email y contraseña.
 * 1. Valida inputs con Zod
 * 2. Autentica con Supabase Auth (signInWithPassword)
 * 3. Consulta la tabla profiles para obtener el rol
 * 4. Redirige según el rol: admin → /admin, user → /dashboard
 */
export async function login(
  prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validación con Zod
  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  // 🛡️ SEGURIDAD: Artificial Delay (Mitigación de fuerza bruta)
  // Hace que los intentos de "adivinar" sean muy lentos para un atacante.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const supabase = await createClient();

  // 1. Autenticar con Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    // Nota: Por seguridad, Supabase no distingue entre "usuario no existe" y "clave mal" 
    // para evitar que escaneen correos registrados.
    console.error('Login error:', error?.message);
    return { error: 'Correo o contraseña incorrectos. ¡Inténtalo de nuevo!' };
  }

  // 2. Consultar el rol del usuario en la tabla profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*') // Select all to see everything
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    console.error('Profile fetch error:', profileError);
  } else {
    console.log('Profile found:', profile);
    console.log('User ID from Auth:', data.user.id);
  }


  const role = profile?.role ?? 'user';
  console.log('Login Role Check:', { email, role }); // Debug

  // 3. Redirigir según el rol
  // redirect() lanza un error interno de Next.js que detiene la ejecución,
  // por eso va al final y fuera de try/catch.
  if (role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/dashboard');
  }
}
