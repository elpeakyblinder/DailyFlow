"use client";

import React, { useState, useRef } from "react";
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

type Mood = "success" | "neutral" | "blocked";

interface ReportFormProps {
    readOnly?: boolean;
    initialData?: {
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [content, setContent] = useState(initialData?.content || "");
    const [mood, setMood] = useState<Mood>(initialData?.mood || "neutral");
    const [images, setImages] = useState<string[]>(initialData?.images || []);

    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setImages((prev) => [...prev, previewUrl]);
        e.target.value = "";
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className={`w-full max-w-2xl mx-auto bg-card border border-border rounded-xl p-6 ${readOnly ? "shadow-none" : "shadow-lg"}`}>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            <div className="mb-6">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
                    ¿Cómo estuvo tu día?
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

            <div className="mb-6 space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Resumen de actividades
                </label>
                {readOnly ? (
                    <div className="p-4 bg-secondary/20 rounded-lg text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {content}
                    </div>
                ) : (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Hoy estuve trabajando en..."
                        className="w-full h-40 p-4 rounded-lg bg-secondary/30 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                    />
                )}
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Evidencia / Capturas
                    </label>
                    {!readOnly && (
                        <button
                            onClick={handleTriggerUpload}
                            disabled={isSubmitting}
                            className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                            <ImageIcon size={14} /> Adjuntar
                        </button>
                    )}
                </div>

                {images.length === 0 && readOnly && (
                    <p className="text-sm text-muted-foreground italic">Sin imágenes adjuntas.</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                        <div key={idx} className="group relative aspect-video rounded-lg overflow-hidden border border-border bg-secondary">
                            <Image
                                src={img}
                                alt="Evidencia"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            {!readOnly && (
                                <button
                                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {!readOnly && (
                <div className="flex justify-end pt-4 border-t border-border">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !content}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {isSubmitting ? "Enviando..." : "Enviar Reporte"}
                    </button>
                </div>
            )}
        </div>
    );
}

function MoodButton({ value, current, onClick, readOnly, icon, label, color, bg, border }: MoodButtonProps) {
    const isSelected = current === value;

    if (readOnly && !isSelected) return null;

    return (
        <button
            onClick={() => !readOnly && onClick(value)}
            disabled={readOnly}
            className={`
                flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200
                ${isSelected ? `${bg} ${border} ${color}` : "bg-secondary/30 border-transparent text-muted-foreground hover:bg-secondary/50"}
                ${readOnly ? "cursor-default w-full flex-row" : "cursor-pointer"}
            `}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}
