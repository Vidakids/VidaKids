import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/tipos';

/**
 * Cliente de Supabase para Server Components y Server Actions.
 * IMPORTANTE: Esta función es async porque en Next.js 15, cookies() retorna una Promise.
 * Siempre usar: const supabase = await createClient();
 */
export async function createClient() {
  // En Next.js 15, cookies() es async — se debe usar await
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Lee todas las cookies disponibles en la request
        getAll() {
          return cookieStore.getAll();
        },
        // Escribe cookies en la response.
        // En Server Components esto puede fallar (read-only), por eso el try/catch.
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Si estamos en un Server Component, no podemos escribir cookies.
            // Esto es seguro de ignorar porque el middleware se encarga
            // de refrescar la sesión antes de que llegue aquí.
          }
        },
      },
    }
  );
}
