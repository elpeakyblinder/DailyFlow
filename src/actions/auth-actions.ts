"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { pool } from "@/lib/db"; 

export async function loginAction(email: string, password: string) {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        const { rows } = await pool.query(
            "SELECT role FROM users WHERE email = $1", 
            [email]
        );

        if (rows.length === 0) {
            return { ok: false, message: "Usuario no encontrado en base de datos" };
        }

        const userRole = rows[0].role;

        return {
            ok: true,
            role: userRole, 
        };

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        ok: false,
                        message: "Credenciales incorrectas",
                    };
                default:
                    return {
                        ok: false,
                        message: "Error de autenticación",
                    };
            }
        }
        
        console.error(error);
        return {
            ok: false,
            message: "Error al iniciar sesión",
        };
    }
}

export async function logoutAction() {
    await signOut({ redirect: false });
}