'use client'; // Necesario para manejar el estado del filtro

import React, { useState } from "react";
import Link from "next/link";
import {
    Users,
    Search,
    Briefcase,
    Layers,
    Plus,
    Settings
} from "lucide-react";

// --- DATOS MOCK (Simulando lo que vendría de tu DB con el JOIN de teams) ---
const GROUPS = [
    { id: "all", name: "Todos los Empleados", count: 12 },
    { id: "dev", name: "Desarrollo", count: 5 },
    { id: "design", name: "Diseño & UX", count: 3 },
    { id: "sales", name: "Ventas", count: 4 },
];

const EMPLOYEES = [
    {
        id: "1",
        name: "Juan Pérez",
        role: "Frontend Dev",
        groupId: "dev", // Relación con el grupo
        lastReport: "Hace 2 horas",
        status: "active",
        avatarColor: "bg-blue-500/10 text-blue-500",
    },
    {
        id: "2",
        name: "María González",
        role: "Product Designer",
        groupId: "design",
        lastReport: "Ayer, 5:30 PM",
        status: "active",
        avatarColor: "bg-purple-500/10 text-purple-500",
    },
    {
        id: "3",
        name: "Carlos Ruiz",
        role: "Backend Lead",
        groupId: "dev",
        lastReport: "Hace 15 min",
        status: "active",
        avatarColor: "bg-emerald-500/10 text-emerald-500",
    },
    {
        id: "4",
        name: "Ana López",
        role: "Account Manager",
        groupId: "sales",
        lastReport: "Hace 3 días",
        status: "inactive",
        avatarColor: "bg-orange-500/10 text-orange-500",
    },
];

export default function AdminDashboard() {
    const [selectedGroup, setSelectedGroup] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Lógica de Filtrado
    const filteredEmployees = EMPLOYEES.filter((emp) => {
        const matchesGroup = selectedGroup === "all" || emp.groupId === selectedGroup;
        const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesGroup && matchesSearch;
    });

    const currentGroupInfo = GROUPS.find(g => g.id === selectedGroup);

    return (
        <div className="min-h-screen w-full bg-background text-foreground flex">

            <aside className="w-64 border-r border-border bg-card/30 hidden md:flex flex-col">
                <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                            C
                        </div>
                        Carbon
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    <p className="px-3 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                        Grupos
                    </p>
                    {GROUPS.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => setSelectedGroup(group.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedGroup === group.id
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Layers size={16} />
                                {group.name}
                            </div>
                            {group.id !== 'all' && (
                                <span className="text-xs bg-background/50 px-1.5 py-0.5 rounded-md border border-border/50">
                                    {group.count}
                                </span>
                            )}
                        </button>
                    ))}

                    <button className="w-full flex items-center gap-3 px-3 py-2 mt-4 text-sm text-muted-foreground hover:text-primary transition-colors border border-dashed border-border rounded-lg hover:bg-secondary/50">
                        <Plus size={16} />
                        Crear nuevo grupo
                    </button>
                </div>

                <div className="p-4 border-t border-border/50">
                    <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <Settings size={16} /> Configuración
                    </button>
                </div>
            </aside>

            {/* 2. ÁREA PRINCIPAL (Derecha) */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* Header Superior */}
                <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        {currentGroupInfo?.name}
                        <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                            {filteredEmployees.length} miembros
                        </span>
                    </h2>

                    <div className="flex items-center gap-4">
                        {/* Buscador Integrado */}
                        <div className="relative w-64 hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                            <input
                                type="text"
                                placeholder="Buscar en este grupo..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-9 pl-9 pr-4 rounded-md bg-secondary/50 border border-transparent 
                         focus:border-primary/50 focus:bg-background focus:ring-1 focus:ring-primary/20 
                         text-sm outline-none transition-all placeholder:text-muted-foreground"
                            />
                        </div>

                        {/* Botón de Invitar Contextual */}
                        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_10px_-3px_var(--color-primary)]">
                            <Plus size={16} />
                            <span className="hidden sm:inline">Invitar al grupo</span>
                        </button>
                    </div>
                </header>

                {/* Grid de Contenido */}
                <div className="p-6 overflow-y-auto">
                    {filteredEmployees.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users size={24} opacity={0.5} />
                            </div>
                            <p>No se encontraron empleados en este grupo.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredEmployees.map((employee) => (
                                <Link
                                    key={employee.id}
                                    href={`/admin/employees/${employee.id}`}
                                    className="group relative bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-sm ${employee.avatarColor}`}>
                                            {getInitials(employee.name)}
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${employee.status === 'active' ? 'bg-emerald-500' : 'bg-gray-600'}`} title={employee.status} />
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-foreground truncate">{employee.name}</h3>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                            <Briefcase size={12} /> {employee.role}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
                                        <span>Último reporte</span>
                                        <span className="text-foreground">{employee.lastReport}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}