import React, { useRef, useState } from 'react';
import { Header } from './components/Header';
import { Editor } from './features/editor/Editor';
import { Preview } from './features/preview/Preview';
import { LatexPreview } from './features/preview/LatexPreview';
import { ResumeProvider } from './context/ResumeContext';
import { Download, FileText, FileCode } from 'lucide-react';
import { Button } from './components/ui/Button';

function ResumeBuilder() {
    const componentRef = useRef();
    const [activeTab, setActiveTab] = useState('editor'); // 'editor' or 'latex'

    const handleDownload = async () => {
        const element = componentRef.current;
        const opt = {
            margin: 0,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const html2pdf = (await import('html2pdf.js')).default;
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            <Header />

            <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 md:p-8 flex flex-col lg:flex-row gap-8">

                {/* Left Side: Editor / LaTeX Toggle */}
                <div className="w-full lg:w-1/2 min-w-[400px] flex flex-col gap-4">

                    {/* Toggle Header */}
                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex justify-center sticky top-24 z-10">
                        <div className="flex bg-slate-100 rounded-lg p-1 w-full sm:w-auto">
                            <button
                                onClick={() => setActiveTab('editor')}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'editor' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <FileText size={16} /> Visual Editor
                            </button>
                            <button
                                onClick={() => setActiveTab('latex')}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'latex' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <FileCode size={16} /> LaTeX Code
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                        {activeTab === 'editor' ? (
                            <Editor />
                        ) : (
                            <LatexPreview />
                        )}
                    </div>
                </div>

                {/* Right Side: Preview (Always Visible) */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center shadow-lg shadow-slate-900/10 sticky top-24 z-10">
                        <span className="font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> Live Preview</span>
                        <Button onClick={handleDownload} className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md flex items-center gap-2 font-medium transition-all">
                            <Download size={16} /> Download PDF
                        </Button>
                    </div>

                    <div className="flex justify-center overflow-hidden pb-12 pt-4">
                        <div className="transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.85] origin-top bg-white shadow-2xl ring-1 ring-slate-900/5">
                            <Preview ref={componentRef} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function App() {
    return (
        <ResumeProvider>
            <ResumeBuilder />
        </ResumeProvider>
    );
}

export default App;
