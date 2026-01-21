import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ 
  children, 
  className = '', 
  intensity = 'medium',
  ...props 
}) => {
  const intensityMap = {
    low: 'bg-slate-900/40 backdrop-blur-md border-white/5',
    medium: 'bg-slate-900/60 backdrop-blur-xl border-white/10',
    high: 'bg-slate-900/80 backdrop-blur-2xl border-white/15',
  };

  return (
    <motion.div 
      className={`glass-panel rounded-2xl border shadow-2xl ${intensityMap[intensity]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  isLoading,
  ...props 
}) => {
  const variants = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] border-transparent',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border-white/10',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white border-transparent'
  };

  return (
    <button 
      className={`
        relative overflow-hidden px-6 py-3 rounded-xl transition-all duration-300 border
        flex items-center justify-center gap-2 font-medium tracking-wide
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${variants[variant]} 
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};
