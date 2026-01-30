"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users,
    Briefcase,
    ChevronDown,
    ChevronRight,
    FileDown,
    Code2,
    CircuitBoard,
    Scale,
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

const getAreaStyle = (name: string) => {
    const lower = name.toLowerCase();

    if (lower.includes("web") || lower.includes("desarrollo")) {
        return {
            icon: <Code2 size={22} />,
            css: "bg-blue-500/10 text-blue-500",
        };
    }

    if (lower.includes("n8n")) {
        return {
            icon: <CircuitBoard size={22} />,
            css: "bg-orange-500/10 text-orange-500",
        };
    }

    if (lower.includes("licitaci") || lower.includes("legal")) {
        return {
            icon: <Scale size={22} />,
            css: "bg-purple-500/10 text-purple-500",
        };
    }

    return {
        icon: <Users size={22} />,
        css: "bg-primary/10 text-primary",
    };
};

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
    const style = getAreaStyle(area.areaName);

    return (
        <div className="border border-border rounded-2xl bg-card shadow-sm">
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="w-full flex items-center justify-between p-5 cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`h-12 w-12 rounded-xl flex items-center justify-center ${style.css}`}
                    >
                        {style.icon}
                    </div>

                    <div className="text-left">
                        <h2 className="text-lg font-semibold">
                            {area.areaName}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            {area.employees.length} empleados
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={`/api/reports/export-weekly?area=${area.areaId}`}
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <FileDown size={16} />
                        PDF semana actual
                    </a>

                    <ChevronDown
                        className={`transition-transform duration-300 ${
                            isOpen ? "rotate-0" : "-rotate-90"
                        }`}
                    />
                </div>
            </button>

            <div
                className={`
                    grid transition-all duration-300 ease-in-out
                    ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                `}
            >
                <div className="overflow-hidden border-t border-border divide-y divide-border">
                    {area.employees.map(emp => (
                        <EmployeeRow
                            key={emp.id}
                            employee={emp}
                            areaId={area.areaId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function EmployeeRow({
    employee,
    areaId,
}: {
    employee: Employee;
    areaId: string;
}) {
    return (
        <Link
            href={`/admin/employees/${employee.id}?area=${areaId}`}
            className="
                group flex items-center justify-between p-4
                transition-all duration-200
                hover:bg-secondary/40
            "
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {getInitials(employee.name)}
                </div>

                <div className="min-w-0">
                    <p className="font-medium truncate">
                        {employee.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Briefcase size={12} />
                        {employee.role}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:block">
                    {employee.lastReportAt
                        ? new Date(employee.lastReportAt).toLocaleString("es-MX", {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })
                        : "Sin reportes"}
                </span>

                <ChevronRight
                    size={16}
                    className="
                        text-muted-foreground
                        transition-transform duration-200
                        group-hover:translate-x-1
                        group-hover:text-foreground
                    "
                />
            </div>
        </Link>
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
