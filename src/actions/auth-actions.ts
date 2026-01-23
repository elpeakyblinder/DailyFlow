"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { Pool } from "@neondatabase/serverless";

export async function loginAction(email: string, password: string): Promise<{ success: boolean; role?: string; error?: string }> {
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false, 
        });

        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const result = await pool.query("SELECT role FROM users WHERE email = $1", [email]);
        const userRole = result.rows[0]?.role || 'employee'; 
        
        return { success: true, role: userRole };

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: "Credenciales incorrectas." };
                default:
                    return { success: false, error: "Error en el servidor." };
            }
        }
        throw error;
    }
}