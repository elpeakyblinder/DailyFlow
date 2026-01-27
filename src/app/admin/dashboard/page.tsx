import { getTeamEmployees } from "@/lib/admin";
import AdminDashboard from "./_components/AdminDashboard";

export default async function AdminDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ team?: string }>;
}) {
    const { team } = await searchParams;

    if (!team) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Selecciona un equipo
            </div>
        );
    }

    const employees = await getTeamEmployees(team);

    return (
        <AdminDashboard
            selectedTeamId={team}
            employees={employees}
        />
    );
}
