// /api/chat.js - Vercel Native Handler for Green Innovation
import { GoogleGenAI } from "@google/genai";

// 1. Model Selection
const model = 'gemini-2.5-flash';

// 2. System Instruction (The core logic for topic restriction)
const systemInstruction = `
    You are Sustaina-Bot, an expert consultant for Green Innovation and Sustainability. 
    Your purpose is strictly limited to providing advice, facts, and ideas related to 
    eco-friendly materials, circular economy, renewable energy, and sustainable processes. 
    If a user asks about any topic outside of green innovation or sustainability, 
    you must politely decline and redirect them back to the theme of sustainable innovation.
    Do NOT engage in conversations about politics, current events (unless directly relevant to sustainability), or non-technical topics.
`;

// 3. Main Vercel Handler Function
export default async function (req, res) {
    
    // Ensure only POST requests are processed
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, text: "Method Not Allowed" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // API Key Check
    if (!GEMINI_API_KEY) {
        console.error("DEBUG: GEMINI_API_KEY is NOT set in the Vercel Environment.");
        return res.status(500).json({ 
            success: false, 
            text: 'API Key not loaded in function context. Please check Vercel settings.' 
        });
    }

    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ success: false, text: "No prompt provided." });
        }

        const ai = new GoogleGenAI(GEMINI_API_KEY);
        
        // Setting CORS header for frontend access
        res.setHeader('Access-Control-Allow-Origin', '*'); 

        // 4. Generate Content Call
        const response = await ai.models.generateContent({
            model: model,
            // Apply the system instruction
            config: { 
                systemInstruction: systemInstruction 
            },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        res.status(200).json({ success: true, text: response.text });
    } catch (error) {
        // Catch API errors (like 503 Overloaded or 401 Invalid Key)
        console.error('Gemini API Error:', error.message || error);
        res.status(500).json({ 
            success: false, 
            text: `AI Server Error: ${error.message || 'Unknown error.'}` 
        });
    }
};
