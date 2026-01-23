import Link from "next/link";
import { ArrowDown } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
      <h1 className="text-4xl uppercase font-bold tracking-widest">
        DailyFlow
      </h1>
      <span className="text-chart-3 text-2xl tracking-widest">
        Genera tus reportes, gestiona los reportes de tu equipo.
      </span>
      <span>
        <ArrowDown />
      </span>
      <Link href="/auth/login" className="text-primary underline">
        Acceder
      </Link>
      </div>
    </main>
  );
}