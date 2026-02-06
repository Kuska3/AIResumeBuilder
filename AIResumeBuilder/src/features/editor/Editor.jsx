import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input, TextArea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Wand2, Plus, Trash2, X } from 'lucide-react';
import {
    generateContent,
    generateSummaryPrompt,
    enhanceDescriptionPrompt,
    generateProjectDescriptionPrompt,
    generateAccomplishmentPrompt,
    generateSkillsPrompt
} from '../../services/gemini';

export const Editor = () => {
    const { resumeData, updatePersonalInfo, updateSection, apiKey } = useResume();
    const [loading, setLoading] = useState(false);

    // --- AI Handlers ---
    const handleGenerateSummary = async () => {
        if (!apiKey) return alert("Please set API Key first!");
        setLoading(true);
        try {
            const prompt = generateSummaryPrompt(resumeData.personalInfo.title, JSON.stringify(resumeData.experience));
            const summary = await generateContent(apiKey, prompt);
            updatePersonalInfo('summary', summary);
        } catch (error) {
            alert(error.message);
        }
        setLoading(false);
    };

    const handleEnhanceDescription = async (section, id, text) => {
        if (!apiKey) return alert("Please set API Key first!");
        if (!text) return;
        setLoading(true);
        try {
            const prompt = enhanceDescriptionPrompt(text);
            const enhanced = await generateContent(apiKey, prompt);
            const newSectionData = resumeData[section].map(item =>
                item.id === id ? { ...item, description: enhanced } : item
            );
            updateSection(section, newSectionData);
        } catch (error) {
            alert(error.message);
        }
        setLoading(false);
    };

    const handleEnhanceProject = async (id, name, techStack, description) => {
        if (!apiKey) return alert("Please set API Key first!");
        setLoading(true);
        try {
            const prompt = generateProjectDescriptionPrompt(name, techStack, description);
            const enhanced = await generateContent(apiKey, prompt);
            const newProjects = resumeData.projects.map(item =>
                item.id === id ? { ...item, description: enhanced } : item
            );
            updateSection('projects', newProjects);
        } catch (error) {
            alert(error.message);
        }
        setLoading(false);
    };

    const handleEnhanceAccomplishment = async (id, title, description) => {
        if (!apiKey) return alert("Please set API Key first!");
        setLoading(true);
        try {
            const prompt = generateAccomplishmentPrompt(title, description);
            const enhanced = await generateContent(apiKey, prompt);
            const newAccomplishments = resumeData.accomplishments.map(item =>
                item.id === id ? { ...item, description: enhanced } : item
            );
            updateSection('accomplishments', newAccomplishments);
        } catch (error) {
            alert(error.message);
        }
        setLoading(false);
    };

    const handleSuggestSkills = async () => {
        if (!apiKey) return alert("Please set API Key first!");
        if (!resumeData.personalInfo.title) return alert("Please enter a Job Title first!");
        setLoading(true);
        try {
            const prompt = generateSkillsPrompt(resumeData.personalInfo.title);
            const result = await generateContent(apiKey, prompt);
            const newSkills = result.split(',').map(s => s.trim()).filter(s => s);
            // Merge unique skills
            const uniqueSkills = [...new Set([...resumeData.skills, ...newSkills])];
            updateSection('skills', uniqueSkills);
        } catch (error) {
            alert(error.message);
        }
        setLoading(false);
    };

    // --- Generic Handlers ---
    const handleAddItem = (section, initialItem) => {
        updateSection(section, [...resumeData[section], { id: Date.now(), ...initialItem }]);
    };

    const handleUpdateItem = (section, id, field, value) => {
        const newData = resumeData[section].map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        updateSection(section, newData);
    };

    const handleRemoveItem = (section, id) => {
        const newData = resumeData[section].filter(item => item.id !== id);
        updateSection(section, newData);
    };

    // --- Skills Handler ---
    const handleAddSkill = () => {
        const skill = prompt("Enter a skill:");
        if (skill) updateSection('skills', [...resumeData.skills, skill]);
    };

    const handleRemoveSkill = (skillToRemove) => {
        updateSection('skills', resumeData.skills.filter(skill => skill !== skillToRemove));
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-20">
            {/* Personal Info */}
            <Card>
                <CardHeader><h2 className="text-lg font-semibold text-slate-800">Personal Information</h2></CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Full Name" value={resumeData.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                        <Input label="Job Title" value={resumeData.personalInfo.title} onChange={(e) => updatePersonalInfo('title', e.target.value)} />
                    </div>
                    <Input label="Email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                    <Input label="Phone" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="LinkedIn" value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
                        <Input label="GitHub" value={resumeData.personalInfo.github} onChange={(e) => updatePersonalInfo('github', e.target.value)} />
                    </div>
                    <Input label="Portfolio" value={resumeData.personalInfo.portfolio} onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} />
                    <div className="relative">
                        <TextArea label="Professional Summary" value={resumeData.personalInfo.summary} onChange={(e) => updatePersonalInfo('summary', e.target.value)} />
                        <Button
                            variant="magic"
                            size="sm"
                            className="absolute right-2 top-0 text-xs py-1 px-2 h-auto"
                            onClick={handleGenerateSummary}
                            disabled={loading}
                        >
                            {loading ? '...' : <><Wand2 size={12} className="inline mr-1" /> AI Generate</>}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Experience */}
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">Experience</h2>
                    <Button variant="outline" onClick={() => handleAddItem('experience', { company: '', role: '', duration: '', description: '' })} className="text-sm py-1"><Plus size={16} /> Add</Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0 relative group">
                            <button onClick={() => handleRemoveItem('experience', exp.id)} className="absolute -right-2 -top-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <Input label="Company" value={exp.company} onChange={(e) => handleUpdateItem('experience', exp.id, 'company', e.target.value)} />
                                <Input label="Role" value={exp.role} onChange={(e) => handleUpdateItem('experience', exp.id, 'role', e.target.value)} />
                                <Input label="Duration" value={exp.duration} onChange={(e) => handleUpdateItem('experience', exp.id, 'duration', e.target.value)} />
                            </div>
                            <div className="relative">
                                <TextArea label="Description" value={exp.description} onChange={(e) => handleUpdateItem('experience', exp.id, 'description', e.target.value)} />
                                <Button
                                    variant="magic"
                                    className="absolute right-2 top-0 text-xs py-1 px-2 h-auto"
                                    onClick={() => handleEnhanceDescription('experience', exp.id, exp.description)}
                                    disabled={loading}
                                >
                                    <Wand2 size={12} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Education */}
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">Education</h2>
                    <Button variant="outline" onClick={() => handleAddItem('education', { school: '', degree: '', year: '' })} className="text-sm py-1"><Plus size={16} /> Add</Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {resumeData.education.map((edu) => (
                        <div key={edu.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0 relative">
                            <button onClick={() => handleRemoveItem('education', edu.id)} className="absolute -right-2 -top-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="School" value={edu.school} onChange={(e) => handleUpdateItem('education', edu.id, 'school', e.target.value)} />
                                <Input label="Degree" value={edu.degree} onChange={(e) => handleUpdateItem('education', edu.id, 'degree', e.target.value)} />
                                <Input label="Year" value={edu.year} onChange={(e) => handleUpdateItem('education', edu.id, 'year', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Skills */}
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-slate-800">Skills</h2>
                        <Button variant="magic" size="sm" onClick={handleSuggestSkills} disabled={loading} className="text-xs py-1 px-2 h-auto">
                            <Wand2 size={12} className="mr-1 inline" /> Suggest
                        </Button>
                    </div>
                    <Button variant="outline" onClick={handleAddSkill} className="text-sm py-1"><Plus size={16} /> Add</Button>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, idx) => (
                            <span key={idx} className="bg-slate-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {skill}
                                <button onClick={() => handleRemoveSkill(skill)} className="text-slate-400 hover:text-red-500"><X size={14} /></button>
                            </span>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Projects */}
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">Projects</h2>
                    <Button variant="outline" onClick={() => handleAddItem('projects', { name: '', techStack: '', link: '', description: '' })} className="text-sm py-1"><Plus size={16} /> Add</Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    {resumeData.projects?.map((project) => (
                        <div key={project.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0 relative">
                            <button onClick={() => handleRemoveItem('projects', project.id)} className="absolute -right-2 -top-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <Input label="Project Name" value={project.name} onChange={(e) => handleUpdateItem('projects', project.id, 'name', e.target.value)} />
                                <Input label="Tech Stack" value={project.techStack} onChange={(e) => handleUpdateItem('projects', project.id, 'techStack', e.target.value)} />
                                <Input label="Link" value={project.link} onChange={(e) => handleUpdateItem('projects', project.id, 'link', e.target.value)} />
                            </div>
                            <div className="relative">
                                <TextArea label="Description" value={project.description} onChange={(e) => handleUpdateItem('projects', project.id, 'description', e.target.value)} />
                                <Button
                                    variant="magic"
                                    className="absolute right-2 top-0 text-xs py-1 px-2 h-auto"
                                    onClick={() => handleEnhanceProject(project.id, project.name, project.techStack, project.description)}
                                    disabled={loading}
                                >
                                    <Wand2 size={12} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Certifications */}
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">Certifications</h2>
                    <Button variant="outline" onClick={() => handleAddItem('certifications', { name: '', issuer: '', year: '' })} className="text-sm py-1"><Plus size={16} /> Add</Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {resumeData.certifications?.map((cert) => (
                        <div key={cert.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0 relative">
                            <button onClick={() => handleRemoveItem('certifications', cert.id)} className="absolute -right-2 -top-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Certification Name" value={cert.name} onChange={(e) => handleUpdateItem('certifications', cert.id, 'name', e.target.value)} />
                                <Input label="Issuer" value={cert.issuer} onChange={(e) => handleUpdateItem('certifications', cert.id, 'issuer', e.target.value)} />
                                <Input label="Year" value={cert.year} onChange={(e) => handleUpdateItem('certifications', cert.id, 'year', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Accomplishments */}
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">Accomplishments</h2>
                    <Button variant="outline" onClick={() => handleAddItem('accomplishments', { title: '', description: '' })} className="text-sm py-1"><Plus size={16} /> Add</Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {resumeData.accomplishments?.map((acc) => (
                        <div key={acc.id} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0 relative">
                            <button onClick={() => handleRemoveItem('accomplishments', acc.id)} className="absolute -right-2 -top-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                            <Input label="Title" value={acc.title} onChange={(e) => handleUpdateItem('accomplishments', acc.id, 'title', e.target.value)} />
                            <div className="relative mt-2">
                                <TextArea label="Description" value={acc.description} onChange={(e) => handleUpdateItem('accomplishments', acc.id, 'description', e.target.value)} />
                                <Button
                                    variant="magic"
                                    className="absolute right-2 top-0 text-xs py-1 px-2 h-auto"
                                    onClick={() => handleEnhanceAccomplishment(acc.id, acc.title, acc.description)}
                                    disabled={loading}
                                >
                                    <Wand2 size={12} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Languages */}
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-800">Languages</h2>
                    <Button variant="outline" onClick={() => handleAddItem('languages', { language: '', proficiency: '' })} className="text-sm py-1"><Plus size={16} /> Add</Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {resumeData.languages?.map((lang) => (
                        <div key={lang.id} className="grid grid-cols-2 gap-4 relative">
                            <button onClick={() => handleRemoveItem('languages', lang.id)} className="absolute -right-2 top-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                            <Input label="Language" value={lang.language} onChange={(e) => handleUpdateItem('languages', lang.id, 'language', e.target.value)} />
                            <Input label="Proficiency" value={lang.proficiency} onChange={(e) => handleUpdateItem('languages', lang.id, 'proficiency', e.target.value)} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};
