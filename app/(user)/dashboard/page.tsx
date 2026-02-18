'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUserView } from '@/lib/user-view-context';
import { useUserStore } from '@/store/user-store';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function UserMonthsPage() {
  const router = useRouter();
  const { setIsFullScreen } = useUserView();
  const { months, isLoadingMonths, fetchMonths } = useUserStore();

  useEffect(() => {
    setIsFullScreen(false);
    fetchMonths();
  }, [fetchMonths, setIsFullScreen]);

  if (isLoadingMonths) {
    return (
      <div className="flex justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' as const }}
          style={{ width: 40, height: 40, borderWidth: 4, borderStyle: 'solid', borderColor: '#FFB6D9', borderTopColor: '#FF6B9D', borderRadius: '50%' }}
        />
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        /* Month Button Styling */
        .month-btn {
            background: white;
            border-radius: 25px;
            padding: 1.5rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            border: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: 100%;
            position: relative;
            overflow: hidden;
        }

        .month-btn:hover {
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }

        .month-icon {
            font-size: 2.5rem;
            margin-bottom: 0.8rem;
        }
        .month-name {
            font-size: 0.9rem;
            font-weight: 800;
            color: #333;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .month-theme {
            font-size: 0.75rem;
            color: #888;
            margin-top: 0.3rem;
            font-weight: 500;
        }

        /* Responsive Breakpoints */
        @media (min-width: 640px) {
            .month-btn {
                border-radius: 35px;
                padding: 2.5rem 2rem;
            }
            .month-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
            .month-name {
                font-size: 1rem;
            }
            .month-theme {
                font-size: 0.85rem;
            }
        }
      `}</style>

      {/* Months Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
      >
        {months.map((item) => (
          <motion.button
            key={item.id}
            variants={cardVariants}
            whileHover={{ 
                scale: 1.05, 
                y: -10, 
                rotate: -2,
                transition: { type: "spring", stiffness: 300 } 
            }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push(`/dashboard/${item.id}`)}
            className="month-btn"
          >
            <motion.div
              className="month-icon"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
            >
              {item.icon_name}
            </motion.div>
            <span className="month-name">
              {item.name}
            </span>
            <span className="month-theme">
              {item.theme}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </>
  );
}
