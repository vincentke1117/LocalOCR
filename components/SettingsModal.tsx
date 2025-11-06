
import React, { useState } from 'react';
import { ICONS, IconType } from '../constants';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiEndpoint: string;
    onApiEndpointChange: (newEndpoint: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiEndpoint, onApiEndpointChange }) => {
    const [localEndpoint, setLocalEndpoint] = useState(apiEndpoint);

    if (!isOpen) return null;

    const handleSave = () => {
        onApiEndpointChange(localEndpoint);
        onClose();
    };

    const CloseIcon = ICONS[IconType.CLOSE];

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6 border border-slate-700 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Settings</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="api-endpoint" className="block text-sm font-medium text-slate-300 mb-1">
                            Local API Endpoint
                        </label>
                        <input
                            type="text"
                            id="api-endpoint"
                            value={localEndpoint}
                            onChange={(e) => setLocalEndpoint(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-slate-100 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., http://127.0.0.1:8000/api/convert"
                        />
                         <p className="text-xs text-slate-500 mt-2">
                            The URL of your local Python server that handles the OCR processing.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-500 transition-colors"
                    >
                        Cancel
                    </button>
                     <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
