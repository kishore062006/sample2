// /api/submit.js - Handles Idea Submission and Database Saving
import { sql } from '@vercel/postgres';

export default async function (req, res) {
    // 1. Handle CORS and Method check
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
        const { 
            title, 
            category, 
            description, 
            impactMetric, 
            submitterName, 
            submitterEmail 
        } = req.body;
        
        // 2. Simple Validation
        if (!title || !description || !category) {
            return res.status(400).json({ 
                success: false, 
                message: "Title, category, and description are required." 
            });
        }

        // 3. Database Insertion
        // The values are automatically sanitized to prevent SQL Injection
        await sql`
            INSERT INTO ideas (
                title, 
                category, 
                description, 
                impact_metric, 
                submitter_name, 
                submitter_email
            ) 
            VALUES (
                ${title}, 
                ${category}, 
                ${description}, 
                ${impactMetric}, 
                ${submitterName}, 
                ${submitterEmail}
            );
        `;
        
        console.log('Idea saved to Vercel Postgres successfully.');
        
        return res.status(200).json({ 
            success: true, 
            message: "Thank you! Your innovation has been saved to our database." 
        });

    } catch (error) {
        console.error('Database Submission Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: `Database Error: ${error.message}` 
        });
    }
}
