'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Home, Users, Link as LinkIcon } from 'lucide-react';
import { AdminViewProvider, useAdminView } from '@/lib/admin-view-context';
import { useAuthStore } from '@/store/auth-store';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isFullScreen } = useAdminView();
  const { user, profile, isLoading, initialize, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/');
    } else if (profile?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isLoading, user, profile, router]);

  if (isLoading || !user || profile?.role !== 'admin') {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE4F0 25%, #E1F5FE 50%, #F3E5F5 75%, #FFF8E1 100%)' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }}
          style={{ width: 32, height: 32, borderWidth: 3, borderStyle: 'solid', borderColor: '#FFB6D9', borderTopColor: '#FF6B9D', borderRadius: '50%' }}
        />
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const navItems = [
    { href: '/admin', label: 'Inicio', icon: Home, emoji: '🏠' },
    { href: '/admin/users', label: 'Usuarios', icon: Users, emoji: '👥' },
    { href: '/admin/activities', label: 'Enlaces Actividades', icon: LinkIcon, emoji: '🔗' },
  ];

  return (
    <>
      <style jsx global>{`
        .admin-bg {
          background: linear-gradient(135deg, #FFF5F7 0%, #FFE4F0 25%, #E1F5FE 50%, #F3E5F5 75%, #FFF8E1 100%);
          background-size: cover;
          background-attachment: fixed;
        }
        .admin-bg::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255, 255, 255, 0.3);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Base: tiny phones ≤374px ── */
        .admin-panel {
          background: white;
          border-radius: 20px;
          padding: 1rem;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
          position: relative;
          z-index: 10;
        }
        .admin-tab {
          padding: 0.45rem 0.65rem;
          border: 2px solid #FFE4F0;
          border-radius: 18px;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #FFF5F8;
          color: #999;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .admin-tab:hover {
          transform: translateY(-3px);
        }
        .admin-tab.active {
          background: linear-gradient(135deg, #FFB6D9 0%, #FFC5E5 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(255, 182, 217, 0.4);
          border-color: #FFB6D9;
        }
        .admin-tab .tab-emoji {
          font-size: 1rem;
        }
        
        .hamburger-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 2px solid #FFE4F0;
          color: #FFB6D9;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hamburger-btn:active {
          transform: scale(0.95);
          background: #FFF5F8;
        }

        .logout-btn {
          padding: 0.5rem 0.9rem;
          border: none;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #FF9999 0%, #FFB3B3 100%);
          color: white;
          box-shadow: 0 5px 15px rgba(255, 153, 153, 0.3);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 153, 153, 0.4);
        }
        
        .admin-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #FFB6D9;
        }
        .admin-subtitle {
          font-size: 0.7rem;
        }
        .admin-divider {
          border-bottom: 3px dashed rgba(0, 0, 0, 0.1);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        /* ── Mobile Sidebar Styles ── */
        .mobile-sidebar {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 80%;
          max-width: 300px;
          background: white;
          z-index: 100;
          padding: 2rem 1.5rem;
          box-shadow: 5px 0 30px rgba(0,0,0,0.1);
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 15px;
          color: #666;
          font-weight: 600;
          transition: all 0.2s;
          margin-bottom: 0.5rem;
        }
        .sidebar-link.active {
          background: #FFF5F8;
          color: #FFB6D9;
        }
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(2px);
          z-index: 90;
        }

        /* ── 375px+: small phones ── */
        @media (min-width: 375px) {
          .admin-panel {
            border-radius: 25px;
            padding: 1.2rem;
          }
          .admin-tab {
            padding: 0.65rem 1.1rem;
            font-size: 0.85rem;
            border-radius: 22px;
          }
          .admin-title {
            font-size: 1.25rem;
          }
          .logout-btn {
            padding: 0.6rem 1.1rem;
            font-size: 0.85rem;
          }
        }

        /* ── 414px+: medium phones ── */
        @media (min-width: 414px) {
          .admin-panel {
            border-radius: 30px;
            padding: 1.5rem;
          }
          .admin-tab {
            padding: 0.75rem 1.3rem;
            font-size: 0.9rem;
            border-radius: 25px;
          }
          .admin-title {
            font-size: 1.4rem;
          }
          .logout-btn {
            padding: 0.7rem 1.3rem;
            font-size: 0.9rem;
            border-radius: 22px;
          }
          .admin-divider {
            padding-bottom: 1.3rem;
            margin-bottom: 1.3rem;
          }
        }

        /* ── 640px+: tablets/desktop ── */
        @media (min-width: 640px) {
          .admin-panel {
            border-radius: 40px;
            padding: 2.5rem;
          }
          .admin-tab {
            padding: 1rem 2rem;
            font-size: 1.1rem;
            border-radius: 30px;
          }
          .admin-title {
            font-size: 1.8rem;
          }
          .admin-subtitle {
            font-size: 0.9rem;
          }
          .logout-btn {
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            border-radius: 25px;
          }
          .admin-divider {
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
          }
          /* Hide hamburger on desktop */
          .hamburger-btn {
            display: none;
          }
        }
      `}</style>

      <div className="admin-bg min-h-screen min-h-[100dvh] relative">
        <div className="relative z-10 p-3 sm:p-6 md:p-8">
          
          {/* Mobile Sidebar & Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="sidebar-overlay"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="mobile-sidebar"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold font-fredoka text-gray-700">Menú Admin</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}>
                          <span className="text-xl">{item.emoji}</span>
                          {item.label}
                        </div>
                      </Link>
                    ))}
                    
                    <div className="border-t border-gray-100 my-4 pt-4">
                      <button 
                        onClick={handleLogout}
                        className="sidebar-link w-full text-left text-red-500 hover:bg-red-50"
                      >
                        <LogOut size={20} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
            className="max-w-5xl mx-auto"
          >
            <div className="admin-panel">
              {/* Header + Nav */}
              <AnimatePresence>
                {!isFullScreen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header */}
                    <motion.header
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="admin-divider flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        {/* Hamburger Button (Mobile Only) */}
                        <div className="sm:hidden">
                          <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="hamburger-btn"
                          >
                            <Menu size={24} />
                          </button>
                        </div>

                        <div>
                          <h1 className="admin-title flex items-center gap-2">
                            <span className="hidden sm:inline">⚙️</span> Panel <span className="hidden sm:inline">de Administración</span> <span className="sm:hidden">Admin</span>
                          </h1>
                          <p className="admin-subtitle mt-1" style={{ opacity: 0.6, color: '#666' }}>
                            Bienvenido, admin ✨
                          </p>
                        </div>
                      </div>

                      {/* Desktop Logout (Hidden on mobile) */}
                      <div className="hidden sm:block">
                        <motion.button
                          whileHover={{ translateY: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleLogout}
                          className="logout-btn"
                        >
                          <LogOut size={16} /> Cerrar sesión
                        </motion.button>
                      </div>
                    </motion.header>

                    {/* Desktop Navigation Tabs (Hidden on mobile) */}
                    <motion.nav
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="hidden sm:flex flex-wrap gap-2 sm:gap-3 mb-8 pb-6" 
                      style={{ borderBottom: '3px dashed rgba(0,0,0,0.08)' }}
                    >
                      {navItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link key={item.href} href={item.href}>
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.25 + index * 0.08 }}
                              whileHover={{ translateY: -3 }}
                              whileTap={{ scale: 0.95 }}
                              className={`admin-tab ${isActive ? 'active' : ''}`}
                            >
                              <span className="text-lg">{item.emoji}</span>
                              {item.label}
                            </motion.div>
                          </Link>
                        );
                      })}
                    </motion.nav>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Content */}
              <main>
                {children}
              </main>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminViewProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminViewProvider>
  );
}
