'use client';

import { useOptimistic, startTransition } from 'react';
import { toggleDevotionalProgress } from '@/app/actions/progress';
import { CheckCircle, Circle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompleteButtonProps {
  monthId: number;
  dayNumber: number;
  initialIsCompleted: boolean;
}

export default function CompleteButton({
  monthId,
  dayNumber,
  initialIsCompleted,
}: CompleteButtonProps) {
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
    initialIsCompleted,
    (state, newStatus: boolean) => newStatus
  );

  const handleClick = async () => {
    const newStatus = !optimisticCompleted;

    startTransition(async () => {
      setOptimisticCompleted(newStatus);
      
      if (newStatus) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#6EE7B7'], // Tonos esmeralda
        });
      }

      await toggleDevotionalProgress(monthId, dayNumber, optimisticCompleted);
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative group overflow-hidden rounded-[30px] p-6 min-h-[140px] w-full
        flex flex-col items-center justify-center gap-3 shadow-lg transition-all duration-300
        ${
          optimisticCompleted
            ? 'bg-emerald-500 text-white shadow-emerald-200 scale-105 border-transparent'
            : 'bg-white border-2 border-gray-100 text-gray-400 hover:bg-gray-50 hover:border-gray-200'
        }
      `}
    >
      <div
        className={`
          p-4 rounded-xl transition-colors duration-300
          ${optimisticCompleted ? 'bg-white/20' : 'bg-gray-50'}
        `}
      >
        {optimisticCompleted ? (
            <CheckCircle
            size={32}
            className="text-white scale-110 transition-transform duration-300"
            />
        ) : (
            <Circle
            size={32}
            className="text-gray-300 group-hover:text-gray-400 transition-colors duration-300"
            />
        )}
      </div>
      <span className={`font-bold text-lg text-center ${optimisticCompleted ? 'text-white' : 'text-gray-400'}`}>
        {optimisticCompleted ? '¡Completado!' : 'Marcar como Leído'}
      </span>
    </button>
  );
}
