'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
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
        if (authData.role !== 'admin') {
          router.push('/dashboard');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
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

  const navItems = [
    { href: '/admin', label: 'Inicio', emoji: '🏠' },
    { href: '/admin/users', label: 'Usuarios', emoji: '👥' },
    { href: '/admin/activities', label: 'Enlaces Actividades', emoji: '🔗' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100/80 via-purple-50/60 to-blue-100/70 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl border border-white/50 overflow-hidden"
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-between px-6 sm:px-10 pt-8 pb-2"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              <h1 className="text-2xl sm:text-3xl font-bold italic bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent">
                Panel de Administración
              </h1>
            </div>
            <p className="text-sm text-gray-400 mt-1 ml-9">
              Bienvenido, admin <span>✨</span>
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleLogout}
              className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-full px-5 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition-all text-sm"
            >
              <LogOut size={15} />
              Cerrar sesión
            </Button>
          </motion.div>
        </motion.header>

        {/* Navigation Tabs */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="px-6 sm:px-10 py-5 flex flex-wrap gap-3"
        >
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.25 + index * 0.08 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className={`rounded-full px-5 py-2.5 text-sm font-medium flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-pink-100 border-pink-300 text-pink-600 shadow-sm'
                        : 'bg-white/60 border-gray-200 text-gray-600 hover:bg-pink-50 hover:border-pink-200'
                    }`}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    {item.label}
                  </Button>
                </motion.div>
              </Link>
            );
          })}
        </motion.nav>

        {/* Divider */}
        <div className="px-6 sm:px-10">
          <div className="border-t border-gray-100"></div>
        </div>

        {/* Main Content */}
        <main className="px-6 sm:px-10 py-8">
          {children}
        </main>
      </motion.div>
    </div>
  );
}
