// /api/chat.js - Modified for Debugging
import { GoogleGenAI } from "@google/genai";
import express from 'express';

const app = express();
app.use(express.json());

const model = 'gemini-2.5-flash';

app.post('/', async (req, res) => {
    
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // --- 🔑 DEBUGGING CODE START 🔑 ---
    if (!GEMINI_API_KEY) {
        console.error("DEBUG: GEMINI_API_KEY is NOT set in the Vercel Environment.");
        return res.status(500).json({ 
            success: false, 
            text: 'API Key not loaded in function context. Please check Vercel settings.' 
        });
    }

    if (GEMINI_API_KEY.length > 30) {
        console.log(`DEBUG: GEMINI_API_KEY is loaded and has a secure length of ${GEMINI_API_KEY.length}.`);
    } else {
        console.warn(`DEBUG: GEMINI_API_KEY is loaded but seems too short (${GEMINI_API_KEY.length}). Check the value.`);
    }
    // --- 🔑 DEBUGGING CODE END 🔑 ---

    const ai = new GoogleGenAI(GEMINI_API_KEY);
    const { prompt } = req.body;
    
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Content-Type', 'application/json');

    if (!prompt) {
        return res.status(400).json({ success: false, text: "No prompt provided." });
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        res.status(200).json({ success: true, text: response.text });
    } catch (error) {
        // This catch block will now receive a specific error if the key is bad (e.g., 401)
        console.error('Gemini API Error:', error.message || error);
        res.status(500).json({ 
            success: false, 
            text: `AI Server Error: ${error.message || 'Unknown error.'}` 
        });
    }
});

export default app;
