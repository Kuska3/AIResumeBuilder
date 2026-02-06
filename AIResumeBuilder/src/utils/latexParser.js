export const parseLatex = (latex, currentData) => {
    if (!latex) return currentData;

    const newData = { ...currentData };

    // Helper to remove LaTeX formatting
    const cleanText = (text) => {
        if (!text) return '';
        return text
            .replace(/\\textbf{([^}]*)}/g, '$1')
            .replace(/\\textit{([^}]*)}/g, '$1')
            .replace(/\\href{[^}]*}{([^}]*)}/g, '$1') // Keep text of link
            .replace(/\\href{([^}]*)}{[^}]*}/g, '$1') // Keep URL if just link
            .replace(/\\&/g, '&')
            .replace(/\\%/g, '%')
            .replace(/\\$/g, '$')
            .replace(/\\#/g, '#')
            .replace(/\\_/g, '_')
            .replace(/\\{/g, '{')
            .replace(/\\}/g, '}')
            .replace(/\\textasciitilde{}/g, '~')
            .replace(/\\textasciicircum{}/g, '^')
            .replace(/\\\\/g, '')
            .trim();
    };

    // 1. Parse Header
    try {
        const headerMatch = latex.match(/\\begin{center}([\s\S]*?)\\end{center}/);
        if (headerMatch) {
            const headerContent = headerMatch[1];

            // Name
            const nameMatch = headerContent.match(/\\huge \\textbf{([^}]*)}/i) || headerContent.match(/\\Huge \\textbf{([^}]*)}/i);
            if (nameMatch) newData.personalInfo.fullName = cleanText(nameMatch[1]);

            // Links/Contact
            // Simple split by | or newlines to find parts
            const parts = headerContent.split(/[|\\]+/).map(p => p.trim()).filter(p => p);

            parts.forEach(part => {
                if (part.includes('@')) {
                    // Email
                    const emailMatch = part.match(/mailto:([^}]*)/);
                    if (emailMatch) newData.personalInfo.email = emailMatch[1];
                    else newData.personalInfo.email = cleanText(part);
                } else if (part.match(/\d{3,}/)) {
                    // Potential Phone (simple heuristic)
                    if (!part.includes('http')) {
                        newData.personalInfo.phone = cleanText(part);
                    }
                } else if (part.toLowerCase().includes('linkedin')) {
                    // LinkedIn
                    const linkMatch = part.match(/\\href{([^}]*)}/);
                    if (linkMatch) newData.personalInfo.linkedin = linkMatch[1];
                } else if (part.toLowerCase().includes('github')) {
                    // GitHub
                    const linkMatch = part.match(/\\href{([^}]*)}/);
                    if (linkMatch) newData.personalInfo.github = linkMatch[1];
                } else if (part.toLowerCase().includes('portfolio')) {
                    // Portfolio
                    const linkMatch = part.match(/\\href{([^}]*)}/);
                    if (linkMatch) newData.personalInfo.portfolio = linkMatch[1];
                }
            });
        }
    } catch (e) { console.error("Error parsing header", e); }

    // Helper to get section content
    const getSectionContent = (sectionName) => {
        const regex = new RegExp(`\\\\section{${sectionName}}([\\s\\S]*?)(?=\\\\section|\\\\end{document})`, 'i');
        const match = latex.match(regex);
        return match ? match[1] : null;
    };

    // 2. Parse Summary
    const summaryContent = getSectionContent('Professional Summary');
    if (summaryContent) {
        newData.personalInfo.summary = cleanText(summaryContent);
    }

    // 3. Parse Sections with Items (Experience, Projects, etc.)
    const parseListSection = (sectionName) => {
        const content = getSectionContent(sectionName);
        if (!content) return null;

        const items = [];
        // Split by \item, ignoring the first empty split
        const rawItems = content.split('\\item').slice(1);

        rawItems.forEach((rawItem, index) => {
            const lines = rawItem.split('\n').map(l => l.trim()).filter(l => l);
            // Heuristic Parsing based on our generator structure
            // Line 1: \textbf{Role/Title} \hfill Date | Link
            // Line 2: \textit{Company/Tech}
            // Line 3+: Description

            let item = { id: index + 1 }; // Reset IDs

            if (lines.length > 0) {
                // Parse Line 1
                const line1 = lines[0];
                const boldMatch = line1.match(/\\textbf{([^}]*)}/);
                if (boldMatch) {
                    if (sectionName === 'Projects' || sectionName === 'Accomplishments' || sectionName === 'Certifications') {
                        item.name = cleanText(boldMatch[1]); // Projects/Certs use name/title
                        item.title = cleanText(boldMatch[1]);
                    } else {
                        item.role = cleanText(boldMatch[1]); // Experience uses role
                    }
                }

                // Date implies \hfill
                if (line1.includes('\\hfill')) {
                    const parts = line1.split('\\hfill');
                    if (parts[1]) {
                        if (sectionName === 'Education') item.year = cleanText(parts[1]);
                        else if (sectionName === 'Certifications') item.year = cleanText(parts[1].replace(/[()]/g, ''));
                        else item.duration = cleanText(parts[1]);
                    }
                }

                // Link implies \href
                const linkMatch = line1.match(/\\href{([^}]*)}/);
                if (linkMatch) item.link = linkMatch[1];
            }

            if (lines.length > 1) {
                // Parse Line 2 (Italic usually)
                const line2 = lines[1];
                const italicMatch = line2.match(/\\textit{([^}]*)}/);
                if (italicMatch) {
                    if (sectionName === 'Projects') item.techStack = cleanText(italicMatch[1]);
                    else if (sectionName === 'Experience') item.company = cleanText(italicMatch[1]);
                    else if (sectionName === 'Education') item.school = cleanText(italicMatch[1]);
                }
            }

            // Description is roughly everything else
            let descLines = lines;
            if (lines.length > 2 && sectionName !== 'Accomplishments') {
                descLines = lines.slice(2);
            } else if (sectionName === 'Accomplishments' && lines.length > 0) {
                // Accomplishments format: \textbf{Title}: Description
                const parts = lines[0].split(':');
                if (parts.length > 1) item.description = cleanText(parts.slice(1).join(':'));
                descLines = [];
            }

            if (descLines.length > 0 && !item.description) {
                item.description = cleanText(descLines.join(' '));
            }

            items.push(item);
        });

        return items;
    };

    // Update Sections
    const exp = parseListSection('Professional Experience');
    if (exp) newData.experience = exp;

    const proj = parseListSection('Projects');
    if (proj) newData.projects = proj;

    const edu = parseListSection('Education');
    if (edu) newData.education = edu;

    const certs = parseListSection('Certifications');
    if (certs) newData.certifications = certs;

    // Skills
    const skillsContent = getSectionContent('Technical Skills');
    if (skillsContent) {
        // Expected: \textbf{Languages/Technologies}: Skill1, Skill2
        const parts = skillsContent.split(':');
        if (parts.length > 1) {
            const rawSkills = parts[1].split(',');
            newData.skills = rawSkills.map(s => cleanText(s)).filter(s => s);
        }
    }

    // Languages - Basic list
    const langContent = getSectionContent('Languages');
    if (langContent) {
        const rawItems = langContent.split('\\item').slice(1);
        const langs = rawItems.map((raw, idx) => {
            const parts = raw.replace(/[()]/g, '').split(' '); // Rough split
            // Try to extract bold for language name
            const boldMatch = raw.match(/\\textbf{([^}]*)}/);
            const name = boldMatch ? cleanText(boldMatch[1]) : 'Language';
            const prof = cleanText(raw.replace(boldMatch ? boldMatch[0] : '', '').replace(/[()]/g, ''));
            return { id: idx + 1, language: name, proficiency: prof };
        });
        if (langs.length > 0) newData.languages = langs;
    }

    return newData;
};
