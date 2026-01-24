import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { HeaderDashboard } from "@/app/components/HeaderDashboard";
import { getUserProfile } from "@/lib/data";

export default async function DashboardHome() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const data = await getUserProfile(session.user.id);

  const displayName = data?.full_name || session.user.email || "Usuario";
  const displayJob = data?.job_title || "Sin cargo definido";

  return (
    <main className="min-h-screen bg-background p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-10">

        <HeaderDashboard
          displayName={displayName}
          displayJob={displayJob}
        />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Mis Grupos de Trabajo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.team_name ? (
              <Link
                href="/employee/dashboard/reports"
                className="group relative overflow-hidden bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={20} className="text-primary -translate-x-2 group-hover:translate-x-0 transition-transform" />
                </div>

                <div className="mb-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
                    <Users size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{data.team_name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {data.team_desc || "Espacio de trabajo general"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 w-fit px-3 py-1 rounded-full">
                  <span>Espacio activo</span>
                </div>
              </Link>
            ) : (
              <div className="col-span-full p-8 border border-dashed border-border rounded-xl text-center text-muted-foreground">
                <p>No tienes ningún grupo asignado todavía.</p>
                <p className="text-xs mt-1">Contacta a tu administrador.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}