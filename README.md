# AI Resume Builder 🚀

A modern, AI-powered resume builder aimed at helping developers create professional, ATS-friendly resumes with ease. Built with **React**, **Tailwind CSS**, and **Google's Gemini AI**, this tool combines the ease of a visual editor with the power of generative AI and the precision of LaTeX-style formatting.

## ✨ Key Features

- **Real-time Preview**: See your resume update instantly as you type.
- **AI Formatting**: Automatically formats your resume into a clean, professional "LaTeX-style" layout using a custom serif typography system.
- **Smart AI Assistance 🤖**:
  - **Summary Generator**: Instantly writes a professional summary tailored to your job title and experience.
  - **Bullet Point Enhancer**: Transforms weak descriptions into impactful, result-oriented statements.
  - **Skill Suggester**: Auto-generates a list of relevant technical skills based on your role.
  - **Project Descriptions**: Generates concise, technical descriptions for your portfolio projects.
- **Dual Modes**:
  - **Visual Editor**: Easy-to-use form inputs.
  - **LaTeX Source View**: View, edit, and copy the raw `.tex` code for use in Overleaf or other LaTeX editors.
- **Export Options**:
  - **PDF**: Direct high-quality PDF download.
  - **LaTeX (.tex)**: Download the source code for manual compiling.

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Engine**: Google Gemini API (`@google/generative-ai`)
- **PDF Generation**: `html2pdf.js`
- **State Management**: React Context API

---

## � User Guide

### 1. Initial Setup
1.  **Launch the App**: Open the application in your browser (default: `http://localhost:5174`).
2.  **Configure AI**:
    *   Click the **Settings (Gear Icon)** in the top right corner.
    *   Paste your **Google Gemini API Key**. (Don't have one? Get it [here](https://makersuite.google.com/app/apikey)).
    *   Click **Save**. The key is stored securely in your browser's local storage.

### 2. Building Your Resume
The application is divided into two main panels:

**Left Panel (The Editor)**:
*   **Personal Info**: Enter your name, contact details, and links (LinkedIn, GitHub, Portfolio).
*   **Experience & Education**: Add your work history and degrees. Use the `+ Add` button to add multiple entries.
*   **Skills**: Add skills manually or use the **Magic Wand** to suggest them.
*   **Projects, Certifications, Accomplishments**: Dedicated sections to showcase your specific achievements.

**Right Panel (live Preview)**:
*   Displays a real-time, PDF-ready preview of your resume.
*   The layout mimics professional LaTeX templates used by top tech companies.

### 3. Using AI Features 🪄
Look for the **Magic Wand** icon in various sections:
*   **Summary**: In user details, click "AI Generate" to write a summary based on your added experience.
*   **Experience Points**: Next to any description box, click the wand to rewrite that specific bullet point to be more professional.
*   **Projects**: Enter a project name and tech stack, then click the wand to generate a description.
*   **Skills**: In the Skills section header, click "Suggest" to populate the list based on your Job Title.

### 4. LaTeX & Exporting
*   **Toggle Views**: Use the tabs at the top of the Left Panel to switch between:
    *   **Visual Editor**: The standard form view.
    *   **LaTeX Code**: Shows the raw `.tex` code generated from your data. You can edit this manually!
*   **Download PDF**: Click the large **Download PDF** button on the right to save your resume.
*   **Download .tex**: In the LaTeX view, click "Download .tex" to save the source file.

---

## 🚀 Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-resume-builder.git
   cd ai-resume-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
src/
├── components/         # Reusable UI components (Buttons, Inputs, Modals)
├── context/            # React Context (ResumeData, API Key management)
├── features/
│   ├── editor/         # Logic for the Left Panel (Visual Editor)
│   └── preview/        # Logic for Right Panel (Preview & LaTeX View)
├── services/           # Gemini API integration service
├── utils/              # Helper functions (LaTeX generation)
└── App.jsx             # Main application layout
```

## 🤝 Contributing
Contributions are welcome! If you have ideas for new AI features or better templates, feel free to open an issue or submit a Pull Request.

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
