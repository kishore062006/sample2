// /api/chat.js
import { GoogleGenAI } from "@google/genai";
import express from 'express';

// Vercel automatically loads GEMINI_API_KEY from environment variables
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
const model = 'gemini-2.5-flash';

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
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
