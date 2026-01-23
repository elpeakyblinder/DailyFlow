import Link from "next/link";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image src="/logo/completedLogoDailyFlow.webp" alt="DailyFlow Logo" width={500} height={500} />
        <h1 className="text-4xl uppercase font-bold tracking-widest hidden">
          DailyFlow
        </h1>
        <span className="text-chart-3 text-2xl tracking-widest mt-2">
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