import React, { useState, useCallback, useRef } from 'react';
import { ICONS, IconType } from '../constants';
import { IconButton } from './IconButton';
import { ProcessableFile, FileStatus, AppState } from '../types';
import { Loader } from './Loader';

interface FileUploadProps {
    files: ProcessableFile[];
    appState: AppState;
    activeFileId: string | null;
    onFilesSelect: (files: FileList) => void;
    onClear: () => void;
    onConvert: () => void;
    onFileClick: (id: string) => void;
    onCopy: (textToCopy: string) => void;
}

const FileTypeIcon: React.FC<{ file: File; className?: string }> = ({ file, className }) => {
    const Icon = file.type.startsWith('image/') ? ICONS[IconType.IMAGE]
               : file.type === 'application/pdf' ? ICONS[IconType.PDF]
               : ICONS[IconType.UPLOAD];
    return <Icon className={className} />;
};

const StatusIndicator: React.FC<{ status: FileStatus }> = ({ status }) => {
    switch(status) {
        case FileStatus.PENDING:
            return <span className="text-xs font-medium text-slate-400">Pending</span>;
        case FileStatus.PROCESSING:
            return (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-500 border-t-indigo-400 rounded-full animate-spin"></div>
                    <span className="text-xs font-medium text-indigo-300">Converting...</span>
                </div>
            );
        case FileStatus.SUCCESS:
            const SuccessIcon = ICONS[IconType.SUCCESS];
            return <SuccessIcon className="w-5 h-5 text-green-400" />;
        case FileStatus.ERROR:
            const ErrorIcon = ICONS[IconType.ERROR];
            return <ErrorIcon className="w-5 h-5 text-red-400" />;
    }
};

export const FileUpload: React.FC<FileUploadProps> = ({ files, appState, activeFileId, onFilesSelect, onClear, onConvert, onFileClick, onCopy }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) onFilesSelect(e.target.files);
        e.target.value = ''; // Reset input to allow re-selecting the same file/folder
    };
    
    const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); }, []);
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files) onFilesSelect(e.dataTransfer.files);
    }, [onFilesSelect]);

    const handleDownload = (item: ProcessableFile) => {
        if (!item.markdown) return;
        const blob = new Blob([item.markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const baseName = item.file.name.split('.').slice(0, -1).join('.');
        a.download = `${baseName || 'converted'}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const dragClass = isDragging ? 'border-indigo-500 bg-slate-800/50' : 'border-slate-700';
    const hasPendingFiles = files.some(f => f.status === FileStatus.PENDING);

    if (files.length === 0) {
        return (
            <div className="bg-slate-800 rounded-lg p-4 flex flex-col h-full shadow-md">
                 <h2 className="text-lg font-semibold text-slate-200 mb-4">1. Upload Files or Folder</h2>
                 <div
                    className={`flex-grow flex flex-col items-center justify-center p-6 border-2 border-dashed ${dragClass} rounded-lg transition-colors duration-200 text-slate-400`}
                    onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, application/pdf" multiple />
                    <input type="file" ref={folderInputRef} onChange={handleFileChange} className="hidden" {...{ webkitdirectory: "", directory: "" }} />
                    <ICONS.UPLOAD className="w-12 h-12 mb-3 text-slate-500" />
                    <p className="text-center font-semibold">Drag & drop files or a folder here</p>
                    <p className="text-sm mt-2">or</p>
                    <div className="flex gap-4 mt-2">
                        <button onClick={() => fileInputRef.current?.click()} className="font-semibold text-indigo-400 hover:text-indigo-300">Select Files</button>
                        <button onClick={() => folderInputRef.current?.click()} className="font-semibold text-indigo-400 hover:text-indigo-300">Select Folder</button>
                    </div>
                    <p className="text-xs mt-3 text-slate-500">Supports PNG, JPG, PDF</p>
                 </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-lg p-4 flex flex-col h-full shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-200">1. File Queue ({files.length})</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onClear}
                        className="px-3 py-1.5 text-sm bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-500 transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={onConvert}
                        disabled={appState === AppState.PROCESSING || !hasPendingFiles}
                        className="px-5 py-1.5 text-sm bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {appState === AppState.PROCESSING ? 'Converting...' : 'Convert All'}
                    </button>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-2">
                {files.map(item => (
                    <div
                        key={item.id}
                        onClick={() => onFileClick(item.id)}
                        className={`p-3 rounded-lg flex items-center gap-4 cursor-pointer transition-colors ${activeFileId === item.id ? 'bg-indigo-900/50' : 'bg-slate-900/50 hover:bg-slate-700/50'}`}
                    >
                        <FileTypeIcon file={item.file} className="w-8 h-8 text-slate-400 flex-shrink-0"/>
                        <div className="flex-grow overflow-hidden">
                            <p className="text-sm font-medium text-slate-200 truncate" title={item.file.name}>{item.file.name}</p>
                            <p className="text-xs text-slate-400">{ (item.file.size / 1024).toFixed(2) } KB</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <StatusIndicator status={item.status} />
                            {item.status === FileStatus.SUCCESS && item.markdown && (
                                <>
                                    <IconButton icon={IconType.COPY} tooltip="Copy" onClick={(e) => { e.stopPropagation(); onCopy(item.markdown!); }} />
                                    <IconButton icon={IconType.DOWNLOAD} tooltip="Download .md" onClick={(e) => { e.stopPropagation(); handleDownload(item); }} />
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
