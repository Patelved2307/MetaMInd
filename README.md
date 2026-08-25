<div align="center">

  <img src="public/assets/brand/metamind_logo.png" alt="MetaMind Logo" width="380" />

  <h3>Adaptive AI Learning Platform & Research Workspace</h3>

  <p><b>LEARN • ADAPT • ACHIEVE</b></p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white" alt="React 19" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-v4.0-38BDF8?logo=tailwindcss&logoColor=white" alt="TailwindCSS" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License MIT" /></a>
  </p>

  <br />

</div>

---

## 🌟 Overview

**MetaMind** is a state-of-the-art, adaptive AI-powered education platform designed to transform how students learn, debug doubts, and master complex academic topics. 

Unlike traditional static courseware, **MetaMind** adapts to every student's individual confidence baseline, preferred explanation depth, and persona aesthetic. From interactive 3D persona customization to dynamic concept dependency mapping and verified PDF certificate generation, MetaMind turns learning into a personalized, visual, and rewarding journey.

---

## ✨ Key Features

### 🤖 1. Main AI Doubt Resolution & Research Hub
- **Adaptive Explanation Depth**: Instantly toggle explanation complexity between **`Easier`**, **`Medium`**, and **`In-Depth`** modes.
- **AI Diagnostic Knowledge Check**: Evaluates baseline student confidence (**`Beginner`**, **`Moderate`**, **`Advanced`**) before diving into complex subjects.
- **Verified AI Explanations & Analogies**: Delivers structured explanations with **`✓ Verified Explanation`** badges, code execution blocks, and real-world analogies.
- **Verified Web & Video Recommendations**: Curates verified online documentation (e.g., W3Schools) and video tutorials (e.g., Computerphile YouTube) for deep research.
- **Floating Input Dock**: Wide input capsule with file attachments (`📎`), voice doubt recording (`🎙️`), and prompt shortcuts (`💡`).

### 🎭 2. Signature 3D Persona & Global Theme Engine
- **10 Avatar Personas**: Select from curated 3D cartoon avatars (**Cyber Skeleton**, **Streetwear Bear**, **Shinchan Boy**, **Teal Beanie Boy**, **Lofi Girl**, **Luffy Boy**, **Focus Boy**, **Retro Cap Girl**, **Joy Girl**, **Yeo Scholar Girl**).
- **Avatar-Driven Theme Sync**: Selecting a persona dynamically transforms primary accent colors, radial background sheens, depth pills, active card borders, and hero gradients across the entire platform in real time!

### 📊 3. Student Analytics & Diagnostics Dashboard
- **Mastery Radar Graph**: Tracks subject proficiency across Computer Science, AI, Databases, Algorithms, and Mathematics.
- **Focus Time Streaks**: Monitors daily study hours, active learning streaks, and completed modules.
- **Diagnostic Gap Analysis**: Highlights weak spots and suggests optimal review sessions.

### 🗺️ 4. Adaptive Concept Dependency Map
- **Visual Concept Graph**: Interactive node network displaying prerequisite relationships, connected sub-topics, and unlockable advanced modules.
- **Progress Tracking**: Color-coded node status indicating **Mastered**, **In-Progress**, or **Locked** concepts.

### 📜 5. Dynamic Verified PDF Certificate Generator
- **Custom Design Suite**: Customize certificate templates with 4 unique visual styles, official seals, customizable signatures, and issue dates.
- **Verification & Share**: Download high-resolution PNG/PDF certificates or share verified links (`metamind.app/cert/...`).

### 📝 6. Timed Assessment & Quiz Simulator
- **Real-Time Timed Exams**: Test subject knowledge under exam conditions with dynamic question ordering and countdown timers.
- **Instant Diagnostic Feedback**: Comprehensive score breakdowns with step-by-step answer explanations and retake options.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tooling** | Vite 6 |
| **Styling & Design System** | TailwindCSS v4 + Vanilla CSS Design Tokens |
| **Icons & Visuals** | Lucide React + 3D Cartoon Avatar Engine |
| **Animations** | Framer Motion + CSS Micro-Interactions |
| **Authentication & Database** | Supabase Auth & PostgreSQL |
| **PDF Generation** | HTMLCanvas / SVG Design Canvas |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm** or **yarn**

### Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Patelved2307/MetaMInd.git
   cd MetaMInd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
MetaMind/
├── public/
│   ├── assets/
│   │   ├── brand/           # Official MetaMind logo PNGs & favicons
│   │   └── avatars/         # Signature 3D cartoon avatar assets
├── src/
│   ├── app/
│   │   ├── layouts/         # AppLayout wrapper with sidebar & header
│   │   └── router.tsx       # React Router v6 route configuration
│   ├── components/
│   │   ├── landing/         # Hero, About, Video, & Footer sections
│   │   ├── layout/          # Sidebar & navigation components
│   │   └── ui/              # Buttons, Dialogs, Inputs, & Modal components
│   ├── features/
│   │   ├── auth/            # AuthProvider & Supabase auth service
│   │   ├── learning/        # Adaptive learning & doubt resolution logic
│   │   └── exam/            # Assessment & timed quiz engine
│   ├── lib/
│   │   ├── avatarGenerator.ts # Avatar theme engine & preset definitions
│   │   └── guideExporter.ts # Markdown study guide exporter
│   └── pages/
│       ├── app/             # Dashboard, Learn Hub, Concept Map, Profile, etc.
│       └── public/          # Landing Page, Sign In, Sign Up, Onboarding
├── index.html
├── package.json
└── vite.config.ts
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with ❤️ for Students Worldwide by the <b>MetaMind Team</b></p>
</div>
