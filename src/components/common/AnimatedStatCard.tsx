import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface AnimatedStatCardProps {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
  iconColor?: string;
}

export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  icon: Icon,
  value,
  suffix = '+',
  label,
  delay = 0,
  iconColor = 'text-primary'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut'
      }}
      className="text-center group"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          delay: delay + 0.2,
          ease: 'easeOut'
        }}
        className="mb-4 inline-block"
      >
        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      </motion.div>
      
      <div className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
        <AnimatedCounter to={value} duration={2} suffix={suffix} />
      </div>
      
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
};
