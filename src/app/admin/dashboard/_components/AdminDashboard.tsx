"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
    Users,
    Search,
    Briefcase,
    ChevronRight,
} from "lucide-react";

type EmployeeStatus = "active" | "inactive";

interface Employee {
    id: string;
    name: string;
    role: string;
    teamId: string;
    lastReport: string;
    status: EmployeeStatus;
    avatarColor: string;
}

const EMPLOYEES: Employee[] = [
    {
        id: "1",
        name: "Juan Pérez",
        role: "Frontend Developer",
        teamId: "team-1",
        lastReport: "Hace 2 horas",
        status: "active",
        avatarColor: "bg-blue-500/10 text-blue-500",
    },
    {
        id: "2",
        name: "María González",
        role: "Product Designer",
        teamId: "team-1",
        lastReport: "Ayer, 5:30 PM",
        status: "active",
        avatarColor: "bg-purple-500/10 text-purple-500",
    },
    {
        id: "3",
        name: "Carlos Ruiz",
        role: "Backend Lead",
        teamId: "team-2",
        lastReport: "Hace 15 min",
        status: "active",
        avatarColor: "bg-emerald-500/10 text-emerald-500",
    },
    {
        id: "4",
        name: "Ana López",
        role: "Account Manager",
        teamId: "team-3",
        lastReport: "Hace 3 días",
        status: "inactive",
        avatarColor: "bg-orange-500/10 text-orange-500",
    },
];

interface Props {
    selectedTeamId?: string;
}

export default function AdminDashboard({ selectedTeamId = "team-1" }: Props) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEmployees = useMemo(() => {
        return EMPLOYEES.filter(emp => {
            const matchesTeam = emp.teamId === selectedTeamId;
            const matchesSearch =
                emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.role.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesTeam && matchesSearch;
        });
    }, [searchQuery, selectedTeamId]);

    return (
        <main className="flex-1 flex flex-col min-w-0">

            <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    Empleados del equipo
                    <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        {filteredEmployees.length}
                    </span>
                </h2>

                <div className="relative w-64 hidden sm:block">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                        type="text"
                        placeholder="Buscar empleado..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-9 pl-9 pr-4 rounded-md bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-1 focus:ring-primary/20 text-sm outline-none transition-all placeholder:text-muted-foreground"
                    />
                </div>
            </header>

            <div className="p-6 overflow-y-auto">
                {filteredEmployees.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={24} opacity={0.5} />
                        </div>
                        <p>No hay empleados en este equipo.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredEmployees.map(employee => (
                            <Link
                                key={employee.id}
                                href={`/admin/employees/${employee.id}`}
                                className="group relative bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 min-w-0"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div
                                        className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm ${employee.avatarColor}`}
                                    >
                                        {getInitials(employee.name)}
                                    </div>
                                    <div
                                        className={`w-2 h-2 rounded-full ${employee.status === "active"
                                            ? "bg-emerald-500"
                                            : "bg-gray-600"
                                            }`}
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="font-medium text-foreground truncate">
                                        {employee.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 truncate">
                                        <Briefcase size={12} />
                                        {employee.role}
                                    </p>
                                </div>

                                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                                    <span>Último reporte</span>
                                    <span className="text-foreground">
                                        {employee.lastReport}
                                    </span>
                                </div>

                                <ChevronRight
                                    size={16}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all"
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
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
