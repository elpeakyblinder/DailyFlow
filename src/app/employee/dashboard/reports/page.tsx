import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    FileText,
    Plus,
    Clock,
    ChevronRight,
} from "lucide-react";
import { ReportFilters } from "@/app/components/ReportFilters";
import { HeaderDashboard } from "@/app/components/HeaderDashboard";
import { getUserProfile } from "@/lib/data";

const RECENT_REPORTS = [
    {
        id: 1,
        date: "Enero 20, 2026",
        time: "5:30 PM",
        preview: "Integración de API de pagos completada. Reunión con diseño...",
    },
    {
        id: 2,
        date: "Enero 19, 2026",
        time: "6:15 PM",
        preview: "Corrección de bugs en el login y refactorización del navbar...",
    },
    {
        id: 3,
        date: "Enero 18, 2026",
        time: "4:45 PM",
        preview: "Despliegue a producción de la versión 1.0.2 exitoso...",
    },
];

export default async function EmployeeDashboard() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const data = await getUserProfile(session.user.id);

    const displayName = data?.full_name || session.user.email || "Usuario";
    const displayJob = data?.job_title || "Sin cargo definido";

    return (
        <main className="min-h-screen w-full bg-background text-foreground flex justify-center p-4 md:p-8">
            <div className="w-full max-w-2xl space-y-8">

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
                        <Plus size={18} className="group-hover:scale-110 transition-transform" />
                        Crear Reporte
                    </Link>
                </section>

                <section className="space-y-4">
                    <ReportFilters />
                    <div className="grid gap-3">
                        {RECENT_REPORTS.map((report) => (
                            <div
                                key={report.id}
                                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-colors cursor-pointer"
                            >
                                <div className="h-10 w-10 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                    <FileText size={20} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                        <span className="font-medium text-foreground">{report.date}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {report.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate group-hover:text-foreground transition-colors">
                                        {report.preview}
                                    </p>
                                </div>

                                <ChevronRight size={18} className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}