import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  from = 0, 
  to, 
  duration = 2,
  suffix = '',
  className = ''
}) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isInView) {
      if (prefersReducedMotion) {
        // Skip animation if user prefers reduced motion
        count.set(to);
      } else {
        // Animate the counter
        const controls = animate(count, to, {
          duration,
          ease: 'easeOut'
        });
        
        return controls.stop;
      }
    }
  }, [isInView, count, to, duration]);

  return (
    <motion.span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
};
