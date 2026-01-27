import { unstable_noStore as noStore } from "next/cache";
import { pool } from "@/lib/db";
import type { DailyReport, UserRole } from "@/types";

export async function getUserProfile(userId: string) {
    const query = `
        SELECT 
            p.full_name,
            p.job_title,
            t.name AS team_name,
            t.description AS team_desc,
            t.id AS team_id
        FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            LEFT JOIN teams t ON u.team_id = t.id
        WHERE u.id = $1
    `;

    try {
        const { rows } = await pool.query(query, [userId]);
        return rows[0];
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch user data.");
    }
}

export async function getUserReports(userId: string): Promise<DailyReport[]> {
    noStore();

    const query = `
        SELECT 
            r.id,
            r.title,
            r.content,
            r.created_at,
            r.mood,
            COALESCE(
                JSON_AGG(
                JSON_BUILD_OBJECT('id', i.id, 'image_url', i.image_url)
                ) FILTER (WHERE i.id IS NOT NULL), 
                '[]'
            ) AS images
        FROM daily_reports r
        LEFT JOIN report_images i ON r.id = i.report_id
        WHERE r.user_id = $1
        GROUP BY r.id
        ORDER BY r.created_at DESC
        LIMIT 20
    `;

    try {
        const { rows } = await pool.query<DailyReport>(query, [userId]);
        return rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error al obtener los reportes.");
    }
}

export async function getReportById(
    reportId: string,
    userId: string,
    role: UserRole
): Promise<DailyReport | null> {
    noStore();

    const query = `
            SELECT 
                r.id,
                r.title,
                r.content,
                r.created_at,
                r.mood,
                COALESCE(
                    JSON_AGG(
                        DISTINCT JSONB_BUILD_OBJECT(
                            'id', i.id,
                            'image_url', i.image_url
                        )
                    ) FILTER (WHERE i.id IS NOT NULL),
                    '[]'
                ) AS images
            FROM daily_reports r
            LEFT JOIN report_images i ON r.id = i.report_id
            WHERE r.id = $1
            AND (
                    r.user_id = $2
                    OR $3 = 'admin'
            )
            GROUP BY r.id
            LIMIT 1;
        `;

    try {
        const { rows } = await pool.query<DailyReport>(query, [
            reportId,
            userId,
            role,
        ]);

        return rows[0] ?? null;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Error al obtener el reporte.");
    }
}
