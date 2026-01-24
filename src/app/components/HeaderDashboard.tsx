import React from "react";
import { Briefcase, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth-actions";

interface UserProfileHeaderProps {
    displayName: string;
    displayJob: string;
    initials?: string;
}

export function HeaderDashboard({
    displayName,
    displayJob,
    initials
}: UserProfileHeaderProps) {

    const finalInitials = initials || displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <header className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-card border border-border p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold border border-primary/20">
                    {finalInitials}
                </div>

                <div className="text-center sm:text-left">
                    <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start mt-1">
                        <Briefcase size={14} />
                        <span className="text-sm">{displayJob}</span>
                    </div>
                </div>
            </div>

            <form action={logoutAction}>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium"
                >
                    <LogOut size={16} />
                    Cerrar Sesión
                </button>
            </form>
        </header>
    );
}