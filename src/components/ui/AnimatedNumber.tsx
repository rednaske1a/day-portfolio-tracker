
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (displayValue !== value) {
      setAnimate(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setTimeout(() => setAnimate(false), 300);
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const formattedValue = () => {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    
    return `${prefix}${formatter.format(displayValue)}${suffix}`;
  };

  return (
    <span className={cn('inline-block overflow-hidden', className)}>
      <span className={cn('inline-block transition-transform', animate ? 'animate-number' : '')}>
        {formattedValue()}
      </span>
    </span>
  );
};
