'use client'

import { useActionState, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { login } from './actions'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      {/* Responsive overrides */}
      <style jsx global>{`
        .login-card {
          border-radius: 30px;
          padding: 2rem 1.5rem;
        }
        .login-logo {
          width: 180px !important;
        }
        .login-title {
          font-size: 1.6rem;
        }
        .login-subtitle {
          font-size: 0.95rem;
        }
        .login-label {
          font-size: 1rem;
        }
        .login-input {
          padding: 0.9rem 1.2rem;
          border-radius: 22px;
          font-size: 0.95rem;
          border: 2.5px solid #FFE4F0;
        }
        .login-input:focus {
          border-color: #FFB6D9;
          background: white;
          box-shadow: 0 5px 25px rgba(255, 182, 217, 0.3);
          transform: scale(1.02);
        }
        .login-btn {
          padding: 1.1rem;
          border-radius: 22px;
          font-size: 1.2rem;
        }
        .login-emoji-deco {
          font-size: 5rem;
          top: -10px;
          right: -10px;
        }

        /* Small phones 375px+ */
        @media (min-width: 375px) {
          .login-card {
            border-radius: 35px;
            padding: 2.2rem 1.8rem;
          }
          .login-logo {
            width: 200px !important;
          }
          .login-title {
            font-size: 1.8rem;
          }
          .login-subtitle {
            font-size: 1rem;
          }
          .login-label {
            font-size: 1.05rem;
          }
          .login-input {
            padding: 1rem 1.4rem;
            border-radius: 25px;
            font-size: 1rem;
          }
          .login-btn {
            padding: 1.2rem;
            border-radius: 25px;
            font-size: 1.3rem;
          }
        }

        /* Medium phones 414px+ */
        @media (min-width: 414px) {
          .login-card {
            border-radius: 40px;
            padding: 2.5rem 2rem;
          }
          .login-logo {
            width: 220px !important;
          }
          .login-title {
            font-size: 2rem;
          }
          .login-subtitle {
            font-size: 1.1rem;
          }
          .login-label {
            font-size: 1.1rem;
          }
          .login-input {
            padding: 1.1rem 1.6rem;
            border-radius: 28px;
            font-size: 1.05rem;
          }
          .login-btn {
            padding: 1.3rem;
            border-radius: 28px;
            font-size: 1.35rem;
          }
        }

        /* Tablets / Large screens 640px+ */
        @media (min-width: 640px) {
          .login-card {
            border-radius: 50px;
            padding: 3rem 2.5rem;
          }
          .login-logo {
            width: 260px !important;
          }
          .login-title {
            font-size: 2.5rem;
          }
          .login-subtitle {
            font-size: 1.2rem;
          }
          .login-label {
            font-size: 1.2rem;
          }
          .login-input {
            padding: 1.2rem 1.8rem;
            border-radius: 30px;
            font-size: 1.1rem;
            border-width: 3px;
          }
          .login-btn {
            padding: 1.5rem;
            border-radius: 30px;
            font-size: 1.5rem;
          }
          .login-emoji-deco {
            font-size: 8rem;
            top: -20px;
            right: -20px;
          }
        }
      `}</style>

      <div
        className="min-h-screen min-h-[100dvh] flex items-center justify-center px-3 py-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFF5F7 0%, #FFE4F0 25%, #E1F5FE 50%, #F3E5F5 75%, #FFF8E1 100%)',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay suave */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(255, 255, 255, 0.3)' }}
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' as const }}
          className="w-full max-w-[500px] relative z-10"
        >
          <div
            className="login-card bg-white relative overflow-hidden"
            style={{
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Decorative emoji */}
            <div className="login-emoji-deco absolute opacity-10 pointer-events-none" style={{ transform: 'rotate(15deg)' }}>
              🙏
            </div>

            {/* Logos */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.2 },
                scale: { duration: 0.5, delay: 0.2 },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.7 },
              }}
              className="flex justify-center mb-4 sm:mb-6"
            >
              <Image
                src="/logos.png"
                alt="Vida Kids & Culto Infantil"
                width={280}
                height={120}
                className="login-logo object-contain drop-shadow-md h-auto"
                priority
              />
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mb-5 sm:mb-8"
            >
              <h1
                className="login-title font-bold mb-1 sm:mb-2"
                style={{
                  background: 'linear-gradient(135deg, #FFB6D9 0%, #D4A5FF 50%, #A3C7FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Devocional Infantil ✨
              </h1>
              <p className="login-subtitle" style={{ opacity: 0.8, color: '#666' }}>
                Inicia sesión para continuar 🙏
              </p>
            </motion.div>

            {/* Error */}
            {state?.error && (
              <motion.div
                initial={{ opacity: 0, x: [-10, 10, -10, 10, 0] }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 px-4 py-2.5 text-sm sm:text-base"
                style={{
                  background: '#FFE0E0',
                  borderLeft: '4px solid #FF6B6B',
                  borderRadius: '16px',
                  color: '#CC0000',
                }}
              >
                {state.error}
              </motion.div>
            )}

            {/* Form */}
            <form action={formAction}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* Usuario */}
                <div className="mb-4 sm:mb-6">
                  <label className="login-label block mb-1.5 sm:mb-2 font-semibold" style={{ color: '#333' }}>
                    Usuario 👤
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ingresa tu usuario"
                    required
                    className="login-input w-full outline-none"
                    style={{
                      background: '#FFFBFD',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </div>

                {/* Contraseña */}
                <div className="mb-4 sm:mb-6">
                  <label className="login-label block mb-1.5 sm:mb-2 font-semibold" style={{ color: '#333' }}>
                    Contraseña 🔒
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Ingresa tu contraseña"
                      required
                      className="login-input w-full outline-none"
                      style={{
                        paddingRight: '3.2rem',
                        background: '#FFFBFD',
                        transition: 'all 0.3s ease',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute bg-transparent border-none cursor-pointer"
                      style={{
                        right: '0.8rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '1.3rem',
                        padding: '0.4rem',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={!isPending ? { translateY: -5, scale: 1.02 } : {}}
                  whileTap={!isPending ? { scale: 0.97 } : {}}
                  className="login-btn w-full text-white font-bold cursor-pointer flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    border: 'none',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #FFB6D9 0%, #FFC5E5 100%)',
                    boxShadow: '0 10px 30px rgba(255, 182, 217, 0.4)',
                    marginTop: '0.8rem',
                    transition: 'all 0.4s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isPending) {
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 182, 217, 0.5)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 182, 217, 0.4)'
                  }}
                >
                  {isPending ? (
                    <motion.div
                      className="rounded-full"
                      style={{ width: 22, height: 22, borderWidth: 3, borderStyle: 'solid', borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' as const }}
                    />
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Entrar</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mt-4 sm:mt-6"
              style={{ fontSize: '0.75rem', color: '#ccc' }}
            >
              Haz parte de esta experiencia espiritual para niños 💖
            </motion.p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
