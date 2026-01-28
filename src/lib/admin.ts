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

export interface AreaEmployee {
    id: string;
    name: string;
    role: string;
    areaId: string;
    areaName: string;
    lastReportAt: Date | null;
}

export interface AreaSummary {
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

export async function getEmployeesByArea(areaId: string): Promise<AreaEmployee[]> {
    const query = `
        SELECT
            u.id,
            p.full_name AS name,
            p.job_title AS role,
            a.id AS area_id,
            a.name AS area_name,
            MAX(r.created_at) AS last_report_at
        FROM users u
        JOIN areas a ON u.area_id = a.id
        LEFT JOIN profiles p ON u.id = p.user_id
        LEFT JOIN daily_reports r ON r.user_id = u.id
        WHERE a.id = $1
        GROUP BY u.id, p.full_name, p.job_title, a.id, a.name
        ORDER BY p.full_name ASC;
    `;

    const { rows } = await pool.query(query, [areaId]);
    return rows;
}

export async function getAdminAreas(): Promise<AreaSummary[]> {
    const query = `
        SELECT
            a.id,
            a.name,
            COUNT(u.id) AS members
        FROM areas a
        LEFT JOIN users u ON u.area_id = a.id
        GROUP BY a.id
        ORDER BY a.name;
    `;

    const { rows } = await pool.query(query);
    return rows;
}

export async function getEmployeesWithArea() {
    const query = `
        SELECT
            u.id AS user_id,
            p.full_name,
            p.job_title,
            a.id AS area_id,
            a.name AS area_name,
            MAX(r.created_at) AS last_report_at
        FROM users u
        JOIN profiles p ON p.user_id = u.id
        LEFT JOIN areas a ON a.id = u.area_id
        LEFT JOIN daily_reports r ON r.user_id = u.id
        GROUP BY u.id, p.full_name, p.job_title, a.id, a.name
        ORDER BY a.name, p.full_name;
    `;

    const { rows } = await pool.query(query);
    return rows;
}