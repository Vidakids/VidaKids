'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { HiEye, HiEyeOff } from 'react-icons/hi'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 600))

    // Mock credentials
    // Admin:   admin / admin123
    // Usuario: maestro / maestro123
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('auth_token', JSON.stringify({ user: 'admin', name: 'Administrador', role: 'admin' }))
      router.push('/admin')
    } else if (username === 'maestro' && password === 'maestro123') {
      localStorage.setItem('auth_token', JSON.stringify({ user: 'maestro', name: 'Maestro/a', role: 'user' }))
      router.push('/dashboard')
    } else {
      setError('Usuario o contraseña incorrectos')
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen min-h-[100dvh] flex items-center justify-center px-3 py-6 sm:p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fce4f3 0%, #e8d5f5 25%, #d5e8fc 50%, #f0e6ff 75%, #fce4f3 100%)',
      }}
    >
      {/* Floating decorative shapes - hidden on very small screens */}
      <motion.div
        className="absolute top-[12%] right-[15%] w-4 h-4 sm:w-6 sm:h-6 rounded-sm opacity-30 hidden sm:block"
        style={{ background: '#c9a0dc', transform: 'rotate(45deg)' }}
        animate={{ y: [0, -12, 0], rotate: [45, 55, 45] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const }}
      />
      <motion.div
        className="absolute top-[18%] right-[10%] w-5 h-5 rounded-full opacity-20 hidden sm:block"
        style={{ background: '#d4a0e8' }}
        animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
      />
      <motion.div
        className="absolute top-[25%] right-[12%] hidden sm:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
      >
        <div
          className="w-0 h-0 opacity-25"
          style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '14px solid #b48ad8',
          }}
        />
      </motion.div>
      <motion.div
        className="absolute bottom-[20%] left-[8%] w-4 h-4 rounded-full opacity-20 hidden sm:block"
        style={{ background: '#a8c4f0' }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }}
      />
      <motion.div
        className="absolute bottom-[30%] left-[12%] w-3 h-3 rounded-sm opacity-15 hidden sm:block"
        style={{ background: '#f0a8c4', transform: 'rotate(30deg)' }}
        animate={{ y: [0, 8, 0], rotate: [30, 40, 30] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' as const }}
      />
      <motion.div
        className="absolute top-[40%] left-[5%] hidden sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
      >
        <div
          className="w-0 h-0 opacity-15"
          style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '10px solid #f4c6d7',
          }}
        />
      </motion.div>

      {/* Soft glowing orbs */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(200,160,240,0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(160,200,240,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' as const }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div
          className="bg-white rounded-[1.8rem] sm:rounded-[2.5rem] px-5 py-8 sm:p-10 sm:pt-12"
          style={{
            boxShadow:
              '0 25px 80px rgba(180, 140, 220, 0.15), 0 8px 32px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Logos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.2 },
              scale: { duration: 0.5, delay: 0.2 },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.7 },
            }}
            className="flex justify-center mb-5 sm:mb-8"
          >
            <Image
              src="/logos.png"
              alt="Vida Kids & Culto Infantil"
              width={240}
              height={100}
              className="object-contain drop-shadow-md w-[160px] sm:w-[200px] md:w-[240px] h-auto"
              priority
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-6 sm:mb-10"
          >
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3"
              style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #c084fc, #f472b6, #fb923c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Devocional Infantil ✨
            </h1>
            <p className="text-sm sm:text-base text-gray-400 tracking-wide">
              Inicia sesión para continuar 🙏
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl mb-5 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Username */}
              <div className="space-y-1.5 sm:space-y-2.5">
                <label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                  Usuario
                  <span className="text-sm sm:text-base">👤</span>
                </label>
                <input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-pink-100 bg-white text-gray-800 placeholder-gray-300 text-sm sm:text-base outline-none transition-all duration-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5 sm:space-y-2.5">
                <label className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                  Contraseña
                  <span className="text-sm sm:text-base">🔒</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 sm:px-5 sm:py-4 pr-11 sm:pr-12 rounded-xl sm:rounded-2xl border-2 border-pink-100 bg-white text-gray-800 placeholder-gray-300 text-sm sm:text-base outline-none transition-all duration-200 focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400 transition-colors"
                  >
                    {showPassword ? (
                      <HiEyeOff className="w-5 h-5" />
                    ) : (
                      <HiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 sm:py-4.5 rounded-xl sm:rounded-2xl text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 cursor-pointer mt-2 sm:mt-3"
                style={{
                  background: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 50%, #ec4899 100%)',
                  boxShadow: '0 8px 25px rgba(244, 114, 182, 0.35)',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading)
                    e.currentTarget.style.boxShadow =
                      '0 12px 35px rgba(244, 114, 182, 0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(244, 114, 182, 0.35)'
                }}
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
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
            className="text-center text-[10px] sm:text-xs text-gray-300 mt-4 sm:mt-6"
          >
            Haz parte de esta experiencia espiritual para niños 💖
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
