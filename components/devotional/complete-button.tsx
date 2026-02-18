'use client';

import { useOptimistic, useTransition } from 'react';
import { toggleDevotionalProgress } from '@/app/actions/progress';
import { HiCheck } from 'react-icons/hi';
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
  const [isPending, startTransition] = useTransition();
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
          colors: ['#F472B6', '#60A5FA', '#34D399', '#FBBF24'],
        });
      }

      await toggleDevotionalProgress(monthId, dayNumber, optimisticCompleted);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`
        relative group overflow-hidden rounded-[30px] p-6 min-h-[140px] w-full
        flex flex-col items-center justify-center gap-3 shadow-lg transition-all duration-300
        ${
          optimisticCompleted
            ? 'bg-green-500 text-white shadow-green-200 scale-105'
            : 'bg-white border-2 border-green-100 text-green-400 hover:bg-green-50 hover:border-green-200'
        }
      `}
    >
      <div
        className={`
          p-4 rounded-xl transition-colors duration-300
          ${optimisticCompleted ? 'bg-white/20' : 'bg-green-50'}
        `}
      >
        <HiCheck
          size={32}
          className={`
            transition-transform duration-300
            ${optimisticCompleted ? 'text-white scale-110' : 'text-green-500 group-hover:scale-110'}
          `}
        />
      </div>
      <span className="font-bold text-lg text-center">
        {optimisticCompleted ? '¡Completado! 🎉' : 'Marcar Completado'}
      </span>
    </button>
  );
}
