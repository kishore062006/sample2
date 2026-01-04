import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Idea ID required." });
        }

        // Increment the vote count by 1
        await sql`
            UPDATE ideas 
            SET votes = COALESCE(votes, 0) + 1 
            WHERE id = ${id};
        `;
        
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Voting Error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
