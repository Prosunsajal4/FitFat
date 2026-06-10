import { useState } from 'react';

export default function Tooltip({ children, text, position = 'top' }) {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && text && (
        <div className={`absolute ${positionClasses[position]} z-50 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white whitespace-nowrap pointer-events-none`}>
          {text}
        </div>
      )}
    </div>
  );
}
