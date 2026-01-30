import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { WeeklyAreaReportPdf } from "@/lib/pdf/renderWeeklyAreaReport";
import { imageUrlToBase64 } from "@/lib/pdf/imageToBase64";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function getWorkWeekRange(date = new Date()) {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);

    return { monday, friday };
}

function formatDateForFilename(date: Date) {
    return date.toISOString().slice(0, 10);
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id || session.user.role !== "admin") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const areaId = searchParams.get("area");

        if (!areaId) {
            return NextResponse.json(
                { error: "Falta parámetro area" },
                { status: 400 }
            );
        }

        const { monday, friday } = getWorkWeekRange();

        const query = `
            SELECT
                r.id AS report_id,
                r.title,
                r.content,
                r.mood,
                r.created_at,
                p.full_name AS employee_name,
                p.job_title AS employee_role,
                a.name AS area_name,
                COALESCE(
                    JSON_AGG(ri.image_url)
                        FILTER (WHERE ri.image_url IS NOT NULL),
                    '[]'
                ) AS images
            FROM daily_reports r
            JOIN users u ON u.id = r.user_id
            JOIN profiles p ON p.user_id = u.id
            JOIN areas a ON a.id = u.area_id
            LEFT JOIN report_images ri ON ri.report_id = r.id
            WHERE a.id = $1
            AND r.created_at >= $2
            AND r.created_at <= $3
            GROUP BY
                r.id,
                p.full_name,
                p.job_title,
                a.name
            ORDER BY p.full_name, r.created_at ASC;
        `;

        const { rows } = await pool.query(query, [
            areaId,
            monday,
            friday,
        ]);

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "No hay reportes en esta semana laboral" },
                { status: 404 }
            );
        }

        for (const row of rows) {
            if (!Array.isArray(row.images)) {
                row.images = [];
                continue;
            }

            const base64Images: string[] = [];

            for (const url of row.images.slice(0, 2)) {
                if (!url || !url.startsWith("https://")) continue;

                const base64 = await imageUrlToBase64(url);
                if (base64) base64Images.push(base64);
            }

            row.images = base64Images;
        }

        const pdfBuffer = await renderToBuffer(
            <WeeklyAreaReportPdf
                reports={rows}
                weekStart={monday}
                weekEnd={friday}
            />
        );

        const areaName = rows[0].area_name;

        const fileName =
            `reporte-semanal-area-${slugify(areaName)}-` +
            `de-${formatDateForFilename(monday)}-` +
            `a-${formatDateForFilename(friday)}.pdf`;

        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${fileName}"`,
            },
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: `Error al generar PDF semanal: ${error}` },
            { status: 500 }
        );
    }
}
