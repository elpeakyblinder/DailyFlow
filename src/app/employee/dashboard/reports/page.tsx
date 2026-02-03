import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    FileText,
    Plus,
    Clock,
    ChevronRight,
    AlertCircle,
} from "lucide-react";
import { ReportFilters } from "@/app/components/ReportFilters";
import { HeaderDashboard } from "@/app/components/HeaderDashboard";
import { getUserProfile, getUserReports } from "@/lib/data";

export default async function EmployeeDashboard() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const [userData, reportsData] = await Promise.all([
        getUserProfile(session.user.id),
        getUserReports(session.user.id),
    ]);

    const displayName = userData?.full_name || session.user.email || "Usuario";
    const displayJob = userData?.job_title || "Sin cargo definido";

    const formatDate = (dateString: Date) => {
        return new Date(dateString).toLocaleDateString("es-MX", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString: Date) => {
        return new Date(dateString).toLocaleTimeString("es-MX", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <main className="min-h-screen w-full bg-background text-foreground flex justify-center p-4 md:p-8">
            <div className="w-full max-w-4xl space-y-8">
                <HeaderDashboard
                    displayName={displayName}
                    displayJob={displayJob}
                />
                <section className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-primary/50">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold tracking-tight">
                            ¿Qué lograste hoy?
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Registra tus avances diarios en cuestión de minutos.
                        </p>
                    </div>
                    <Link
                        href="/employee/dashboard/new-report"
                        className="group flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all w-full sm:w-auto justify-center shadow-[0_0_15px_-3px_var(--color-primary)]"
                    >
                        <Plus
                            size={18}
                            className="group-hover:scale-110 transition-transform"
                        />
                        Crear Reporte
                    </Link>
                </section>
                <section className="space-y-4">
                    <ReportFilters />
                    <div className="grid gap-3">
                        {reportsData.length > 0 ? (
                            reportsData.map((report) => (
                                <Link
                                    key={report.id}
                                    href={`/employee/dashboard/report/${report.id}`}
                                    className="group flex items-start sm:items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-colors cursor-pointer min-w-0"
                                >
                                    <div className="h-10 w-10 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors mt-1 sm:mt-0">
                                        <FileText size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-semibold text-foreground truncate text-sm sm:text-base">
                                                {report.title || "Reporte sin título"}
                                            </h3>
                                            <span 
                                                className="text-xs text-muted-foreground capitalize shrink-0"
                                                suppressHydrationWarning
                                            >
                                                {formatDate(report.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {report.content}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                                            <Clock size={12} />
                                            <span suppressHydrationWarning>
                                                {formatTime(report.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight
                                        size={18}
                                        className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all self-center"
                                    />
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-12 border border-dashed border-border rounded-xl">
                                <div className="flex justify-center mb-3 text-muted-foreground">
                                    <AlertCircle size={32} />
                                </div>
                                <h3 className="text-sm font-medium">Aún no hay reportes</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Tu historial de actividades aparecerá aquí.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}