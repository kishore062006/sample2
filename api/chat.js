// /api/chat.js - CORRECTED
import { GoogleGenAI } from "@google/genai";
import express from 'express';

// --- REMOVE THESE GLOBAL INITIALIZATIONS ---
// const ai = new GoogleGenAI(process.env.GEMINI_API_KEY); // <-- DELETE THIS LINE
// const model = 'gemini-2.5-flash'; // <-- KEEP model name here

const app = express();
app.use(express.json());

const model = 'gemini-2.5-flash'; // Define model name globally or locally

app.post('/', async (req, res) => {
    
    // 1. *** MOVE KEY ACCESS INSIDE THE HANDLER ***
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        // This is a safety check for Vercel debugging
        return res.status(500).json({ success: false, text: 'API Key not loaded in function context.' });
    }

    const ai = new GoogleGenAI(GEMINI_API_KEY);
    // ------------------------------------------

    const { prompt } = req.body;
    
    // Set CORS headers for Vercel functions
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
        console.error('Gemini API Error:', error);
        res.status(500).json({ success: false, text: 'AI Server Error. Check Vercel logs and API key.' });
    }
});

export default app;
