export default function Card({ 
  children, 
  className = '',
  padding = 'p-6',
  ...props 
}) {
  const cardClasses = [
    'bg-white rounded-lg shadow-md',
    padding,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
}