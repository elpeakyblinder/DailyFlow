export async function imageUrlToBase64(url: string): Promise<string | null> {
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return null;

        const buffer = Buffer.from(await res.arrayBuffer());
        const contentType =
            res.headers.get("content-type") || "image/jpeg";

        return `data:${contentType};base64,${buffer.toString("base64")}`;
    } catch {
        return null;
    }
}
