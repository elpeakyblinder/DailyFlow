import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";
import AdminDashboard from "./_components/AdminDashboard";
import { getTeamEmployees } from "@/lib/admin";

export default async function AdminDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ team?: string }>;
}) {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "admin") {
        redirect("/employee/dashboard");
    }

    const { team } = await searchParams;

    if (!team) {
        return (
            <div className="min-h-screen w-full bg-background text-foreground flex">
                <AdminSidebar adminId={session.user.id} />
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    Selecciona un equipo
                </div>
            </div>
        );
    }

    const employees = await getTeamEmployees(team);

    return (
        <div className="min-h-screen w-full bg-background text-foreground flex">
            <AdminSidebar adminId={session.user.id} />
            <AdminDashboard
                selectedTeamId={team}
                employees={employees}
            />
        </div>
    );
}
