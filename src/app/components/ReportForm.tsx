"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    CheckCircle2,
    MinusCircle,
    AlertCircle,
    Image as ImageIcon,
    X,
    Loader2,
    Send,
    UploadCloud
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
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!activeImage) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setActiveImage(null);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [activeImage]);

    const processFiles = useCallback(async (incomingFiles: File[]) => {
        if (!incomingFiles.length) return;

        if (imageFiles.length + incomingFiles.length > 3) {
            toast.error("Máximo 3 imágenes por reporte");
            return;
        }

        setIsCompressing(true);

        try {
            const validImages = incomingFiles.filter(file => file.type.startsWith("image/"));

            if (validImages.length !== incomingFiles.length) {
                toast.warning("Algunos archivos no eran imágenes y se ignoraron");
            }

            if (validImages.length === 0) return;

            const compressedFiles = await Promise.all(
                validImages.map(file => compressImageToWebp(file))
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
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [imageFiles]);

    useEffect(() => {
        if (readOnly) return;

        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            const filesToProcess: File[] = [];

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) filesToProcess.push(blob);
                }
            }

            if (filesToProcess.length > 0) {
                e.preventDefault();
                processFiles(filesToProcess);
            }
        };

        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [processFiles, readOnly]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!readOnly) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (readOnly) return;

        const files = Array.from(e.dataTransfer.files);
        await processFiles(files);
    };

    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        await processFiles(files);
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
                if (image.size > 4_500_000) {
                    throw new Error(`La imagen ${image.name} es demasiado pesada`);
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
                            placeholder="Describe lo que hiciste hoy..."
                            className="w-full h-40 p-4 rounded-lg bg-secondary/30 resize-none outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    )}
                </div>

                <div
                    className={`mb-8 rounded-xl transition-all duration-200 ${isDragging
                        ? "bg-primary/5 border-2 border-dashed border-primary p-4"
                        : "border border-transparent"
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="flex justify-between mb-3 items-center">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            Evidencia / Capturas
                            {!readOnly && (
                                <span className="text-[10px] normal-case bg-secondary px-2 py-0.5 rounded text-muted-foreground/70 hidden sm:inline-block">
                                    Pega (Ctrl+V) o arrastra imágenes aquí
                                </span>
                            )}
                        </label>
                        {!readOnly && (
                            <button
                                onClick={handleTriggerUpload}
                                disabled={isSubmitting || isCompressing}
                                className="text-xs flex items-center gap-1 text-primary hover:underline"
                            >
                                <ImageIcon size={14} />
                                Adjuntar
                            </button>
                        )}
                    </div>

                    {isDragging && (
                        <div className="absolute inset-0 z-10 bg-background/80 flex flex-col items-center justify-center rounded-xl pointer-events-none">
                            <UploadCloud className="w-10 h-10 text-primary mb-2 animate-bounce" />
                            <p className="text-sm font-medium text-primary">Suelta las imágenes aquí</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 min-h-25 content-start">
                        {imagePreviews.length === 0 && !readOnly && !isDragging && (
                            <div
                                onClick={handleTriggerUpload}
                                className="col-span-2 sm:col-span-4 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center h-24 text-muted-foreground hover:bg-secondary/20 cursor-pointer transition-colors"
                            >
                                <span className="text-sm">Sin capturas</span>
                                <span className="text-xs opacity-50">Ctrl+V para pegar</span>
                            </div>
                        )}

                        {imagePreviews.map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className="relative aspect-video rounded-lg overflow-hidden border bg-black/5 group cursor-pointer"
                            >
                                <Image
                                    src={img}
                                    alt="Imagen del reporte"
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                                {!readOnly && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage(idx);
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {!readOnly && (
                    <div className="flex justify-end border-t border-border pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || isCompressing}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isCompressing || isSubmitting ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <Send size={18} />
                            )}
                            {isCompressing
                                ? "Optimizando..."
                                : isSubmitting
                                    ? "Enviando..."
                                    : "Enviar Reporte"}
                        </button>
                    </div>
                )}
            </div>

            {activeImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setActiveImage(null)}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-10 right-0 z-10 text-white/80 hover:text-white"
                            onClick={() => setActiveImage(null)}
                        >
                            <X size={32} />
                        </button>
                        <Image
                            src={activeImage}
                            alt="Imagen del reporte"
                            width={1600}
                            height={900}
                            className="object-contain w-full h-full rounded-lg shadow-2xl"
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
            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all
                ${isSelected ? `${bg} ${border} ${color}` : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"}`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}