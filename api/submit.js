// /api/submit.js
import express from 'express';

const app = express();
app.use(express.json());

app.post('/', (req, res) => {
    const ideaData = req.body;
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // This is where database saving would occur in a real application.
    console.log(`Received Idea: ${ideaData.title} by ${ideaData.submitterName || 'Anonymous'}`);

    res.status(200).json({ 
        success: true, 
        message: `Idea "${ideaData.title}" received successfully. Thank you for making a difference!` 
    });
});

export default app;
