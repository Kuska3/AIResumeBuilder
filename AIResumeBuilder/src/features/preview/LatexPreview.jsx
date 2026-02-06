import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { generateLatex } from '../../utils/latexGenerator';
import { Button } from '../../components/ui/Button';
import { Copy, Download, Check } from 'lucide-react';
import { TextArea } from '../../components/ui/Input';

export const LatexPreview = () => {
    const { resumeData, setResumeData } = useResume();
    const [latexCode, setLatexCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Initial load
    useEffect(() => {
        if (!isEditing) {
            setLatexCode(generateLatex(resumeData));
        }
    }, [resumeData, isEditing]);

    const handleCopy = () => {
        navigator.clipboard.writeText(latexCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([latexCode], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "resume.tex";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // Debounce parse
    useEffect(() => {
        if (!isEditing) return;

        const timer = setTimeout(() => {
            if (latexCode) {
                try {
                    // Import inside effect to avoid circular dependency issues if any, 
                    // though usually fine. Here strictly using the utility.
                    const { parseLatex } = require('../../utils/latexParser');
                    // Note: Vite uses ESM, require might fail if not careful. Changing to static import above.
                } catch (e) { }

                // Using the imported function directly
                import('../../utils/latexParser').then(({ parseLatex }) => {
                    const newData = parseLatex(latexCode, resumeData);
                    setResumeData(newData);
                    setIsEditing(false); // Done editing for this chunk
                });
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [latexCode, isEditing]);

    const handleChange = (e) => {
        setIsEditing(true);
        setLatexCode(e.target.value);
    };

    return (
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[800px]">
            <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
                <span className="text-slate-300 font-mono text-sm">resume.tex</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white">
                        {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                        {copied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button size="sm" onClick={handleDownload} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Download size={14} className="mr-1" /> Download .tex
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-0 relative">
                <textarea
                    value={latexCode}
                    onChange={handleChange}
                    className="w-full h-full bg-[#1e1e1e] text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none"
                    spellCheck="false"
                />
            </div>
        </div>
    );
};
