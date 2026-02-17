'use client';

import { useState} from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HiEye, HiEyeOff } from 'react-icons/hi';

interface User {
  id: string;
  username: string;
  password: string;
  devotionalsRead: number;
  totalDevotionals: number;
  role: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'pruebas01',
    password: 'pruebas123',
    devotionalsRead: 2,
    totalDevotionals: 365,
    role: 'Usuario',
  },
  {
    id: '2',
    username: 'Eldachz',
    password: 'eldachz123',
    devotionalsRead: 5,
    totalDevotionals: 365,
    role: 'Usuario',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(new Set());

  const handleCreateUser = () => {
    if (!newUsername.trim() || !newPassword.trim()) return;

    const newUser: User = {
      id: Date.now().toString(),
      username: newUsername,
      password: newPassword,
      devotionalsRead: 0,
      totalDevotionals: 365,
      role: 'Usuario',
    };

    setUsers([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('¿Deseas eliminar este usuario?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const togglePasswordVisibility = (id: string) => {
    const newRevealed = new Set(revealedPasswords);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedPasswords(newRevealed);
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
            {/* Username Input */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Usuario
                <span className="text-xl">👤</span>
              </label>
              <Input
                type="text"
                placeholder="Ingresa el nombre de usuario"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
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
                  placeholder="Ingresa la contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            {/* Create Button */}
            <Button
              onClick={handleCreateUser}
              className="w-full bg-pink-300 hover:bg-pink-400 text-white rounded-2xl py-3 text-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <span className="text-xl">+</span>
              Crear Usuario
            </Button>
          </div>
        </div>

        {/* Registered Users Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">👥</span>
            Usuarios Registrados ({users.length})
          </h3>

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
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{user.username}</h4>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-2 text-gray-700 mb-2">
                        <span className="text-lg">🔐</span>
                        <span className="font-semibold">Contraseña:</span>
                        <span className="text-gray-600 font-mono">
                          {revealedPasswords.has(user.id) ? user.password : '•••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="ml-2 text-gray-400 hover:text-pink-500 transition-colors"
                        >
                          {revealedPasswords.has(user.id) ? (
                            <HiEyeOff size={18} />
                          ) : (
                            <HiEye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-pink-500 font-semibold mb-3 flex items-center gap-1">
                      <span>📖</span>
                      Devocionales leidos: {user.devotionalsRead} de {user.totalDevotionals}
                    </div>

                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {user.role}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      className="bg-blue-300 hover:bg-blue-400 text-white rounded-2xl px-6 py-2 font-semibold flex items-center gap-2 transition-all"
                    >
                      <span className="text-lg">✏️</span>
                      Cambiar
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-pink-300 hover:bg-pink-400 text-white rounded-2xl px-6 py-2 font-semibold flex items-center gap-2 transition-all"
                    >
                      <span className="text-lg">🗑️</span>
                      Eliminar
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
