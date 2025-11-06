
import React from 'react';
import { ICONS, IconType } from '../constants';
import { IconButton } from './IconButton';

interface HeaderProps {
    onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
    const SettingsIcon = ICONS[IconType.SETTINGS];

    return (
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                     <svg className="w-8 h-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                    <h1 className="text-xl font-bold text-slate-100">
                        Local Markdown Converter
                    </h1>
                </div>
                <IconButton
                    onClick={onSettingsClick}
                    icon={IconType.SETTINGS}
                    tooltip="Settings"
                />
            </div>
        </header>
    );
};
