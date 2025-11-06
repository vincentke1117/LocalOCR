
import React, { useEffect, useState } from 'react';
import { ICONS, IconType } from '../constants';

interface ToastProps {
  message: string;
  type?: IconType;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = IconType.SUCCESS, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade-out transition
    }, 2700);

    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  const IconComponent = ICONS[type];
  const colorClasses = type === IconType.SUCCESS 
    ? 'bg-green-500/90 text-white border-green-400' 
    : 'bg-red-500/90 text-white border-red-400';

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-semibold transition-all duration-300 ${colorClasses} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <IconComponent className="w-5 h-5" />
      {message}
    </div>
  );
};
