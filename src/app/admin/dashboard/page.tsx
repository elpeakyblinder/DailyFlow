import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";
import AdminDashboard from "./_components/AdminDashboard";

export default async function AdminDashboardPage() {
    const session = await auth();

    if (!session?.user?.id || session.user.role !== "admin") {
        redirect("/employee/dashboard");
    }

    return (
        <div className="min-h-screen w-full bg-background text-foreground flex">
            <AdminSidebar adminId={session.user.id} />
            <AdminDashboard />
        </div>
    );
}
