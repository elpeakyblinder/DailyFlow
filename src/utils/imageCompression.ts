import imageCompression from "browser-image-compression";

export async function compressImageToWebp(file: File): Promise<File> {
    const compressedBlob = await imageCompression(file, {
        maxWidthOrHeight: 1600,
        fileType: "image/webp",
        initialQuality: 0.8,
        useWebWorker: true,
    });

    return new File(
        [compressedBlob],
        file.name.replace(/\.\w+$/, ".webp"),
        { type: "image/webp" }
    );
}
