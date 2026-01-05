import { GoogleGenerativeAI } from "@google/genai"; // Matched to package.json

const MODEL_NAME = 'gemini-1.5-flash';

const systemInstruction = `
    You are Sustaina-Bot, an expert consultant for Green Innovation and Sustainability. 
    Your purpose is strictly limited to providing advice, facts, and ideas related to 
    eco-friendly materials, circular economy, renewable energy, and sustainable processes. 
    If a user asks about any topic outside of green innovation or sustainability, 
    you must politely decline and redirect them back to the theme of sustainable innovation.
`;

export default async function handler(req, res) {
    // 1. Handle CORS and Method
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, text: "Method Not Allowed" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ 
            success: false, 
            text: 'API Key missing in Vercel Environment Variables.' 
        });
    }

    try {
        const { prompt, history } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ success: false, text: "No prompt provided." });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: MODEL_NAME,
            systemInstruction: systemInstruction 
        });

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({ success: true, text: text });

    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({ 
            success: false, 
            text: `AI Error: ${error.message}` 
        });
    }
}
