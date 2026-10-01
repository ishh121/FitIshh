import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface BrandWordmarkProps {
  className?: string;
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({ className }) => {
  const [phase, setPhase] = useState<'whole' | 'expanded' | 'settled'>('whole');

  useEffect(() => {
    if (phase === 'whole') {
      const timer = window.setTimeout(() => setPhase('expanded'), 650);
      return () => window.clearTimeout(timer);
    }
    if (phase === 'expanded') {
      const timer = window.setTimeout(() => setPhase('settled'), 1100);
      return () => window.clearTimeout(timer);
    }
  }, [phase]);

  return (
    <motion.span
      role="img"
      aria-label="FitIshh"
      className={`inline-flex items-baseline whitespace-nowrap ${className ?? ''}`}
      onHoverStart={() => setPhase('whole')}
      onHoverEnd={() => setPhase('settled')}
    >
      <AnimatePresence mode="wait" initial={false}>
        {phase === 'whole' ? (
          <motion.span
            key="whole"
            aria-hidden="true"
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.16 } }}
          >
            FitIshh
          </motion.span>
        ) : (
          <motion.span key="parts" className="inline-flex items-baseline gap-[0.12em]">
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
            >
              Fit
            </motion.span>
            <AnimatePresence>
              {phase === 'expanded' && (
                <motion.span
                  key="plus-fit-i"
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="text-prana-500"
                >
                  +
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.65 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.42, delay: 0.08, ease: 'easeOut' }}
              className="text-surya-500"
            >
              I
            </motion.span>
            <AnimatePresence>
              {phase === 'expanded' && (
                <motion.span
                  key="plus-i-shh"
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2, delay: 0.08 }}
                  className="text-prana-500"
                >
                  +
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.42, delay: 0.16, ease: 'easeOut' }}
            >
              shh
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
};