import { Search } from "lucide-react";

interface ReportFiltersProps {
    title?: string;
    searchPlaceholder?: string;
}

export function ReportFilters({
    title = "Historial Reciente",
    searchPlaceholder = "Buscar por título o fecha..."
}: ReportFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-medium">{title}</h3>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        size={16}
                    />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full h-10 pl-9 pr-4 rounded-lg bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all placeholder:text-muted-foreground"
                    />
                </div>
                <div className="relative w-full sm:w-auto">
                    <input
                        type="date"
                        className="w-full sm:w-auto h-10 px-3 rounded-lg bg-secondary/50 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20 text-sm text-muted-foreground outline-none transition-all cursor-pointer [color-scheme:dark]"
                    />
                </div>
            </div>
        </div>
    );
}