"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    CheckCircle2,
    MinusCircle,
    AlertCircle,
    Image as ImageIcon,
    X,
    Loader2,
    Send
} from "lucide-react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";

import { createReportAction } from "@/actions/report-actions";
import { compressImageToWebp } from "@/utils/imageCompression";

type Mood = "success" | "neutral" | "blocked";

interface ReportFormProps {
    readOnly?: boolean;
    initialData?: {
        title: string;
        content: string;
        mood: Mood;
        images: string[];
        date?: string;
    };
}

interface MoodButtonProps {
    value: Mood;
    current: Mood;
    onClick: (value: Mood) => void;
    readOnly: boolean;
    icon: React.ReactNode;
    label: string;
    color: string;
    bg: string;
    border: string;
}

export function ReportForm({ readOnly = false, initialData }: ReportFormProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [mood, setMood] = useState<Mood>(initialData?.mood || "neutral");

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>(initialData?.images || []);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    useEffect(() => {
        if (!activeImage) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setActiveImage(null);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [activeImage]);

    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        if (imageFiles.length + files.length > 3) {
            toast.error("Máximo 3 imágenes por reporte");
            return;
        }

        setIsCompressing(true);

        try {
            const compressedFiles = await Promise.all(
                files.map(file => compressImageToWebp(file))
            );

            const previews = compressedFiles.map(file =>
                URL.createObjectURL(file)
            );

            setImageFiles(prev => [...prev, ...compressedFiles]);
            setImagePreviews(prev => [...prev, ...previews]);

            toast.success("¡Imagen agregada!");
        } catch {
            toast.error("Error al procesar las imágenes");
        } finally {
            setIsCompressing(false);
            e.target.value = "";
        }
    };

    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!title.trim()) return toast.error("Agrega un título al reporte");
        if (!content.trim()) return toast.error("El contenido no puede estar vacío");

        setIsSubmitting(true);

        try {
            const uploadedUrls: string[] = [];

            for (const image of imageFiles) {
                if (image.size > 500_000) {
                    throw new Error("Una imagen supera el tamaño permitido");
                }

                const result = await upload(image.name, image, {
                    access: "public",
                    handleUploadUrl: "/api/upload-images-FormReport",
                });

                uploadedUrls.push(result.url);
            }

            const result = await createReportAction(
                title,
                content,
                mood,
                uploadedUrls
            );

            if (result.success) {
                toast.success("¡Reporte enviado correctamente!");
                router.push("/employee/dashboard/reports");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Error inesperado"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="w-full max-w-3xl mx-auto bg-card border border-border rounded-xl p-6 shadow-lg">

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                />

                <div className="mb-6 border-b border-border/50 pb-4">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        Título del Reporte
                    </label>
                    {readOnly ? (
                        <h2 className="text-2xl font-bold">{title}</h2>
                    ) : (
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full bg-transparent text-2xl font-bold outline-none"
                            placeholder="EJ: Reporte Diario - Web nomatech"
                        />
                    )}
                </div>

                <div className="mb-6">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                        ¿Cómo estuvo el día?
                    </label>
                    <div className="flex gap-4">
                        <MoodButton
                            value="success"
                            current={mood}
                            onClick={setMood}
                            readOnly={readOnly}
                            icon={<CheckCircle2 size={20} />}
                            label="Productivo"
                            color="text-emerald-500"
                            bg="bg-emerald-500/10"
                            border="border-emerald-500/20"
                        />
                        <MoodButton
                            value="neutral"
                            current={mood}
                            onClick={setMood}
                            readOnly={readOnly}
                            icon={<MinusCircle size={20} />}
                            label="Normal"
                            color="text-blue-500"
                            bg="bg-blue-500/10"
                            border="border-blue-500/20"
                        />
                        <MoodButton
                            value="blocked"
                            current={mood}
                            onClick={setMood}
                            readOnly={readOnly}
                            icon={<AlertCircle size={20} />}
                            label="Bloqueado"
                            color="text-red-500"
                            bg="bg-red-500/10"
                            border="border-red-500/20"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                        Resumen de actividades
                    </label>
                    {readOnly ? (
                        <div className="p-4 bg-secondary/20 rounded-lg whitespace-pre-wrap text-sm">
                            {content}
                        </div>
                    ) : (
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isSubmitting}
                            className="w-full h-40 p-4 rounded-lg bg-secondary/30 resize-none"
                        />
                    )}
                </div>

                <div className="mb-8">
                    <div className="flex justify-between mb-3">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Evidencia / Capturas
                        </label>
                        {!readOnly && (
                            <button
                                onClick={handleTriggerUpload}
                                disabled={isSubmitting || isCompressing}
                                className="text-xs flex items-center gap-1 text-primary"
                            >
                                <ImageIcon size={14} />
                                Adjuntar
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {imagePreviews.map((img, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveImage(img)}
                                className="relative aspect-video rounded-lg overflow-hidden border"
                            >
                                <Image
                                    src={img}
                                    alt="Imagen del reporte"
                                    fill
                                    className="object-cover"
                                />
                                {!readOnly && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage(idx);
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {!readOnly && (
                    <div className="flex justify-end border-t border-border pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || isCompressing}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg"
                        >
                            {isCompressing || isSubmitting ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <Send size={18} />
                            )}
                            {isCompressing
                                ? "Optimizando imágenes..."
                                : isSubmitting
                                    ? "Enviando..."
                                    : "Enviar Reporte"}
                        </button>
                    </div>
                )}
            </div>
            {activeImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setActiveImage(null)}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-3 right-3 z-10 bg-black/60 text-white rounded-full p-1"
                            onClick={() => setActiveImage(null)}
                        >
                            <X size={24} />
                        </button>
                        <Image
                            src={activeImage}
                            alt="Imagen del reporte"
                            width={1600}
                            height={900}
                            className="object-contain w-full h-full rounded-lg"
                        />
                    </div>
                </div>
            )}
        </>
    );
}

function MoodButton({
    value,
    current,
    onClick,
    readOnly,
    icon,
    label,
    color,
    bg,
    border
}: MoodButtonProps) {
    const isSelected = current === value;
    if (readOnly && !isSelected) return null;

    return (
        <button
            onClick={() => !readOnly && onClick(value)}
            disabled={readOnly}
            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border
                ${isSelected ? `${bg} ${border} ${color}` : "bg-secondary/30 text-muted-foreground"}`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}
