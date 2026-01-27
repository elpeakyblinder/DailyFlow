import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Briefcase, User } from "lucide-react";

import { auth } from "@/auth";
import { getUserProfile, getReportsByUserId } from "@/lib/data";
import { ReportsHistoryList } from "@/app/admin/dashboard/_components/ReportsHistoryList";
import { ReportFilters } from "@/app/components/ReportFilters";

export default async function AdminEmployeeReportsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ team?: string }>;
}) {
    const { id } = await params;
    const { team } = await searchParams;

    const session = await auth();

    if (!session?.user?.id || session.user.role !== "admin") {
        redirect("/employee/dashboard");
    }

    const [employee, reports] = await Promise.all([
        getUserProfile(id),
        getReportsByUserId(id),
    ]);

    if (!employee) {
        notFound();
    }

    const formattedReports = reports.map(report => ({
        id: report.id,
        title: report.title,
        content: report.content,
        created_at: report.created_at.toISOString(),
    }));

    return (
        <main className="min-h-screen w-full bg-background text-foreground flex justify-center p-4 md:p-8">
            <div className="w-full max-w-4xl space-y-8">
                <div className="flex items-center gap-4">
                    <Link
                        href={team ? `/admin/dashboard?team=${team}` : "/admin/dashboard"}
                        className="p-2 rounded-full hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {employee.full_name?.[0] ?? "U"}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">
                                {employee.full_name}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Briefcase size={12} />
                                {employee.job_title ?? "Sin puesto"}
                            </div>
                        </div>
                    </div>
                </div>

                <ReportFilters />
                <div className="border border-border rounded-xl bg-card p-6">
                    <div className="flex items-center gap-2 mb-4 text-sm font-medium">
                        <User size={16} />
                        Historial de reportes
                        <span className="text-xs text-muted-foreground">
                            ({reports.length})
                        </span>
                    </div>

                    <ReportsHistoryList
                        reports={formattedReports}
                        baseHref="/admin/reports"
                        employeeId={id}
                        teamId={team || ""}
                    />
                </div>

            </div>
        </main>
    );
}
