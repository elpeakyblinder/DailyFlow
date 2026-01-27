import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import { getReportById } from "@/lib/data";
import { ReportForm } from "@/app/components/ReportForm";
import { isUserRole } from "@/types";
import { formatDateMX, formatTimeMX } from "@/utils/date";

export default async function AdminReportDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ employee?: string; team?: string }>;
}) {
    const { id } = await params;
    const { employee, team } = await searchParams;

    const session = await auth();

    if (
        !session?.user?.id ||
        !isUserRole(session.user.role) ||
        session.user.role !== "admin"
    ) {
        redirect("/employee/dashboard");
    }

    const report = await getReportById(
        id,
        session.user.id,
        session.user.role
    );

    if (!report) {
        notFound();
    }

    const backHref = employee
        ? `/admin/employees/${employee}${team ? `?team=${team}` : ""}`
        : team
            ? `/admin/dashboard?team=${team}`
            : "/admin/dashboard";

    const formattedData = {
        title: report.title,
        content: report.content,
        mood: report.mood,
        images: report.images.map(img => img.image_url),
        date: report.created_at.toISOString(),
    };

    return (
        <main className="min-h-screen w-full bg-background text-foreground flex justify-center p-4 md:p-8">
            <div className="w-full max-w-3xl space-y-6">

                <div className="flex items-center gap-4">
                    <Link
                        href={backHref}
                        className="p-2 rounded-full hover:bg-secondary transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <h1 className="text-xl font-semibold tracking-tight">
                        Detalle del Reporte
                    </h1>
                </div>

                <ReportForm
                    readOnly
                    initialData={formattedData}
                />

                <div className="text-center text-xs text-muted-foreground pt-4">
                    Reporte creado el{" "}
                    {formatDateMX(report.created_at)}{" "}
                    a las{" "}
                    {formatTimeMX(report.created_at)}
                </div>
            </div>
        </main>
    );
}
