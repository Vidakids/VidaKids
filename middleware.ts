import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware que refresca la sesión de Supabase en cada request.
 * Sin esto, la sesión del usuario expiraría prematuramente porque
 * las cookies de auth no se actualizarían con nuevos tokens.
 */
export async function middleware(request: NextRequest) {
  // 1. Crear una response inicial que será modificada con cookies actualizadas
  let supabaseResponse = NextResponse.next({ request });

  // 2. Crear el cliente de Supabase con acceso a las cookies de la request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Leer cookies de la request entrante
        getAll() {
          return request.cookies.getAll();
        },
        // Escribir cookies tanto en la request como en la response.
        // Es CRÍTICO actualizar ambas para que:
        // - La request tenga las cookies frescas para Server Components
        // - La response envíe las cookies actualizadas al browser
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Recrear la response con la request actualizada
          supabaseResponse = NextResponse.next({ request });

          // Copiar las cookies a la response que irá al browser
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 3. Refrescar la sesión — esto es lo que mantiene al usuario logueado.
  // IMPORTANTE: usar getUser() y NO getSession() — getSession() no valida
  // el token contra el servidor de Supabase.
  await supabase.auth.getUser();

  return supabaseResponse;
}

/**
 * Matcher: El middleware se ejecuta en todas las rutas EXCEPTO:
 * - _next/static (archivos estáticos de Next.js)
 * - _next/image (optimización de imágenes)
 * - favicon.ico (ícono del browser)
 * - Archivos de imagen comunes (svg, png, jpg, etc.)
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
