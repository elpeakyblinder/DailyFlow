interface WeeklyReportRow {
    report_id: string;
    title: string | null;
    content: string;
    mood: "success" | "neutral" | "blocked";
    created_at: Date;
    employee_name: string;
    employee_role: string | null;
    area_name: string;
    images: string[];
}

interface RenderWeeklyAreaReportParams {
    reports: WeeklyReportRow[];
    weekStart: Date;
    weekEnd: Date;
}

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("es-MX", {
        dateStyle: "long",
    });
}

function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString("es-MX", {
        timeStyle: "short",
    });
}

function formatShortDate(date: Date) {
    return new Date(date).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function getMoodLabel(mood: WeeklyReportRow["mood"]): string {
    switch (mood) {
        case "success":
            return "Productivo";
        case "neutral":
            return "Neutral";
        case "blocked":
            return "Bloqueado";
    }
}

function getMoodClass(mood: WeeklyReportRow["mood"]): string {
    switch (mood) {
        case "success":
            return "mood-success";
        case "neutral":
            return "mood-neutral";
        case "blocked":
            return "mood-blocked";
    }
}

export function renderWeeklyAreaReport({
    reports,
    weekStart,
    weekEnd,
}: RenderWeeklyAreaReportParams): string {
    const areaName = reports[0].area_name;

    const groupedByEmployee = new Map<string, WeeklyReportRow[]>();

    for (const report of reports) {
        if (!groupedByEmployee.has(report.employee_name)) {
            groupedByEmployee.set(report.employee_name, []);
        }
        groupedByEmployee.get(report.employee_name)!.push(report);
    }

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Reporte semanal - ${areaName}</title>
    <style>
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 40px;
            color: #111;
        }

        h1 {
            font-size: 28px;
            margin-bottom: 6px;
        }

        .subtitle {
            font-size: 14px;
            color: #555;
            margin-bottom: 48px;
            line-height: 1.4;
        }

        .employee {
            margin-bottom: 72px;
        }

        .employee-header {
            margin-bottom: 18px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
        }

        .employee-name {
            font-size: 18px;
            font-weight: 600;
        }

        .employee-role {
            font-size: 12px;
            color: #666;
        }

        .report {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 16px;
            margin-top: 16px;
        }

        .report-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .report-meta {
            font-size: 11px;
            color: #555;
            margin-bottom: 8px;
        }

        .report-content {
            font-size: 13px;
            line-height: 1.6;
            white-space: pre-wrap;
        }

        .mood {
            display: inline-block;
            margin-top: 10px;
            padding: 4px 12px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 600;
        }

        .mood-success {
            background: #e6f9f0;
            color: #067647;
        }

        .mood-neutral {
            background: #eef2ff;
            color: #3730a3;
        }

        .mood-blocked {
            background: #fee2e2;
            color: #991b1b;
        }
    </style>
</head>
<body>

    <h1>Reporte semanal</h1>
    <div class="subtitle">
        Área: <strong>${areaName}</strong><br />
        Semana del <strong>${formatShortDate(weekStart)}</strong> al
        <strong>${formatShortDate(weekEnd)}</strong>
    </div>

    ${Array.from(groupedByEmployee.entries())
        .map(([employeeName, employeeReports]) => {
            const role = employeeReports[0].employee_role ?? "Sin puesto";

            return `
        <section class="employee">
            <div class="employee-header">
                <div class="employee-name">${employeeName}</div>
                <div class="employee-role">${role}</div>
            </div>

            ${employeeReports
                .map(
                    report => `
            <div class="report">
                <div class="report-title">
                    ${report.title || "Reporte diario"}
                </div>

                <div class="report-meta">
                    ${formatDate(report.created_at)} — ${formatTime(report.created_at)}
                </div>

                <div class="report-content">
                    ${report.content}
                </div>

                <span class="mood ${getMoodClass(report.mood)}">
                    ${getMoodLabel(report.mood)}
                </span>
            </div>
            `
                )
                .join("")}
        </section>
        `;
        })
        .join("")}

</body>
</html>
`;
}
