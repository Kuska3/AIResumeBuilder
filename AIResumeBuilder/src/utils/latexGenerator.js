export const generateLatex = (data) => {
    const { personalInfo, experience, education, skills, projects, certifications, accomplishments, languages } = data;

    const escapeLatex = (str) => {
        if (!str) return '';
        return str
            .replace(/\\/g, '\\textbackslash{}')
            .replace(/&/g, '\\&')
            .replace(/%/g, '\\%')
            .replace(/\$/g, '\\$')
            .replace(/#/g, '\\#')
            .replace(/_/g, '\\_')
            .replace(/{/g, '\\{')
            .replace(/}/g, '\\}')
            .replace(/~/g, '\\textasciitilde{}')
            .replace(/\^/g, '\\textasciicircum{}');
    };

    let latex = `\\documentclass[a4paper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage[margin=0.75in]{geometry}

% Formatting
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{10pt}{5pt}
\\renewcommand{\\labelitemi}{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\begin{document}

% Header
\\begin{center}
    {\\Huge \\textbf{${escapeLatex(personalInfo.fullName)}}} \\\\
    \\vspace{2mm}
    ${personalInfo.email ? `\\href{mailto:${personalInfo.email}}{${escapeLatex(personalInfo.email)}}` : ''} 
    ${personalInfo.phone ? ` | ${escapeLatex(personalInfo.phone)}` : ''}
    ${personalInfo.linkedin ? ` | \\href{${personalInfo.linkedin}}{LinkedIn}` : ''}
    ${personalInfo.github ? ` | \\href{${personalInfo.github}}{GitHub}` : ''}
    ${personalInfo.portfolio ? ` | \\href{${personalInfo.portfolio}}{Portfolio}` : ''}
\\end{center}

% Summary
${personalInfo.summary ? `\\section{Professional Summary}
${escapeLatex(personalInfo.summary)}
` : ''}

% Skills
${skills && skills.length > 0 ? `\\section{Technical Skills}
\\textbf{Languages/Technologies}: ${skills.map(escapeLatex).join(', ')}
` : ''}

% Projects
${projects && projects.length > 0 ? `\\section{Projects}
\\begin{itemize}[leftmargin=*]
${projects.map(p => `    \\item \\textbf{${escapeLatex(p.name)}} ${p.link ? `| \\href{${p.link}}{Link}` : ''} \\\\
    \\textit{${escapeLatex(p.techStack)}} \\\\
    ${escapeLatex(p.description)}`).join('\n')}
\\end{itemize}
` : ''}

% Experience
${experience && experience.length > 0 ? `\\section{Professional Experience}
\\begin{itemize}[leftmargin=*]
${experience.map(e => `    \\item \\textbf{${escapeLatex(e.role)}} \\hfill ${escapeLatex(e.duration)} \\\\
    \\textit{${escapeLatex(e.company)}} \\\\
    ${escapeLatex(e.description)}`).join('\n')}
\\end{itemize}
` : ''}

% Education
${education && education.length > 0 ? `\\section{Education}
\\begin{itemize}[leftmargin=*]
${education.map(edu => `    \\item \\textbf{${escapeLatex(edu.degree)}} \\hfill ${escapeLatex(edu.year)} \\\\
    \\textit{${escapeLatex(edu.school)}}`).join('\n')}
\\end{itemize}
` : ''}

% Certifications
${certifications && certifications.length > 0 ? `\\section{Certifications}
\\begin{itemize}[leftmargin=*]
${certifications.map(cert => `    \\item \\textbf{${escapeLatex(cert.name)}} -- ${escapeLatex(cert.issuer)} (${escapeLatex(cert.year)})`).join('\n')}
\\end{itemize}
` : ''}

% Accomplishments
${accomplishments && accomplishments.length > 0 ? `\\section{Accomplishments}
\\begin{itemize}[leftmargin=*]
${accomplishments.map(acc => `    \\item \\textbf{${escapeLatex(acc.title)}}: ${escapeLatex(acc.description)}`).join('\n')}
\\end{itemize}
` : ''}

% Languages
${languages && languages.length > 0 ? `\\section{Languages}
\\begin{itemize}[leftmargin=*]
${languages.map(lang => `    \\item \\textbf{${escapeLatex(lang.language)}} (${escapeLatex(lang.proficiency)})`).join('\n')}
\\end{itemize}
` : ''}

\\end{document}`;

    return latex;
};
