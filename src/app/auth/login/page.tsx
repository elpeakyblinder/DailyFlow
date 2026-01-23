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

        const loginPromise = new Promise(async (resolve, reject) => {
            try {
                const result = await loginAction(email, password);

                if (result?.error) {
                    reject(result.error);
                } else {
                    resolve("¡Bienvenido!");
                    
                    setTimeout(() => {
                        if (result.role === 'admin') {
                            router.push("/admin/dashboard");
                        } else {
                            router.push("/employee/dashboard");
                        }
                        router.refresh(); 
                    }, 500);
                }
            } catch (err) {
                reject("Ocurrió un error inesperado.");
            }
        });

        toast.promise(loginPromise, {
            loading: 'Verificando credenciales...',
            success: (msg) => `${msg}`,
            error: (err) => {
                setIsLoading(false);
                return `${err}`;
            },
        });
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
                        ¡Ingresa tus credenciales para crear tus reportes!
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="ejemplo@empresa.com"
                                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">
                                    Contraseña
                                </label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_var(--color-primary)]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Entrando...</span>
                            </>
                        ) : (
                            <>
                                <span>Iniciar Sesión</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-muted-foreground">
                    ¿Olvidaste tu contraseña? <span className="text-primary cursor-pointer hover:underline">Contacta a soporte</span>
                </p>
            </div>
        </div>
    );
}