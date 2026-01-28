"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users,
    Briefcase,
    ChevronDown,
    ChevronRight,
    FileDown,
} from "lucide-react";


interface Employee {
    id: string;
    name: string;
    role: string;
    lastReportAt: string | null;
}

interface AreaGroup {
    areaId: string;
    areaName: string;
    employees: Employee[];
}

interface Props {
    areas?: AreaGroup[];
}

export default function AdminDashboard({ areas = [] }: Props) {
    if (areas.length === 0) {
        return (
            <main className="flex-1 p-6 text-muted-foreground">
                No hay áreas registradas.
            </main>
        );
    }

    return (
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            {areas.map(area => (
                <AreaCard key={area.areaId} area={area} />
            ))}
        </main>
    );
}

function AreaCard({ area }: { area: AreaGroup }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border border-border rounded-2xl bg-card shadow-sm">
            <div
                className="flex items-center justify-between p-5 cursor-pointer"
                onClick={() => setIsOpen(prev => !prev)}
            >
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Users size={22} />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">
                            {area.areaName}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {area.employees.length} empleados
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* PDF SEMANAL */}
                    <a
                        href={`/api/reports/export-weekly?area=${area.areaId}&week=current`}
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <FileDown size={16} />
                        PDF semana actual
                    </a>

                    {isOpen ? <ChevronDown /> : <ChevronRight />}
                </div>
            </div>

            {isOpen && (
                <div className="border-t border-border divide-y divide-border">
                    {area.employees.map(emp => (
                        <Link
                            key={emp.id}
                            href={`/admin/employees/${emp.id}?area=${area.areaId}`}
                            className="flex items-center justify-between p-4 hover:bg-secondary/40 transition-colors"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                    {getInitials(emp.name)}
                                </div>

                                <div className="min-w-0">
                                    <p className="font-medium truncate">
                                        {emp.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Briefcase size={12} />
                                        {emp.role}
                                    </p>
                                </div>
                            </div>

                            <span className="text-xs text-muted-foreground shrink-0">
                                {emp.lastReportAt
                                    ? new Date(emp.lastReportAt).toLocaleString("es-MX", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })
                                    : "Sin reportes"}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}
