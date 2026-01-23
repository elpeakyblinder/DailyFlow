import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { Pool } from "@neondatabase/serverless";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const email = credentials.email as string;
                const password = credentials.password as string;


                if (!email || !password) {
                    return null;
                }

                const pool = new Pool({
                    connectionString: process.env.DATABASE_URL
                });

                try {
                    const result = await pool.query(
                        "SELECT id, email, password_hash, role FROM users WHERE email = $1 LIMIT 1",
                        [email]
                    );

                    const user = result.rows[0];

                    if (!user) {
                        return null;
                    }

                    const passwordsMatch = await compare(password, user.password_hash);

                    if (!passwordsMatch) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    };

                } catch (error) {
                    console.error("Auth error during credentials login");
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});