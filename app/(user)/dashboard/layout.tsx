'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HiLogout } from 'react-icons/hi';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/');
        return;
      }
      try {
        const authData = JSON.parse(token);
        if (authData.role === 'admin') {
          router.push('/admin');
        } else {
          setIsLoading(false);
        }
      } catch {
        router.push('/');
      }
    };
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }}
          className="w-8 h-8 border-3 border-pink-300 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100/70 via-purple-50/50 to-blue-100/60 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-white/50 overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 sm:px-10 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold italic bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
              ✨ Todo el año caminando con Dios
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-2">
              365 devocionales para niños, uno para cada día
            </p>
          </motion.div>

          {/* Salir button */}
          <motion.div
            className="absolute top-8 right-6 sm:right-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleLogout}
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-full px-5 py-2 flex items-center gap-2 shadow-md text-sm"
            >
              <HiLogout size={15} />
              Salir
            </Button>
          </motion.div>

          {/* Decorative meditation emoji */}
          <div className="absolute bottom-2 right-6 sm:right-10 text-3xl opacity-80">
            🧘
          </div>
        </div>

        {/* Main Content */}
        <main className="px-6 sm:px-10 pb-10">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
