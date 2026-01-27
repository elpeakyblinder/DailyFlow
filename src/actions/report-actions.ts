"use server";

import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createReportAction(
    title: string,
    content: string,
    mood: "success" | "neutral" | "blocked",
    imageUrls: string[]
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: "No autorizado" };
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const reportResult = await client.query(
            `INSERT INTO daily_reports (user_id, title, content, mood)
            VALUES ($1, $2, $3, $4)
            RETURNING id`,
            [session.user.id, title, content, mood]
        );

        const reportId = reportResult.rows[0].id;

        if (imageUrls.length > 0) {
            for (const url of imageUrls) {
                await client.query(
                    `INSERT INTO report_images (report_id, image_url)
                    VALUES ($1, $2)`,
                    [reportId, url]
                );
            }
        }

        await client.query("COMMIT");

        revalidatePath("/employee/reports/dashboard");
        revalidatePath("/admin/dashboard");

        return { success: true };

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error creando reporte:", error);

        return {
            success: false,
            error: "Error al guardar en base de datos",
        };
    } finally {
        client.release();
    }
}
