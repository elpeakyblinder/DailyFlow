import sharp from "sharp";

export async function imageUrlToBase64(
    url: string
): Promise<string | null> {
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return null;

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const image = sharp(buffer);

        const metadata = await image.metadata();

        let outputBuffer: Buffer;
        let mime = "image/jpeg";

        if (metadata.format === "png") {
            outputBuffer = await image.png().toBuffer();
            mime = "image/png";
        } else {
            outputBuffer = await image.jpeg({ quality: 85 }).toBuffer();
            mime = "image/jpeg";
        }

        return `data:${mime};base64,${outputBuffer.toString("base64")}`;
    } catch (error) {
        console.error("Image conversion failed:", error);
        return null;
    }
}
