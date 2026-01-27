import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getReportById } from "@/lib/data";
import { ReportForm } from "@/app/components/ReportForm";
import { auth } from "@/auth";

export default async function ReportDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const session = await auth();
    const report = await getReportById(params.id);

    if (!report) {
        notFound();
    }

    const formattedData = {
        title: report.title,
        content: report.content,
        mood: report.mood,
        images: report.images.map((img) => img.image_url),
        date: report.created_at.toISOString(),
    };

    return (
        <main className="min-h-screen w-full bg-background text-foreground flex justify-center p-4 md:p-8">
            <div className="w-full max-w-3xl space-y-6">

                <div className="flex items-center gap-4">
                    <Link
                        href="/employee/dashboard"
                        className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-semibold">Detalles del Reporte</h1>
                </div>

                <ReportForm
                    readOnly={true}
                    initialData={formattedData}
                />

                <div className="text-center text-xs text-muted-foreground pt-4">
                    Reporte creado el {new Date(report.created_at).toLocaleDateString("es-MX", { dateStyle: "long" })} a las {new Date(report.created_at).toLocaleTimeString("es-MX", { timeStyle: "short" })}
                </div>
            </div>
        </main>
    );
}