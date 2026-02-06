import React, { createContext, useContext, useState, useEffect } from 'react';

const ResumeContext = createContext();

export const useResume = () => {
    const context = useContext(ResumeContext);
    if (!context) {
        throw new Error('useResume must be used within a ResumeProvider');
    }
    return context;
};

export const ResumeProvider = ({ children }) => {
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');

    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: 'Kushagra Sharma',
            title: 'Aspiring Full-Stack Developer',
            email: 'kushagrasharma833@gmail.com',
            phone: '+91-8839635144',
            linkedin: 'https://linkedin.com/in/kuska3',
            github: 'https://github.com/Kuska3',
            portfolio: '',
            summary: 'Aspiring Full-Stack Developer with experience building responsive web applications using React, Node.js, and RESTful APIs. Strong in backend development, database integration, and cloud fundamentals.'
        },
        experience: [
            {
                id: 1,
                role: 'Software Engineering Job Simulation',
                company: 'Electronic Arts',
                duration: '2023',
                description: 'Completed job simulation involving C++ and game development concepts.'
            }
        ],
        education: [
            {
                id: 1,
                school: 'Sagar Group of Institution',
                degree: 'Master of Computer Applications (MCA)',
                year: 'CGPA: 8.73 / 10'
            },
            {
                id: 2,
                school: 'Jiwaji University',
                degree: 'Bachelor of Science (B.Sc.)',
                year: '67.40%'
            }
        ],
        skills: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB', 'SQL', 'AWS', 'Git'],
        certifications: [
            { id: 1, name: 'Google Arcade Program (GAP)', issuer: 'Google', year: '2023' },
            { id: 2, name: 'AWS Cloud Technical Essentials', issuer: 'Amazon Web Services', year: '2023' }
        ],
        projects: [
            {
                id: 1,
                name: 'AI Resume Builder',
                techStack: 'React.js, Tailwind CSS, Eraser AI',
                link: '',
                description: 'AI-powered resume generator integrating Strapi CMS with Eraser AI API. Designed using basic system design principles that include client-server architecture.'
            },
            {
                id: 2,
                name: 'E-commerce Platform',
                techStack: 'HTML5, CSS, JavaScript, Node.js',
                link: '',
                description: 'Developed a responsive grocery shopping platform with 10+ products, cart functionality, secure checkout, and scalable backend architecture.'
            }
        ],
        accomplishments: [
            { id: 1, title: 'Division-Level Football Player', description: 'Inter-Divisional Tournament' }
        ],
        languages: [
            { id: 1, language: 'English', proficiency: 'Fluent' },
            { id: 2, language: 'Hindi', proficiency: 'Native' }
        ]
    });

    const updatePersonalInfo = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const updateSection = (section, data) => {
        setResumeData(prev => ({
            ...prev,
            [section]: data
        }));
    };

    const saveApiKey = (key) => {
        setApiKey(key);
        localStorage.setItem('gemini_api_key', key);
    };

    return (
        <ResumeContext.Provider value={{ apiKey, saveApiKey, resumeData, updatePersonalInfo, updateSection, setResumeData }}>
            {children}
        </ResumeContext.Provider>
    );
};
