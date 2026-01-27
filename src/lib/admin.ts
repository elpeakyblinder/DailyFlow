import { pool } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export interface AdminTeam {
    id: string;
    name: string;
    members: number;
}

export interface TeamEmployee {
    id: string;
    name: string;
    role: string;
    teamId: string;
    lastReportAt: Date | null;
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

export async function getTeamEmployees(teamId: string): Promise<TeamEmployee[]> {
    noStore();

    const query = `
        SELECT
            u.id,
            p.full_name AS name,
            p.job_title AS role,
            u.team_id,
            MAX(r.created_at) AS last_report_at
        FROM users u
        LEFT JOIN profiles p ON p.user_id = u.id
        LEFT JOIN daily_reports r ON r.user_id = u.id
        WHERE u.team_id = $1
        GROUP BY u.id, p.full_name, p.job_title
        ORDER BY last_report_at DESC NULLS LAST;
    `;

    const { rows } = await pool.query(query, [teamId]);

    return rows.map(row => ({
        id: row.id,
        name: row.name ?? "Sin nombre",
        role: row.role ?? "Sin puesto",
        teamId: row.team_id,
        lastReportAt: row.last_report_at,
    }));
}