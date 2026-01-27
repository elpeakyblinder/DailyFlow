'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react';
import { loginAction } from "@/actions/auth-actions";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const result = await loginAction(email, password);

        if (!result.ok) {
            toast.error(result.message);
            setIsLoading(false);
            return;
        }

        toast.success("¡Bienvenido!");
        router.replace("/employee/dashboard");
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-2xl shadow-xl">

                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
                        <Lock size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Accede a DailyFlow
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Correo Electrónico
                            </label>
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-secondary/50 focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder='correo@ejemplo.com'
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Contraseña
                            </label>
                            <div className="relative mt-1">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-secondary/50 focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder='••••••••'
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Entrando...
                            </>
                        ) : (
                            <>
                                Iniciar Sesión
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
