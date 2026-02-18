'use client';

import { useState, useEffect, useTransition } from 'react';
import { motion } from 'framer-motion';
import { createUser, deleteUser, getUsers } from './actions';
import { HiUserAdd, HiTrash, HiMail, HiUser, HiKey, HiEye, HiEyeOff } from 'react-icons/hi';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Create New User Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[20px] sm:rounded-[30px] p-5 sm:p-8 mb-8 border-2 border-green-100 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-green-700 mb-6">
          <HiUserAdd /> Crear Nuevo Usuario ✨
        </h2>

        <div className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold text-sm sm:text-base text-gray-700">
              Email 📧
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <HiMail size={18} />
                </div>
                <input
                type="email"
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white border-2 border-green-100 rounded-2xl sm:rounded-3xl text-sm sm:text-base focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block mb-2 font-semibold text-sm sm:text-base text-gray-700">
              Nombre de usuario 👤
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <HiUser size={18} />
                </div>
                <input
                type="text"
                placeholder="Ingresa el nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white border-2 border-green-100 rounded-2xl sm:rounded-3xl text-sm sm:text-base focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-semibold text-sm sm:text-base text-gray-700">
              Contraseña 🔐
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <HiKey size={18} />
                </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 sm:py-3.5 bg-white border-2 border-green-100 rounded-2xl sm:rounded-3xl text-sm sm:text-base focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 cursor-pointer"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Error / Success */}
          {formError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4 text-red-700 text-sm sm:text-base"
            >
              ❌ {formError}
            </motion.div>
          )}
          {formSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-100 border-l-4 border-green-500 rounded-r-xl p-4 text-green-800 text-sm sm:text-base"
            >
              {formSuccess}
            </motion.div>
          )}

          {/* Create Button */}
          <motion.button
            onClick={handleCreateUser}
            disabled={isPending || !email || !username || !password}
            whileHover={!isPending ? { translateY: -2 } : {}}
            whileTap={!isPending ? { scale: 0.98 } : {}}
            className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-pink-400 to-pink-300 text-white font-bold rounded-2xl sm:rounded-3xl shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg transition-transform"
          >
            {isPending ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Creando...
              </>
            ) : (
              <>➕ Crear Usuario</>
            )}
          </motion.button>
        </div>
      </div>

      {/* Registered Users */}
      <h3 className="flex items-center gap-2 mb-4 text-xl sm:text-2xl font-bold text-gray-800">
        👥 Usuarios Registrados ({users.length})
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
        <div className="space-y-3">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* User Info */}
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 overflow-hidden">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  {user.role === 'admin' ? '👑' : '👤'}
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                    <h4 className="font-bold text-base sm:text-lg text-gray-800 truncate">{user.username}</h4>
                    <span className="text-xs sm:text-sm text-gray-400 truncate">{user.email}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Usuario'}
                    </span>
                    <span className="text-[10px] sm:text-xs text-pink-400 font-medium bg-pink-50 px-2 py-0.5 rounded-full">
                       📖 {user.devotionalsRead} leídos
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {user.role !== 'admin' && (
                <motion.button
                  onClick={() => handleDeleteUser(user.id, user.username)}
                  disabled={isPending}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-4 py-2 sm:py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <HiTrash /> Eliminar
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
