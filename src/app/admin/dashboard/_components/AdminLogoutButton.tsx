"use client";

import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { logoutAction } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        const toastId = toast("¿Cerrar sesión?", {
            description: "¿Estás seguro de que deseas salir?",
            action: {
                label: "Sí, salir",
                onClick: async () => {
                    toast.dismiss(toastId);

                    const loadingId = toast.loading("Cerrando sesión...");

                    try {
                        await logoutAction();
                        toast.success("Sesión cerrada", { id: loadingId });
                        router.push("/auth/login");
                        router.refresh();
                    } catch {
                        toast.error("Error al cerrar sesión", { id: loadingId });
                    }
                },
            },
            cancel: {
                label: "Cancelar",
                onClick: () => toast.dismiss(),
            },
            duration: 5000,
        });
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors"
        >
            <LogOut size={16} />
            Cerrar sesión
        </button>
    );
}
