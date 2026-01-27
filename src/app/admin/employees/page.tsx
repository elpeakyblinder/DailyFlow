import React from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Mail,
    Briefcase,
    Calendar,
    CheckCircle2,
    AlertCircle,
    MinusCircle,
    ImageIcon
} from "lucide-react";
import { ReportFilters } from "@/app/components/ReportFilters";
import Image from 'next/image';

const EMPLOYEE_PROFILE = {
    id: "1",
    name: "Juan Pérez",
    role: "Frontend Developer",
    team: "Desarrollo",
    email: "juan@carbon.com",
    joinedAt: "10 Ene, 2024",
    stats: {
        totalReports: 142,
        streak: 12, 
        lastActive: "Hace 2 horas"
    }
};

const REPORTS_HISTORY = [
    {
        id: "r1",
        date: "Hoy, 20 Ene",
        time: "17:30",
        mood: "success",
        content: "Se finalizó la integración con la API de Stripe. Hubo algunos problemas con los webhooks en local pero se solucionaron usando Ngrok. Queda pendiente probar los refund.",
        images: [
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
        ]
    },
    {
        id: "r2",
        date: "Ayer, 19 Ene",
        time: "18:00",
        mood: "neutral",
        content: "Día tranquilo refactorizando el componente de Navbar. Se redujo el bundle size en un 15%.",
        images: []
    },
    {
        id: "r3",
        date: "18 Ene, 2026",
        time: "16:45",
        mood: "blocked",
        content: "No pude avanzar mucho con el módulo de usuarios porque el servidor de staging estuvo caído toda la mañana. Aproveché para adelantar documentación.",
        images: []
    }
];

export default function EmployeeHistoryPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen w-full bg-background text-foreground p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/dashboard"
                        className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-lg font-medium text-muted-foreground">
                        Volver al Dashboard
                    </h1>
                </div>

                <header className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
                    <div className="flex items-start gap-5">
                        <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
                            {getInitials(EMPLOYEE_PROFILE.name)}
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight">{EMPLOYEE_PROFILE.name}</h2>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <Briefcase size={14} /> {EMPLOYEE_PROFILE.role}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Mail size={14} /> {EMPLOYEE_PROFILE.email}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} /> Desde {EMPLOYEE_PROFILE.joinedAt}
                                </span>
                            </div>
                            <div className="pt-2">
                                <span className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-medium border border-border">
                                    Equipo {EMPLOYEE_PROFILE.team}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-8 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8">
                        <div>
                            <p className="text-2xl font-bold">{EMPLOYEE_PROFILE.stats.totalReports}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Reportes</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-emerald-500">{EMPLOYEE_PROFILE.stats.streak} días</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Racha Actual</p>
                        </div>
                    </div>
                </header>

                <section>
                    <ReportFilters
                        title="Bitácora de Actividades"
                        searchPlaceholder="Buscar en el historial de Juan..."
                    />
                </section>

                <section className="space-y-6 relative border-l border-border/50 ml-4 md:ml-6 pl-8 pb-10">
                    {REPORTS_HISTORY.map((report) => (
                        <div key={report.id} className="relative group">

                            <div className={`absolute -left-10.75 top-0 p-1.5 rounded-full border-4 border-background ${getMoodStyles(report.mood)}`}>
                                {getMoodIcon(report.mood)}
                            </div>

                            <article className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors shadow-sm">

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-foreground">{report.date}</span>
                                        <span className="text-muted-foreground text-sm">• {report.time}</span>
                                    </div>
                                    <MoodBadge mood={report.mood} />
                                </div>

                                <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                                    {report.content}
                                </p>

                                {report.images.length > 0 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {report.images.map((img, idx) => (
                                            <div key={idx} className="relative h-24 w-36 shrink-0 rounded-lg overflow-hidden border border-border group/image">
                                                <Image
                                                    src={img}
                                                    alt="Evidencia"
                                                    className="h-full w-full object-cover transition-transform group-hover/image:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                                    <ImageIcon className="text-white" size={20} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </article>
                        </div>
                    ))}
                </section>

            </div>
        </div>
    );
}

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getMoodStyles(mood: string) {
    switch (mood) {
        case 'success': return "bg-emerald-500 text-white";
        case 'blocked': return "bg-destructive text-white";
        default: return "bg-secondary text-muted-foreground";
    }
}

function getMoodIcon(mood: string) {
    switch (mood) {
        case 'success': return <CheckCircle2 size={16} />;
        case 'blocked': return <AlertCircle size={16} />;
        default: return <MinusCircle size={16} />;
    }
}

function MoodBadge({ mood }: { mood: string }) {
    const styles = {
        success: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        blocked: "text-red-500 bg-red-500/10 border-red-500/20",
        neutral: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    };

    const labels = {
        success: "Productivo",
        blocked: "Bloqueado",
        neutral: "Normal"
    };

    return (
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${styles[mood as keyof typeof styles]}`}>
            {labels[mood as keyof typeof labels]}
        </span>
    );
}