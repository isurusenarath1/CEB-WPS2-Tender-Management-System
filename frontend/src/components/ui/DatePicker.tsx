import React from 'react';
import { CalendarIcon } from 'lucide-react';
interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export function DatePicker({
  label,
  error,
  className = '',
  id,
  ...props
}: DatePickerProps) {
  const inputId = id || props.name;
  return <div className="w-full">
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>}
      <div className="relative">
        <input type="date" id={inputId} className={`
            flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50
            [color-scheme:light]
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `} {...props} />
        <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>;
}