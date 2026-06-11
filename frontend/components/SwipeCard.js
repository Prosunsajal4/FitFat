import { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function SwipeCard({ children, onSwipeLeft, onSwipeRight, threshold = 150 }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const leftOpacity = useTransform(x, [-200, -50], [1, 0]);
  const rightOpacity = useTransform(x, [50, 200], [0, 1]);

  const handleDragEnd = (_, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -threshold || velocity < -500) {
      animate(x, -500, { duration: 0.3 });
      onSwipeLeft?.();
    } else if (offset > threshold || velocity > 500) {
      animate(x, 500, { duration: 0.3 });
      onSwipeRight?.();
    } else {
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.9}
        onDragEnd={handleDragEnd}
        className="relative z-10 cursor-grab active:cursor-grabbing touch-pan-y"
        whileTap={{ cursor: 'grabbing' }}
      >
        <motion.div
          style={{ opacity: leftOpacity }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-xl pointer-events-none"
        >
          ✕
        </motion.div>
        <motion.div
          style={{ opacity: rightOpacity }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 font-bold text-xl pointer-events-none"
        >
          ✓
        </motion.div>
        {children}
      </motion.div>
    </div>
  );
}
