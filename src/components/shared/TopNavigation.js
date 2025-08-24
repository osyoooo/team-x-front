'use client';

import { useRouter } from 'next/navigation';

export default function TopNavigation({ showBack = true, title = '', showPageTitle = false, showPageDetail = false, showSearchBar = false }) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative w-full bg-white">
      {/* iOS Status Bar Simulation - Only on mobile */}
      <div className="h-11 flex justify-between items-start px-5 pt-3 sm:hidden">
        {/* Left Side - Time */}
        <div className="text-sm font-semibold text-black">
          9:41
        </div>
        
        {/* Right Side - Status Icons */}
        <div className="flex items-center space-x-1">
          {/* Signal */}
          <div className="w-4 h-3 flex items-end space-x-px">
            <div className="w-1 h-1 bg-black rounded-full"></div>
            <div className="w-1 h-1.5 bg-black rounded-full"></div>
            <div className="w-1 h-2 bg-black rounded-full"></div>
            <div className="w-1 h-2.5 bg-black rounded-full"></div>
          </div>
          
          {/* WiFi */}
          <div className="w-4 h-3 relative">
            <div className="absolute inset-0">
              <svg viewBox="0 0 15 11" className="w-full h-full">
                <path d="M0 6.5C3.5 3 11.5 3 15 6.5" stroke="black" strokeWidth="1" fill="none" />
                <path d="M3 8.5C5.5 6 9.5 6 12 8.5" stroke="black" strokeWidth="1" fill="none" />
                <circle cx="7.5" cy="9.5" r="1" fill="black" />
              </svg>
            </div>
          </div>
          
          {/* Battery */}
          <div className="w-6 h-3 relative">
            <div className="w-5 h-3 border border-black rounded-sm relative">
              <div className="w-4 h-2 bg-black rounded-sm absolute left-0.5 top-0.5"></div>
            </div>
            <div className="w-0.5 h-1.5 bg-black rounded-r absolute right-0 top-0.75"></div>
          </div>
        </div>
      </div>
      
      {/* Back Button */}
      {showBack && (
        <button 
          onClick={handleBack}
          className="absolute left-5 top-16 sm:top-4 w-6 h-6 flex items-center justify-center z-10"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path 
              d="M15 6L1 6M1 6L6 1M1 6L6 11" 
              stroke="black" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      
      {/* Desktop padding for back button area */}
      <div className="hidden sm:block h-12"></div>
    </div>
  );
}