import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/tipos';

/**
 * Cliente de Supabase para componentes del lado del cliente ('use client').
 * Usa createBrowserClient que maneja las cookies automáticamente en el browser.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
