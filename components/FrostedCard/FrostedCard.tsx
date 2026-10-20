import './FrostedCard.css';
import React, { CSSProperties, ReactNode } from 'react';

type FrostedCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: 'default' | 'blue' | 'green' | 'pink';
  padding?: number | string;
  onClick?: () => void;
}

export default function FrostedCard({ children, className = '', style, variant = 'default', padding = 24, onClick }: FrostedCardProps) {
   return (
      <div
         className={`frosted-card frosted-card--${variant} ${className}`}
         style={{ padding, ...style }}
         onClick={onClick}
      >
         {children}
      </div>
   );
}
