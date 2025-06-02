import React from 'react';
import { cn } from '../../lib/utils';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  helperText?: string;
  error?: string;
  onChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, error, id, onChange, ...props }, ref) => {
    const checkboxId = id || Math.random().toString(36).substring(2, 9);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.checked);
      }
    };
    
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id={checkboxId}
              type="checkbox"
              className={cn(
                'checkbox',
                error && 'border-error-500',
                className
              )}
              ref={ref}
              onChange={handleChange}
              {...props}
            />
          </div>
          {label && (
            <div className="ml-2 text-sm">
              <label
                htmlFor={checkboxId}
                className={cn('font-medium text-neutral-700', props.disabled && 'opacity-70')}
              >
                {label}
              </label>
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p
            className={cn(
              'text-xs',
              error ? 'text-error-500' : 'text-neutral-500',
              !label && 'mt-0'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;