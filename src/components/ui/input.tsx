import * as React from 'react';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  unit?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, unit, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;
    return (
      <div className="w-full relative">
        {StartIcon && (
          <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2">
            <StartIcon size={17} className="text-card-foreground" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            startIcon ? 'pl-10' : '',
            endIcon ? 'pr-9' : '',
            className,
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <EndIcon className="text-muted-foreground" size={18} />
          </div>
        )}
        {unit && (
          <div className="absolute rounded-r-lg right-0  top-1/2 transform -translate-y-1/2  flex h-full items-center justify-center bg-muted-foreground/20">
            <span className="text-muted-foreground text-sm flex items-center px-5 justify-center">
              {unit}
            </span>
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
