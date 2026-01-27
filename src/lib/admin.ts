import { pool } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export interface AdminTeam {
    id: string;
    name: string;
    members: number;
}

export async function getAdminTeams(adminId: string): Promise<AdminTeam[]> {
    noStore();

    const query = `
        SELECT
            t.id,
            t.name,
            COUNT(u.id)::int AS members
        FROM teams t
        LEFT JOIN users u 
            ON u.team_id = t.id 
            AND u.is_active = true
        WHERE t.owner_id = $1
        GROUP BY t.id
        ORDER BY t.name;
    `;

    const { rows } = await pool.query(query, [adminId]);
    return rows;
}
