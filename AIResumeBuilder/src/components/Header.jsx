import React, { useState } from 'react';
import { Settings, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useResume } from '../context/ResumeContext';

export const Header = () => {
    const { apiKey, saveApiKey } = useResume();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempKey, setTempKey] = useState(apiKey);

    const handleSave = () => {
        saveApiKey(tempKey);
        setIsModalOpen(false);
    };

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-3 text-indigo-600">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <FileText size={24} className="text-indigo-600" />
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                    AI Resume Builder
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Settings size={18} />
                    {apiKey ? 'Settings' : 'Set API Key'}
                </Button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Gemini API Configuration"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-gray-600">
                        Enter your Google Gemini API Key to enable AI features. The key is stored locally in your browser.
                    </p>
                    <Input
                        label="API Key"
                        value={tempKey}
                        onChange={(e) => setTempKey(e.target.value)}
                        placeholder="AIzaSy..."
                        type="password"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Key</Button>
                    </div>
                </div>
            </Modal>
        </header>
    );
};
