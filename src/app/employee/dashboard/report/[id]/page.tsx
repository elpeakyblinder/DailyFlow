import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { getReportById } from "@/lib/data";
import { ReportForm } from "@/app/components/ReportForm";
import { isUserRole } from "@/types";
import { formatDateMX, formatTimeMX } from "@/utils/date";

export default async function ReportDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const session = await auth();

    if (
        !session?.user?.id ||
        !isUserRole(session.user.role)
    ) {
        notFound();
    }

    const report = await getReportById(
        id,
        session.user.id,
        session.user.role
    );

    if (!report) {
        notFound();
    }

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
                    <Link href="/employee/dashboard/reports" className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Detalles del Reporte
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
