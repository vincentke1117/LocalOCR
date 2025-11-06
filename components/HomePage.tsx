import React from 'react';
import { ICONS, IconType } from '../constants';

interface HomePageProps {
    onGetStarted: () => void;
}

const FeatureCard: React.FC<{ icon: IconType; title: string; children: React.ReactNode }> = ({ icon, title, children }) => {
    const Icon = ICONS[icon];
    return (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700/50 shadow-lg">
            <div className="flex items-center gap-4 mb-3">
                <div className="bg-slate-700/50 p-2 rounded-md">
                    <Icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
        </div>
    );
};


export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
    return (
        <div className="bg-slate-900 text-slate-200 font-sans">
            <header className="bg-slate-900/70 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-20">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                        <h1 className="text-xl font-bold text-slate-100">
                            Local Markdown Converter
                        </h1>
                    </div>
                </div>
            </header>
            
            <main>
                <section className="relative overflow-hidden py-20 md:py-32 text-center border-b border-slate-800">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/30 to-slate-900 pointer-events-none"></div>
                    <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-100 leading-tight tracking-tight">
                            Unlock Your Documents
                        </h1>
                        <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-slate-400">
                            Convert images and PDFs to high-quality Markdown entirely on your device. No uploads, no privacy concerns. Just fast, accurate, offline conversion.
                        </p>
                        <button
                            onClick={onGetStarted}
                            className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md text-lg hover:bg-indigo-500 transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/20"
                        >
                            Launch App
                        </button>
                    </div>
                </section>

                <section id="features" className="py-16 md:py-24 bg-slate-900">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-100">Why Choose This Converter?</h2>
                            <p className="mt-3 max-w-2xl mx-auto text-slate-400">
                                Built for developers, writers, and anyone who values privacy and efficiency.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                           <FeatureCard icon={IconType.LOCK} title="100% Private & Offline">
                                All file processing happens locally on your machine. Your data never leaves your computer, ensuring complete privacy and security.
                            </FeatureCard>
                             <FeatureCard icon={IconType.CPU_CHIP} title="Powerful Local OCR">
                                Leveraging the advanced PaddleOCR engine, it accurately recognizes text, lists, and tables, preserving your document's structure.
                            </FeatureCard>
                            <FeatureCard icon={IconType.FOLDER} title="Batch Processing">
                                Save time by converting multiple files or entire folders at once. Our queueing system handles the workload efficiently.
                            </FeatureCard>
                             <FeatureCard icon={IconType.MARKDOWN} title="Clean Markdown Output">
                                Get structured, readable Markdown ready for your notes, documentation, or CMS. Copy to clipboard or download as a `.md` file.
                            </FeatureCard>
                            <FeatureCard icon={IconType.FILE_TYPES} title="Broad File Support">
                                Easily convert common image formats (PNG, JPG) and multi-page PDF documents.
                            </FeatureCard>
                            <FeatureCard icon={IconType.SETTINGS} title="Simple & Configurable">
                                A clean, no-fuss interface that gets the job done. Configure your local API endpoint with ease.
                            </FeatureCard>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 border-t border-slate-800">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Local Markdown Converter. All processing is done on your device.</p>
                </div>
            </footer>
        </div>
    );
};
