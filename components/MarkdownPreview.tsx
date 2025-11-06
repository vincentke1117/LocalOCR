
import React from 'react';
// Fix: Import `FileStatus` and use it for the component's state, as it accurately represents the status of a single file.
import { AppState, FileStatus } from '../types';
import { Loader } from './Loader';
import { IconButton } from './IconButton';
import { ICONS, IconType } from '../constants';

interface MarkdownPreviewProps {
  markdown: string;
  // Fix: The state prop is now typed to accept a `FileStatus` or the idle app state, resolving the type error.
  state: FileStatus | AppState.IDLE;
  error: string;
  onCopy: () => void;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown, state, error, onCopy }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    onCopy();
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const renderContent = () => {
    // Fix: Switched cases from `AppState` to `FileStatus` where appropriate to match the new state prop type.
    switch (state) {
      case FileStatus.PROCESSING:
        return <Loader message="Analyzing document with PaddleOCR..." />;
      case FileStatus.ERROR:
        const ErrorIcon = ICONS[IconType.ERROR];
        return (
          <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-4">
            <ErrorIcon className="w-16 h-16 mb-4" />
            <p className="font-semibold text-lg">Conversion Failed</p>
            <p className="text-sm text-red-300 max-w-md break-words">{error}</p>
          </div>
        );
      case FileStatus.SUCCESS:
        return (
          <pre className="whitespace-pre-wrap break-words text-sm p-4 font-mono">
            <code>{markdown}</code>
          </pre>
        );
      case AppState.IDLE:
      case FileStatus.PENDING:
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <p className="font-semibold text-lg">Markdown Output</p>
            <p className="text-sm">Select a successfully converted file from the queue to preview its content here.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg flex flex-col flex-grow shadow-md relative">
      <div className="flex items-center justify-between p-2 border-b border-slate-700">
        <h2 className="text-lg font-semibold text-slate-200 px-2">2. Preview</h2>
        {/* Fix: Check against `FileStatus.SUCCESS` to correctly show buttons when a file has been successfully processed. */}
        {state === FileStatus.SUCCESS && (
          <div className="flex items-center gap-1">
            <IconButton icon={IconType.COPY} onClick={handleCopy} tooltip="Copy Markdown" />
            <IconButton icon={IconType.DOWNLOAD} onClick={handleDownload} tooltip="Download .md file" />
          </div>
        )}
      </div>
      <div className="flex-grow overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};
