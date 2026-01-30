"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import {
    Briefcase,
    Layers,
    Plus,
    Settings,
} from "lucide-react";
import AdminLogoutButton from "./AdminLogoutButton";

interface Team {
    id: string;
    name: string;
    members: number;
}

interface Profile {
    full_name?: string;
    job_title?: string;
}

interface Props {
    adminId: string;
    teams: Team[];
    profile: Profile | null;
}

export default function AdminSidebar({
    teams,
    profile,
}: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const activeTeamId = searchParams.get("team") ?? teams[0]?.id ?? null;

    useEffect(() => {
        const isDashboard = pathname === "/admin/dashboard";
        
        if (isDashboard && !searchParams.get("team") && teams.length > 0) {
            router.replace(`/admin/dashboard?team=${teams[0].id}`);
        }
    }, [searchParams, teams, router, pathname]);

    return (
        <aside className="w-64 h-full border-r border-border bg-card/30 hidden md:flex flex-col shrink-0">

            <div className="p-6 border-b border-border/50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary shrink-0">
                        {profile?.full_name?.[0] ?? "A"}
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-semibold truncate">
                            {profile?.full_name}
                        </h1>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                            <Briefcase size={12} className="shrink-0" />
                            <span className="truncate">{profile?.job_title ?? "Administrador"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/50">
                <p className="px-3 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Equipos
                </p>

                {teams.map(team => {
                    const isActive = team.id === activeTeamId;

                    return (
                        <Link
                            key={team.id}
                            href={`/admin/dashboard?team=${team.id}`}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all
                                ${isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                }`}
                        >
                            <div className="flex items-center gap-3 truncate">
                                <Layers size={16} className="shrink-0" />
                                <span className="truncate">{team.name}</span>
                            </div>
                            <span className="text-xs bg-background/50 px-1.5 py-0.5 rounded-md border border-border/50 shrink-0">
                                {team.members}
                            </span>
                        </Link>
                    );
                })}

                <Link
                    href="/admin/teams/new"
                    className="w-full flex items-center gap-3 px-3 py-2 mt-4 text-sm text-muted-foreground hover:text-primary transition-colors border border-dashed border-border rounded-lg hover:bg-secondary/50"
                >
                    <Plus size={16} />
                    Crear nuevo equipo
                </Link>
            </div>

            <div className="p-4 border-t border-border/50 space-y-1 shrink-0">
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Settings size={16} />
                    Configuración
                </Link>

                <AdminLogoutButton />
            </div>
        </aside>
    );
}