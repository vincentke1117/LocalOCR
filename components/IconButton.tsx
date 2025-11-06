
import React from 'react';
import { ICONS, IconType } from '../constants';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType;
  tooltip: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, tooltip, ...props }) => {
  const IconComponent = ICONS[icon];

  return (
    <div className="relative group">
      <button
        {...props}
        className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-800"
      >
        <IconComponent className="w-5 h-5" />
      </button>
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-950 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tooltip}
      </div>
    </div>
  );
};
