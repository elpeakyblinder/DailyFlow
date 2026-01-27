export type Mood = "success" | "neutral" | "blocked";
export type UserRole = "admin" | "employee";

export function isUserRole(value: unknown): value is UserRole {
    return value === "admin" || value === "employee";
}

export interface ReportImage {
    id: string;
    image_url: string;
}

export interface DailyReport {
    id: string;
    title: string;
    content: string;
    mood: Mood;
    created_at: Date;
    images: ReportImage[];
}
