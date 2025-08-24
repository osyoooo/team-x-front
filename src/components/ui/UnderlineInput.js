'use client';

import { useState } from 'react';

export default function UnderlineInput({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  error = '',
  placeholder = '',
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      <label 
        htmlFor={name}
        className="block text-xs text-black mb-6"
      >
        {label}
      </label>
      
      {/* Input */}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) {
              onBlur(e);
            }
          }}
          placeholder={placeholder}
          className={`
            w-full 
            bg-transparent 
            border-0 
            border-b-2 
            ${error ? 'border-red-500' : 'border-black'} 
            focus:outline-none 
            focus:border-black 
            pb-2 
            text-black 
            text-base
            placeholder:text-gray-400
            ${isFocused ? 'border-black' : ''}
          `}
          {...props}
        />
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}