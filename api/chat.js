// /api/chat.js - Vercel Native Handler for Green Innovation
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Model Selection
const MODEL_NAME = 'gemini-1.5-flash'; // Use gemini-1.5-flash for reliability

// 2. System Instruction
const systemInstruction = `
    You are Sustaina-Bot, an expert consultant for Green Innovation and Sustainability. 
    Your purpose is strictly limited to providing advice, facts, and ideas related to 
    eco-friendly materials, circular economy, renewable energy, and sustainable processes. 
    If a user asks about any topic outside of green innovation or sustainability, 
    you must politely decline and redirect them back to the theme of sustainable innovation.
    Do NOT engage in conversations about politics, current events, or non-technical topics.
`;

export default async function (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, text: "Method Not Allowed" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ 
            success: false, 
            text: 'API Key not loaded. Please check Vercel environment variables.' 
        });
    }

    try {
        const { prompt, history } = req.body; // history allows for memory (multi-turn chat)
        
        if (!prompt) {
            return res.status(400).json({ success: false, text: "No prompt provided." });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        
        // CORRECT WAY to apply System Instructions: During model initialization
        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            systemInstruction: systemInstruction 
        });

        // 4. Generate Content Call
        // We use startChat so that the AI can remember previous context if you pass 'history'
        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ success: true, text: text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ 
            success: false, 
            text: `AI Server Error: ${error.message || 'The AI service is currently unavailable.'}` 
        });
    }
}
