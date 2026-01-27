export function formatDateMX(date: Date | string) {
    return new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        dateStyle: "long",
    }).format(new Date(date));
}

export function formatTimeMX(date: Date | string) {
    return new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        timeStyle: "short",
        hour12: true,
    }).format(new Date(date));
}
