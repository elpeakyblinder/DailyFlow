"use client";

import Link from "next/link";
import {
    FileText,
    Clock,
    ChevronRight,
    AlertCircle,
} from "lucide-react";

interface Report {
    id: string;
    title: string | null;
    content: string;
    created_at: string;
}

interface Props {
    reports: Report[];
    baseHref: string;
    employeeId: string;
    teamId: string;
}

export function ReportsHistoryList({
    reports,
    baseHref,
    employeeId,
    teamId,
}: Props) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("es-MX", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const formatTime = (date: string) =>
        new Date(date).toLocaleTimeString("es-MX", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    return (
        <section className="space-y-4">
            <div className="grid gap-3">
                {reports.length > 0 ? (
                    reports.map(report => (
                        <Link
                            key={report.id}
                            href={`${baseHref}/${report.id}?team=${teamId}&employee=${employeeId}`}
                            className="group flex items-start sm:items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-colors min-w-0"
                        >
                            <div className="h-10 w-10 shrink-0 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary">
                                <FileText size={20} />
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-semibold truncate text-sm sm:text-base">
                                        {report.title || "Reporte sin título"}
                                    </h3>
                                    <span 
                                        className="text-xs text-muted-foreground shrink-0"
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
                                className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all"
                            />
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-12 border border-dashed border-border rounded-xl">
                        <AlertCircle size={32} className="mx-auto mb-3 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Aún no hay reportes</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            El historial de actividades aparecerá aquí.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}