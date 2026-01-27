import Link from "next/link";
import {
    Briefcase,
    Layers,
    Plus,
    Settings,
} from "lucide-react";
import { getAdminTeams } from "@/lib/admin";
import { getUserProfile } from "@/lib/data";
import AdminLogoutButton from "./AdminLogoutButton";

interface Props {
    adminId: string;
}

export default async function AdminSidebar({ adminId }: Props) {
    const [profile, teams] = await Promise.all([
        getUserProfile(adminId),
        getAdminTeams(adminId),
    ]);

    return (
        <aside className="w-64 border-r border-border bg-card/30 hidden md:flex flex-col">

            <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary">
                        {profile?.full_name?.[0] ?? "A"}
                    </div>
                    <div>
                        <h1 className="font-semibold">
                            {profile?.full_name}
                        </h1>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Briefcase size={12} />
                            {profile?.job_title ?? "Administrador"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <p className="px-3 text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Equipos
                </p>

                {teams.map(team => (
                    <Link
                        key={team.id}
                        href={`/admin/dashboard?team=${team.id}`}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Layers size={16} />
                            {team.name}
                        </div>
                        <span className="text-xs bg-background/50 px-1.5 py-0.5 rounded-md border border-border/50">
                            {team.members}
                        </span>
                    </Link>
                ))}

                <Link
                    href="/admin/teams/new"
                    className="w-full flex items-center gap-3 px-3 py-2 mt-4 text-sm text-muted-foreground hover:text-primary transition-colors border border-dashed border-border rounded-lg hover:bg-secondary/50"
                >
                    <Plus size={16} />
                    Crear nuevo equipo
                </Link>
            </div>

            <div className="p-4 border-t border-border/50 space-y-1">
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
