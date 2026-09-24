import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL_NAME = 'llama3.1:8b';

// Helper to call Ollama with system prompt and force JSON output
async function callLlama(prompt, systemPrompt) {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL_NAME,
      prompt: prompt,
      system: systemPrompt,
      stream: false,
      format: 'json',
      options: {
        temperature: 0.3,
        num_predict: 2048,
        num_ctx: 4096,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const raw = data.response;

  // Clean markdown fences if present
  let cleanJson = (raw || '').trim();
  const match = cleanJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match) {
    cleanJson = match[1].trim();
  }

  try {
    return JSON.parse(cleanJson);
  } catch (parseErr) {
    console.error('Failed to parse JSON response from Ollama:', cleanJson);
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleanJson.substring(firstBrace, lastBrace + 1));
    }
    throw parseErr;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: MODEL_NAME, timestamp: new Date().toISOString() });
});

// Endpoint 1: Generate 2 Diagnostic Questions from Student Doubt
app.post('/api/ai/diagnose', async (req, res) => {
  try {
    const { query } = req.body;
    console.log(`[DIAGNOSE] Analyzing student doubt: "${query}"`);

    // Check if query is too vague to diagnose
    const lower = (query || '').toLowerCase().trim();
    if (!lower || /^(i\s*have\s*(an?|some)?\s*(doubt|question)|help\s*me|hi|hello)$/i.test(lower)) {
      return res.status(400).json({ error: 'Please specify the exact subject or question you have a doubt about.' });
    }

    const system = `You are MetaMind AI, a master educational cognitive tutor.
Analyze the student's doubt: "${query}".

CRITICAL INSTRUCTIONS:
1. You MUST generate an IN-DEPTH, EXHAUSTIVE, DETAILED pedagogical explanation of the student's doubt.
   Do NOT give a short 2-sentence summary. Explain everything thoroughly with clear Markdown headings:
   - 🎯 Core Conceptual Foundation (clear, intuitive definition, purpose, and real-world analogy)
   - ⚙️ Underlying Mechanics & Internal Architecture (how it works under the hood, memory, execution model, engine rules)
   - 🌐 Surrounding Concepts & Connected Ecosystem (related topics, adjacent paradigms, design patterns)
   - 💻 Practical Code Implementation & Walkthrough (syntax, annotated code example with comments, expected output)
   - ⚠️ Common Pitfalls, Edge Cases & Best Practices (frequent traps, bugs, performance/security gotchas)
   - 📌 Core Summary & Next Step Pathway

2. Formulate 2 diagnostic multiple-choice questions to test the student's baseline understanding and catch misconceptions.
3. Provide 3 memorable high-yield takeaways.

Return STRICT JSON:
{
  "subject": "string",
  "topic": "string",
  "prerequisite": "string",
  "detailedExplanation": "Exhaustive multi-paragraph detailed markdown explanation with code, mechanics, and deep context",
  "questions": [
    {
      "id": "q1",
      "conceptName": "string",
      "question": "string",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "Exact matching string from options",
      "explanation": "Why this tests the baseline concept"
    },
    {
      "id": "q2",
      "conceptName": "string",
      "question": "string",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "Exact matching string from options",
      "explanation": "Why this tests the baseline concept"
    }
  ],
  "keyTakeaways": [
    "string",
    "string",
    "string"
  ]
}`;

    const result = await callLlama(`Student Doubt: "${query}"`, system);
    res.json(result);
  } catch (err) {
    console.error('Error in /api/ai/diagnose:', err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint 2: Evaluate Student Answer & Confidence, then generate Tailored Deep Connected Explanation
app.post('/api/ai/evaluate-and-explain', async (req, res) => {
  try {
    const { query, question, userAnswer, confidence } = req.body;
    console.log(`[EVALUATE] Doubt: "${query}" | Answer: "${userAnswer}" | Confidence: "${confidence}"`);

    const system = `You are MetaMind AI, a master educational cognitive tutor.
Evaluate the student's answer and their self-reported confidence level ('low', 'medium', 'high').

CRITICAL PEDAGOGICAL INSTRUCTION:
Do NOT write short 2-3 sentence summaries.
Students need a deep, connected, multi-dimensional mental model that answers their doubt, breaks down the misconception, explains underlying system mechanics, connects to nearby related topics, and gives a practical example.

Return STRICT JSON:
{
  "isCorrect": boolean,
  "misconception": "Clear explanation of the cognitive misconception in their chosen answer (or null if fully accurate)",
  "masteryLevel": "NEEDS_FOUNDATION" | "DEVELOPING" | "COMPETENT",
  "directAnswer": "Comprehensive, intuitive answer directly resolving the student's doubt",
  "underlyingMechanics": "Deep technical explanation of how this works under the hood (memory, execution flow, engine rules)",
  "relatedConcepts": "Connecting nearby related concepts and architectural context so the student understands the whole ecosystem",
  "codeExample": "Concrete code snippet, diagram, or practical scenario demonstrating the concept with comments",
  "nextStep": "Recommended next concept to explore",
  "keyTakeaway": "One short memorable rule of thumb"
}`;

    const prompt = `Student Doubt: "${query}"
Diagnostic Question: "${question?.question || ''}"
Correct Answer: "${question?.correctAnswer || ''}"
Student Selected: "${userAnswer}"
Student Confidence: "${confidence}"`;

    const result = await callLlama(prompt, system);
    res.json(result);
  } catch (err) {
    console.error('Error in /api/ai/evaluate-and-explain:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 MetaMind AI Bridge running on http://localhost:${PORT}`);
});
