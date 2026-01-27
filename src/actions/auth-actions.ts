"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(email: string, password: string) {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        return { ok: true };
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return {
                    ok: false,
                    message: "Credenciales incorrectas",
                };
            }
        }

        return {
            ok: false,
            message: "Error al iniciar sesión",
        };
    }
}

export async function logoutAction() {
    await signOut({ redirect: false });
}
