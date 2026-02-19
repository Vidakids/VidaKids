'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Home, Music, VolumeX } from 'lucide-react';
import { UserViewProvider, useUserView } from '@/lib/user-view-context';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';

function UserLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isFullScreen } = useUserView();
  const { user, profile, isLoading, initialize, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/');
    } else if (profile?.role === 'admin') {
      router.push('/admin');
    }
  }, [isLoading, user, profile, router]);

  if (isLoading || !user || profile?.role === 'admin') {
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

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      <style jsx global>{`
        /* ── Global Background ── */
        .user-bg {
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #FFF5F7 0%, #FFE4F0 25%, #E1F5FE 50%, #F3E5F5 75%, #FFF8E1 100%);
          background-size: cover;
          background-attachment: fixed;
          position: relative;
        }
        .user-bg::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255, 255, 255, 0.3);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Hero Card (Header) ── */
        .hero-card {
            background: white;
            border-radius: 30px;
            padding: 1.5rem;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 10;
            overflow: hidden;
            margin-bottom: 2rem;
            text-align: center;
        }
        .hero-title {
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(135deg, #FFB6D9 0%, #D4A5FF 50%, #A3C7FF 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.2;
        }
        .hero-subtitle {
            font-size: 0.9rem;
            font-weight: 500;
            margin-top: 0.5rem;
            color: #666;
        }

        /* Decorative stars */
        .hero-card::before {
            content: '✨';
            position: absolute;
            top: -10px;
            left: 10px;
            font-size: 2rem;
            opacity: 0.3;
            animation: twinkle 3s ease-in-out infinite;
        }
        .hero-card::after {
            content: '🙏';
            position: absolute;
            bottom: -5px;
            right: 10px;
            font-size: 2rem;
            opacity: 0.3;
            animation: twinkle 3s ease-in-out infinite 1.5s;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
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

        /* ── Responsive ── */
        @media (min-width: 640px) {
            .hero-card {
                border-radius: 50px;
                padding: 3rem 2rem;
                margin-bottom: 3rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                text-align: left;
            }
            .hero-content {
                flex: 1;
            }
            .hero-title {
                font-size: 3rem;
            }
            .hero-subtitle {
                font-size: 1.2rem;
            }
            .hero-card::before {
                top: 20px; left: 30px; font-size: 3rem;
            }
            .hero-card::after {
                bottom: 20px; right: 30px; font-size: 3rem;
            }
            .hamburger-btn {
                display: none;
            }
        }
      `}</style>
    
      <div className="user-bg">
        <div className="relative z-10 p-4 sm:p-8 max-w-7xl mx-auto">
        
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
                    <h2 className="text-xl font-bold font-fredoka text-gray-700">Menú Usuario</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <nav className="flex flex-col gap-2">
                     <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className={`sidebar-link active`}>
                          <Home size={24} />
                          Inicio
                        </div>
                      </Link>
                    
                    <div className="border-t border-gray-100 my-4 pt-4">
                      <button 
                        onClick={handleLogout}
                        className="sidebar-link w-full text-left text-red-500 hover:bg-red-50"
                      >
                        <LogOut size={20} />
                        Salir
                      </button>
                    </div>
                  </nav>
                </motion.div>
              </>
            )}
        </AnimatePresence>

        {/* Header (Hero Card) — hidden when inside month/day views */}
        <AnimatePresence>
            {!isFullScreen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.5 }}
                className="hero-card"
              >
                  {/* Mobile Hamburger (Absolute or Flex) */}
                  <div className="sm:hidden absolute top-4 left-4 z-20">
                     <button 
                       onClick={() => setIsMobileMenuOpen(true)}
                       className="hamburger-btn"
                     >
                       <Menu size={24} />
                     </button>
                  </div>

                  <div className="hero-content w-full">
                      <h1 className="hero-title">
                        Todo el año caminando con Dios
                      </h1>
                      <p className="hero-subtitle">
                        365 devocionales para niños, uno para cada día
                      </p>
                  </div>

                  {/* Desktop Salir button */}
                  <motion.div
                      className="hidden sm:block flex-shrink-0 ml-8"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  >
                      <Button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white rounded-full px-6 py-6 text-lg font-bold shadow-lg shadow-pink-200"
                      >
                      <LogOut size={20} className="mr-2" />
                      Salir
                      </Button>
                  </motion.div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Main Content */}
        <main>
            {children}
        </main>
        
        <BackgroundMusic />
        
        </div>
      </div>
    </>
  );
}

function BackgroundMusic() {
  // Inicialización lazy para evitar setState en useEffect
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('musicPlaying') === 'true';
    }
    return false;
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Sincronizar audio con el estado inicial o cambios
    if (isPlaying) {
      audioRef.current?.play().catch(() => {
        // Si falla (por ejemplo, política de autoplay), revertimos el estado
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    localStorage.setItem('musicPlaying', String(newState));
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      dragConstraints={{ left: -300, right: 0, top: -600, bottom: 0 }}
      className="fixed bottom-6 right-6 z-50 cursor-grab active:cursor-grabbing"
    >
      <audio ref={audioRef} loop>
        <source src="/music/music.mp3" type="audio/mpeg" />
      </audio>

      <motion.button
        onClick={toggleMusic}
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-full px-5 py-3 shadow-lg flex items-center gap-3 border border-pink-100 hover:shadow-xl transition-all"
      >
        {isPlaying ? (
          <div className="bg-pink-100 p-2 rounded-full">
             <Music size={20} className="text-pink-500 animate-pulse" />
          </div>
        ) : (
          <div className="bg-gray-100 p-2 rounded-full">
             <VolumeX size={20} className="text-gray-400" />
          </div>
        )}
        
        <span className={`font-bold ${isPlaying ? 'text-pink-500' : 'text-gray-400'}`}>
          Música
        </span>
      </motion.button>
    </motion.div>
  );
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserViewProvider>
      <UserLayoutInner>{children}</UserLayoutInner>
    </UserViewProvider>
  );
}
