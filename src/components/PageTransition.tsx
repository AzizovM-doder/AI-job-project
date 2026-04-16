'use client';

import { motion } from 'framer-motion';

export function PageTransition({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
