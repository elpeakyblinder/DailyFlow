import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./dashboard/_components/AdminSidebar";
import { getAdminTeams } from "@/lib/admin";
import { getUserProfile } from "@/lib/data";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "admin") {
        redirect("/employee/dashboard");
    }

    const [profile, teams] = await Promise.all([
        getUserProfile(session.user.id),
        getAdminTeams(session.user.id),
    ]);

    return (
        <div className="min-h-screen w-full bg-background text-foreground flex">
            <AdminSidebar
                adminId={session.user.id}
                profile={profile}
                teams={teams}
            />
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    );
}
