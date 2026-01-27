import React from "react";
import { ReportForm } from "@/app/components/ReportForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewReportPage() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/employee/dashboard/reports" className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-muted-foreground" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Nuevo Reporte</h1>
                </div>

                <ReportForm />

            </div>
        </div>
    );
}