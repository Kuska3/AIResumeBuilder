import React, { forwardRef } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Mail, Phone, Linkedin, Globe } from 'lucide-react';

export const Preview = forwardRef((props, ref) => {
    const { resumeData } = useResume();
    const { personalInfo, experience, education, skills, projects, certifications, accomplishments, languages } = resumeData;

    return (
        <div ref={ref} className="bg-white w-[210mm] min-h-[297mm] p-[0.8in] shadow-none mx-auto print:w-full print:h-full print:m-0 font-serif text-slate-900 leading-normal">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">{personalInfo.fullName}</h1>
                <div className="flex flex-wrap justify-center gap-x-1 text-[11pt]">
                    {personalInfo.email && (
                        <span>
                            <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                            <span className="mx-1">|</span>
                        </span>
                    )}
                    {personalInfo.phone && (
                        <span>
                            {personalInfo.phone}
                            <span className="mx-1">|</span>
                        </span>
                    )}
                    {personalInfo.linkedin && (
                        <span>
                            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                            <span className="mx-1">|</span>
                        </span>
                    )}
                    {personalInfo.github && (
                        <span>
                            <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                            {personalInfo.portfolio && <span className="mx-1">|</span>}
                        </span>
                    )}
                    {personalInfo.portfolio && (
                        <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="hover:underline">Portfolio</a>
                    )}
                </div>
            </div>

            {/* Summary */}
            {personalInfo.summary && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-black uppercase mb-2 pb-1 tracking-wide">Professional Summary</h2>
                    <p className="text-[11pt] text-justify">{personalInfo.summary}</p>
                </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-black uppercase mb-2 pb-1 tracking-wide">Technical Skills</h2>
                    <div className="text-[11pt]">
                        <span className="font-bold">Languages/Technologies: </span>
                        {skills.join(', ')}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-black uppercase mb-2 pb-1 tracking-wide">Projects</h2>
                    <div className="flex flex-col gap-3">
                        {projects.map((project) => (
                            <div key={project.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-[11pt]">{project.name}</h3>
                                    {project.link && <a href={project.link} className="text-[10pt] italic hover:underline">Link</a>}
                                </div>
                                <p className="text-[11pt] mb-1">{project.description}</p>
                                <div className="text-[10pt] italic">Technologies: {project.techStack}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-black uppercase mb-2 pb-1 tracking-wide">Professional Experience</h2>
                    <div className="flex flex-col gap-4">
                        {experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-[11pt]">{exp.role}</h3>
                                    <span className="text-[10pt] font-medium">{exp.duration}</span>
                                </div>
                                <div className="text-[11pt] font-medium mb-1 italic">{exp.company}</div>
                                <p className="text-[11pt] text-justify whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-black uppercase mb-2 pb-1 tracking-wide">Education</h2>
                    <div className="flex flex-col gap-2">
                        {education.map((edu) => (
                            <div key={edu.id} className="text-[11pt]">
                                <div className="flex justify-between font-bold">
                                    <span>{edu.degree}</span>
                                    <span>{edu.year}</span>
                                </div>
                                <div className="flex justify-between italic">
                                    <span>{edu.school}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-black uppercase mb-2 pb-1 tracking-wide">Certifications</h2>
                    <ul className="list-disc list-outside ml-5 text-[11pt] space-y-0">
                        {certifications.map((cert) => (
                            <li key={cert.id} className="pl-1">
                                <span className="font-medium">{cert.name}</span> — {cert.issuer} ({cert.year})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Accomplishments */}
            {accomplishments && accomplishments.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-black uppercase mb-2 pb-1 tracking-wide">Accomplishments</h2>
                    <ul className="list-disc list-outside ml-5 text-[11pt] space-y-0">
                        {accomplishments.map((acc) => (
                            <li key={acc.id} className="pl-1">
                                <span className="font-bold">{acc.title}</span>: {acc.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold border-b border-black uppercase mb-2 pb-1 tracking-wide">Languages</h2>
                    <ul className="list-disc list-outside ml-5 text-[11pt] space-y-0">
                        {languages.map((lang) => (
                            <li key={lang.id} className="pl-1">
                                <span className="font-medium">{lang.language}</span> ({lang.proficiency})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
});

Preview.displayName = 'Preview';
