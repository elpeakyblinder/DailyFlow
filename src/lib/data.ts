import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function getUserProfile(userId: string) {
    const query = `
        SELECT 
            p.full_name, 
            p.job_title, 
            t.name as team_name, 
            t.description as team_desc,
            t.id as team_id
        FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            LEFT JOIN teams t ON u.team_id = t.id
        WHERE u.id = $1
    `;

    try {
        const { rows } = await pool.query(query, [userId]);
        return rows[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user data.');
    }
}