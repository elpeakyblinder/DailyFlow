import AdminDashboard from "./_components/AdminDashboard";
import { getEmployeesWithArea } from "@/lib/admin";

interface RawEmployee {
    user_id: string;
    full_name: string;
    job_title: string;
    area_id: string | null;
    area_name: string | null;
    last_report_at: Date | null;
}

export default async function AdminDashboardPage() {
    const rows = await getEmployeesWithArea();

    const areaMap = new Map<string, {
        areaId: string;
        areaName: string;
        employees: {
            id: string;
            name: string;
            role: string;
            lastReportAt: string | null;
        }[];
    }>();

    rows.forEach((row: RawEmployee) => {
        if (!row.area_id || !row.area_name) return;

        if (!areaMap.has(row.area_id)) {
            areaMap.set(row.area_id, {
                areaId: row.area_id,
                areaName: row.area_name,
                employees: [],
            });
        }

        areaMap.get(row.area_id)!.employees.push({
            id: row.user_id,
            name: row.full_name,
            role: row.job_title,
            lastReportAt: row.last_report_at
                ? row.last_report_at.toISOString()
                : null,
        });
    });

    const areas = Array.from(areaMap.values());

    return <AdminDashboard areas={areas} />;
}
