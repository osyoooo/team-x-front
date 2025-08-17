export default function Spinner({ 
  size = 'md',
  className = ''
}) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const spinnerClasses = [
    'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
    sizes[size],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={spinnerClasses}></div>
  );
}