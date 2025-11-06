import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { MarkdownPreview } from './components/MarkdownPreview';
import { SettingsModal } from './components/SettingsModal';
import { Toast } from './components/Toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { convertFile } from './services/ocrService';
import { AppState, ProcessableFile, FileStatus } from './types';
import { IconType } from './constants';
import { HomePage } from './components/HomePage';

export default function App() {
  const [view, setView] = useState<'home' | 'app'>('home');
  const [processableFiles, setProcessableFiles] = useState<ProcessableFile[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [apiEndpoint, setApiEndpoint] = useLocalStorage<string>('apiEndpoint', 'http://127.0.0.1:8000/api/convert');
  const [toast, setToast] = useState<{ message: string; type: IconType } | null>(null);

  const showToast = (message: string, type: IconType = IconType.SUCCESS) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFilesSelected = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles: ProcessableFile[] = Array.from(selectedFiles)
      .filter(file => file.type.startsWith('image/') || file.type === 'application/pdf')
      .map(file => ({
        id: crypto.randomUUID(),
        file: file,
        status: FileStatus.PENDING,
      }));
    
    if (newFiles.length > 0) {
      setProcessableFiles(newFiles);
      setAppState(AppState.FILES_LOADED);
      setActiveFileId(null);
    } else {
        showToast('No compatible files (PNG, JPG, PDF) selected.', IconType.ERROR);
    }
  };

  const handleClear = () => {
    setProcessableFiles([]);
    setAppState(AppState.IDLE);
    setActiveFileId(null);
  };
  
  const handleConvert = useCallback(async () => {
    const filesToProcess = processableFiles.filter(pf => pf.status === FileStatus.PENDING);
    if (filesToProcess.length === 0) {
      showToast('No pending files to convert.', IconType.ERROR);
      return;
    }

    setAppState(AppState.PROCESSING);

    for (const pf of filesToProcess) {
      // Set current file to processing
      setProcessableFiles(prev => prev.map(p => p.id === pf.id ? { ...p, status: FileStatus.PROCESSING } : p));
      
      try {
        const result = await convertFile(pf.file, apiEndpoint);
        setProcessableFiles(prev => prev.map(p => p.id === pf.id ? { ...p, status: FileStatus.SUCCESS, markdown: result } : p));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setProcessableFiles(prev => prev.map(p => p.id === pf.id ? { ...p, status: FileStatus.ERROR, error: errorMessage } : p));
      }
    }
    
    setAppState(AppState.DONE);
    showToast('All conversions finished!', IconType.SUCCESS);
  }, [processableFiles, apiEndpoint]);

  const activeFile = processableFiles.find(pf => pf.id === activeFileId);

  if (view === 'home') {
    return <HomePage onGetStarted={() => setView('app')} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />
      
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <FileUpload
          files={processableFiles}
          appState={appState}
          activeFileId={activeFileId}
          onFilesSelect={handleFilesSelected}
          onClear={handleClear}
          onConvert={handleConvert}
          onFileClick={setActiveFileId}
          onCopy={(text) => {
            navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!');
          }}
        />

        <div className="h-full flex flex-col">
          {/* Fix: Removed the incorrect `getAppStateForPreview` function and now pass the active file's status directly. If no file is active, default to `AppState.IDLE`. This corrects the type mismatch that caused compilation errors. */}
          <MarkdownPreview
            markdown={activeFile?.markdown ?? ''}
            state={activeFile?.status ?? AppState.IDLE}
            error={activeFile?.error ?? ''}
            onCopy={() => showToast('Copied to clipboard!')}
          />
        </div>
      </main>

      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          apiEndpoint={apiEndpoint}
          onApiEndpointChange={setApiEndpoint}
        />
      )}
      
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
}