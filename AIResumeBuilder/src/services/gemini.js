import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateContent = async (apiKey, prompt) => {
    if (!apiKey) {
        throw new Error("API Key is missing. Please add it in settings.");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error(error.message || "Failed to generate content");
    }
};

export const generateSummaryPrompt = (jobTitle, experience) => {
    return `Write a professional resume summary for a ${jobTitle} with the following experience: ${experience}. Keep it concise (3-4 sentences) and impactful.`;
};

export const enhanceDescriptionPrompt = (text) => {
    return `Rewrite the following resume bullet point to be more professional, action-oriented, and impactful: "${text}". Return only the improved text.`;
};

export const generateProjectDescriptionPrompt = (projectName, techStack, description) => {
    return `Write a concise and professional project description for a resume. Project Name: "${projectName}". Tech Stack: "${techStack}". Brief (or empty) description: "${description}". Highlight the technical implementation and impact. Keep it under 50 words.`;
};

export const generateAccomplishmentPrompt = (title, description) => {
    return `Rewrite this accomplishment to be more impressive and quantifiable for a resume. Title: "${title}". Description: "${description}". Keep it concise and professional.`;
};

export const generateSkillsPrompt = (jobTitle) => {
    return `List 10 relevant technical skills for a ${jobTitle} role. Return them as a comma-separated list only. No other text.`;
};
