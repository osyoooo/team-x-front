'use client';

export default function SocialButton({ 
  type = 'apple', // 'apple' | 'google'
  children,
  onClick,
  disabled = false,
  className = '',
  ...props 
}) {
  const getButtonStyles = () => {
    const baseStyles = 'w-full h-10 rounded-full flex items-center justify-center text-xs font-bold transition-opacity duration-200 shadow-sm';
    
    switch (type) {
      case 'apple':
        return `${baseStyles} bg-[#CCCCCC] text-black`;
      case 'google':
        return `${baseStyles} bg-white text-black border border-[#E5E5E5]`;
      default:
        return baseStyles;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getButtonStyles()} ${disabled ? 'opacity-50' : 'hover:opacity-80'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}