export default function Input({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  className = '',
  ...props 
}) {
  const inputClasses = [
    'w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    error ? 'border-red-300' : 'border-gray-300',
    disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}