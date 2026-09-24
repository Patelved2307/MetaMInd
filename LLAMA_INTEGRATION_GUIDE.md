# MetaMind AI: Complete Llama 3.1 Integration Guide

This guide provides the complete, step-by-step instructions to connect **Meta Llama 3.1 (8B)** to your MetaMind AI website, running **100% locally and free** on your RTX 3050 laptop without any paid APIs.

---

## 1. System Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│               YOUR WINDOWS LAPTOP                      │
│                                                        │
│  ┌──────────────────────┐      HTTP / JSON             │
│  │ React Frontend (Vite)│ ──────────────────┐          │
│  │ (Port 5173)          │                   ▼          │
│  └──────────────────────┘       ┌────────────────────┐ │
│                                 │ Local Backend API  │ │
│                                 │ (Port 3001 or 8000)│ │
│                                 └─────────┬──────────┘ │
│                                           │            │
│                                           │ Ollama API │
│                                           ▼            │
│                                 ┌────────────────────┐ │
│                                 │ Ollama Server      │ │
│                                 │ (Port 11434)       │ │
│                                 │ └── Llama 3.1 8B   │ │
│                                 │     (RTX 3050 GPU) │ │
│                                 └────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## 2. Hardware & Software Requirements

### Hardware Checklist
- **GPU**: NVIDIA GeForce RTX 3050 Laptop GPU (6 GB VRAM) — ✅ Ready.
- **CPU**: Intel Core i5-13500HX (14 cores) — ✅ Ready.
- **RAM**: 16 GB — ✅ Ready.
- **Storage**: Minimum 10 GB free space on C: drive (Llama 3.1 8B uses ~4.7 GB).

### Software Checklist
1. **NVIDIA GPU Drivers**: Ensure your NVIDIA graphics driver is up to date (GeForce Experience or Nvidia.com).
2. **Node.js**: Version 18+ (already present on your machine).
3. **Ollama for Windows**: Download from [https://ollama.com/download/windows](https://ollama.com/download/windows).

---

## 3. Step-by-Step Implementation

### Step 1: Install and Launch Ollama

1. Download and run the `OllamaSetup.exe` installer from [ollama.com](https://ollama.com).
2. Once installed, Ollama will run in your Windows system tray.
3. Open a new **PowerShell** or **Command Prompt** window and pull Llama 3.1:
   ```powershell
   ollama run llama3.1:8b
   ```
4. Wait for the download to finish (~4.7 GB). Once loaded, test by typing:
   `Hello! Are you running on my GPU?`
5. Press `Ctrl + D` or type `/bye` to exit the chat terminal.
6. Verify the Ollama API is active by opening `http://localhost:11434` in your browser. You should see:
   `Ollama is running`

---

### Step 2: Create the Local Backend AI Bridge

Browsers block direct cross-origin calls to Ollama by default, and your frontend needs structured JSON outputs. A small Node.js backend bridge acts as the intermediary.

1. In your project, create a new folder: `server/`
2. Create `server/package.json`:
   ```json
   {
     "name": "metamind-ai-server",
     "version": "1.0.0",
     "type": "module",
     "scripts": {
       "start": "node server.js"
     },
     "dependencies": {
       "cors": "^2.8.5",
       "express": "^4.21.0"
     }
   }
   ```
3. Install dependencies:
   ```powershell
   cd server
   npm install
   ```
4. Create `server/server.js`:
   ```javascript
   import express from 'express';
   import cors from 'cors';

   const app = express();
   app.use(cors());
   app.use(express.json());

   const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
   const MODEL_NAME = 'llama3.1:8b';

   async function callLlama(prompt, systemPrompt, formatJson = true) {
     const payload = {
       model: MODEL_NAME,
       prompt: prompt,
       system: systemPrompt,
       stream: false,
       options: {
         temperature: 0.3,
       }
     };

     if (formatJson) {
       payload.format = 'json';
     }

     const response = await fetch(OLLAMA_URL, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(payload),
     });

     if (!response.ok) {
       throw new Error(`Ollama error: ${response.statusText}`);
     }

     const data = await response.json();
     return formatJson ? JSON.parse(data.response) : data.response;
   }

   // Endpoint 1: Analyze student doubt & generate 2 diagnostic questions
   app.post('/api/ai/diagnose', async (req, res) => {
     try {
       const { query } = req.body;
       const system = `You are an adaptive educational tutor. Analyze the student's doubt.
Identify the core topic, 1 prerequisite concept, and create 2 quick diagnostic multiple-choice questions to test their baseline understanding.
Return STRICT JSON format:
{
  "subject": "string",
  "topic": "string",
  "prerequisite": "string",
  "questions": [
    {
      "id": "q1",
      "conceptName": "string",
      "question": "string",
      "options": ["option 1", "option 2", "option 3", "option 4"],
      "correctAnswer": "exact match to one option",
      "explanation": "why this is correct"
    }
  ]
}`;
       const result = await callLlama(`Student Doubt: "${query}"`, system, true);
       res.json(result);
     } catch (err) {
       console.error('Diagnostic error:', err);
       res.status(500).json({ error: err.message });
     }
   });

   // Endpoint 2: Evaluate answer, confidence level, and generate tailored explanation
   app.post('/api/ai/evaluate-and-explain', async (req, res) => {
     try {
       const { query, question, userAnswer, confidence } = req.body;

       const system = `You are an expert adaptive tutor.
Evaluate the student's answer and their self-reported confidence.
Confidence levels: 'low', 'medium', 'high'.
Return STRICT JSON:
{
  "isCorrect": true/false,
  "misconception": "describe misconception if false, or null if true",
  "masteryLevel": "NEEDS_FOUNDATION" or "DEVELOPING" or "COMPETENT",
  "tailoredExplanation": "Thorough explanation answering the student's doubt adjusted to their level. If NEEDS_FOUNDATION: use simple real-world ELI5 analogies. If DEVELOPING: address their specific misconception. If COMPETENT: explain advanced mechanics and edge cases.",
  "keyTakeaway": "One short memory rule"
}`;

       const prompt = `Student Doubt: "${query}"
Diagnostic Question: "${question.question}"
Correct Answer: "${question.correctAnswer}"
Student Selected: "${userAnswer}"
Student Confidence: "${confidence}"`;

       const result = await callLlama(prompt, system, true);
       res.json(result);
     } catch (err) {
       console.error('Evaluation error:', err);
       res.status(500).json({ error: err.message });
     }
   });

   app.listen(3001, () => {
     console.log('🚀 MetaMind AI Bridge running on http://localhost:3001');
   });
   ```

---

### Step 3: Connect Frontend `aiClient.ts` with Offline Fallback

Edit [src/services/ai/aiClient.ts](file:///c:/Users/VED_PATEL/OneDrive/文件/Hkatthon%20Projects/New%20folder/Website/src/services/ai/aiClient.ts) so it tries the local Llama bridge first, and falls back to `mockAiProvider` if Ollama is closed:

```typescript
import { mockAiProvider } from './mockAiProvider';
import type { TopicAnalysisResult, AssessmentQuestion, AnswerAnalysisResult } from './ai.types';

const BACKEND_URL = 'http://localhost:3001/api/ai';

export const aiClient = {
  async analyzeTopic(query: string): Promise<TopicAnalysisResult> {
    try {
      const res = await fetch(`${BACKEND_URL}/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          subject: data.subject,
          topic: data.topic,
          description: `Diagnosing core concept: ${data.topic} & prerequisite: ${data.prerequisite}`,
          concepts: [
            { name: data.prerequisite, type: 'prerequisite' },
            { name: data.topic, type: 'core' },
          ],
        };
      }
    } catch {
      console.warn('Local Llama bridge not running. Using mockAiProvider fallback.');
    }
    return await mockAiProvider.analyzeTopic(query);
  },

  async evaluateAndExplain(query: string, question: AssessmentQuestion, userAnswer: string, confidence: 'low' | 'medium' | 'high') {
    try {
      const res = await fetch(`${BACKEND_URL}/evaluate-and-explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, question, userAnswer, confidence }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      console.warn('Local Llama bridge not running. Using mockAiProvider fallback.');
    }
    return {
      isCorrect: userAnswer.trim() === question.correctAnswer.trim(),
      masteryLevel: 'DEVELOPING',
      tailoredExplanation: 'Fallback simulated explanation.',
      keyTakeaway: 'Review core prerequisites.',
    };
  },
};
```

---

### Step 4: The 2-Turn Socratic Flow in the Chatbot

In [src/pages/app/ChatbotWorkspacePage.tsx](file:///c:/Users/VED_PATEL/OneDrive/文件/Hkatthon%20Projects/New%20folder/Website/src/pages/app/ChatbotWorkspacePage.tsx):

1. **Turn 1 (Student sends doubt)**:
   - Call `/api/ai/diagnose`.
   - Bot renders the 2 diagnostic question cards.
   - Show a **Confidence Meter** with 3 selectable options:
     - 🔴 Unsure (Low)
     - 🟡 Fairly Confident (Medium)
     - 🟢 100% Sure (High)

2. **Turn 2 (Student clicks Submit Answer)**:
   - Call `/api/ai/evaluate-and-explain`.
   - Bot displays:
     - Badge: e.g. `Mastery Level: Developing | Addressing Misconception`
     - The tailored explanation written specifically for their knowledge gap.
     - Key takeaway card.

---

## 4. How to Run the Entire System Daily

Whenever you want to use or demo your app, run these two commands in two separate terminal tabs:

**Tab 1: Backend Bridge**
```powershell
cd server
npm start
```
*(Ollama will automatically activate in the background when the request arrives).*

**Tab 2: Frontend Website**
```powershell
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 5. Frequently Asked Questions & Troubleshooting

### Q: Do I need to keep my laptop awake 24/7?
**No.** When you shut down Windows, Ollama stops. When you turn your laptop back on, Ollama starts again in 2 seconds. Nothing is lost.

### Q: What if Ollama is not running when someone opens the site?
Because of the fallback pattern in `aiClient.ts`, if your backend server or Ollama is ever turned off, the website will gracefully fall back to the built-in simulated data without crashing or showing error screens.

### Q: How can I confirm Llama 3.1 is using my RTX 3050 GPU?
Open PowerShell and run:
```powershell
ollama ps
```
Look at the `PROCESSOR` column. It will show `100% GPU` (meaning all layers are accelerated by your RTX 3050 VRAM).
