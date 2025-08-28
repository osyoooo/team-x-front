'use client';

export default function ProfileBubble({ message, position = 'left', className = '' }) {
  const positionClasses = {
    left: 'rounded-lg rounded-bl-none',
    right: 'rounded-lg rounded-br-none'
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`bg-white/60 backdrop-blur-sm border border-black px-4 py-5 shadow-lg ${positionClasses[position]}`}
      >
        <p className="text-xs font-bold text-black">{message}</p>
      </div>
    </div>
  );
}