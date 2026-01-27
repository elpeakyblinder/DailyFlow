import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const jsonResponse = await handleUpload({
            body,
            request,

            onBeforeGenerateToken: async () => {
                return {
                    allowedContentTypes: [
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                        "image/webp",
                    ],
                    tokenPayload: JSON.stringify({
                        userId: session.user.id,
                    }),
                };
            },

            onUploadCompleted: async ({ blob }) => {
                console.log("Imagen subida:", blob.url);
            },
        });

        return NextResponse.json(jsonResponse);

    } catch (error) {
        console.error("Upload error:", error);

        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}
