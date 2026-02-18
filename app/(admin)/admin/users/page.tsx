'use client';

import { useState, useEffect, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { createUser, deleteUser, getUsers } from './actions';

interface UserRow {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string | null;
  devotionalsRead: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Form
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadUsers = async () => {
    setIsLoading(true);
    const result = await getUsers();
    setUsers(result.users ?? []);
    setIsLoading(false);
  };

  useEffect(() => {
    let cancelled = false;
    getUsers().then((result) => {
      if (!cancelled) {
        setUsers(result.users ?? []);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const handleCreateUser = () => {
    setFormError('');
    setFormSuccess('');

    const formData = new FormData();
    formData.set('email', email);
    formData.set('username', username);
    formData.set('password', password);

    startTransition(async () => {
      const result = await createUser(formData);
      if (result.error) {
        setFormError(result.error);
      } else {
        setFormSuccess(`Usuario "${username}" creado exitosamente ✅`);
        setEmail('');
        setUsername('');
        setPassword('');
        await loadUsers();
      }
    });
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (!confirm(`¿Deseas eliminar al usuario "${name}"?`)) return;

    startTransition(async () => {
      const result = await deleteUser(userId);
      if (result.error) {
        setFormError(result.error);
      } else {
        await loadUsers();
      }
    });
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Create New User Section */}
        <div className="bg-green-50 rounded-3xl p-8 mb-8 border-2 border-green-100">
          <h2 className="text-3xl font-bold text-green-700 mb-8 flex items-center gap-2">
            <span className="text-2xl">+</span>
            Crear Nuevo Usuario
            <span className="text-2xl">✨</span>
          </h2>

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Email
                <span className="text-xl">📧</span>
              </label>
              <Input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-200 outline-none transition-all bg-white text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Username Input */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Nombre de usuario
                <span className="text-xl">👤</span>
              </label>
              <Input
                type="text"
                placeholder="Ingresa el nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-200 outline-none transition-all bg-white text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Contraseña
                <span className="text-xl">🔐</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-pink-400 focus:ring-4 focus:ring-pink-200 outline-none transition-all bg-white text-gray-800 placeholder-gray-400 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Error / Success Messages */}
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm font-medium"
              >
                ❌ {formError}
              </motion.div>
            )}
            {formSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 border border-green-200 text-green-700 rounded-2xl px-4 py-3 text-sm font-medium"
              >
                {formSuccess}
              </motion.div>
            )}

            {/* Create Button */}
            <Button
              onClick={handleCreateUser}
              disabled={isPending || !email || !username || !password}
              className="w-full bg-pink-300 hover:bg-pink-400 text-white rounded-2xl py-3 text-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Creando...
                </>
              ) : (
                <>
                  <span className="text-xl">+</span>
                  Crear Usuario
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Registered Users Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">👥</span>
            Usuarios Registrados ({users.length})
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-3 border-pink-300 border-t-pink-500 rounded-full"
              />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">👤</p>
              <p className="font-medium">No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {user.username.charAt(0).toUpperCase()}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-bold text-gray-800 mb-1">{user.username}</h4>
                      <p className="text-sm text-gray-400 mb-2 truncate">📧 {user.email}</p>

                      <div className="text-pink-500 font-semibold mb-3 flex items-center gap-1">
                        <span>📖</span>
                        Devocionales leídos: {user.devotionalsRead} de 365
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                        }>
                          {user.role === 'admin' ? '👑 Admin' : '👤 Usuario'}
                        </Badge>
                        {user.created_at && (
                          <span className="text-xs text-gray-300">
                            Desde {new Date(user.created_at).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Button (only for non-admin users) */}
                    {user.role !== 'admin' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          disabled={isPending}
                          className="bg-pink-300 hover:bg-pink-400 text-white rounded-2xl px-6 py-2 font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                          <span className="text-lg">🗑️</span>
                          Eliminar
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
