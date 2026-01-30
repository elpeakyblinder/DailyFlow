import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";

export interface WeeklyReportRow {
    report_id: string;
    title: string | null;
    content: string;
    mood: "success" | "neutral" | "blocked";
    created_at: Date;
    employee_name: string;
    employee_role: string | null;
    area_name: string;
    images: string[];
}

interface WeeklyAreaReportPdfProps {
    reports: WeeklyReportRow[];
    weekStart: Date;
    weekEnd: Date;
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: "Helvetica",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 11,
        marginBottom: 24,
        color: "#555",
    },
    employeeSection: {
        marginBottom: 24,
    },
    employeeName: {
        fontSize: 13,
        fontWeight: "bold",
    },
    employeeRole: {
        fontSize: 10,
        color: "#666",
        marginBottom: 8,
    },
    reportBox: {
        border: "1 solid #e5e7eb",
        borderRadius: 6,
        padding: 8,
        marginBottom: 8,
    },
    reportTitle: {
        fontSize: 11,
        fontWeight: "bold",
    },
    reportMeta: {
        fontSize: 9,
        color: "#666",
        marginBottom: 4,
    },
    reportContent: {
        fontSize: 10,
        lineHeight: 1.4,
        marginBottom: 4,
    },
    mood: {
        fontSize: 9,
        fontWeight: "bold",
        marginTop: 4,
    },
    image: {
        width: 200,
        height: 120,
        objectFit: "contain",
        marginBottom: 4,
    },
});

function formatDate(date: Date) {
    return new Date(date).toLocaleDateString("es-MX", {
        dateStyle: "long",
    });
}

function formatTime(date: Date) {
    return new Date(date).toLocaleTimeString("es-MX", {
        timeStyle: "short",
    });
}

function formatShortDate(date: Date) {
    return new Date(date).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function moodLabel(mood: WeeklyReportRow["mood"]) {
    if (mood === "success") return "Productivo";
    if (mood === "neutral") return "Neutral";
    return "Bloqueado";
}

export function WeeklyAreaReportPdf({
    reports,
    weekStart,
    weekEnd,
}: WeeklyAreaReportPdfProps) {
    const areaName = reports[0].area_name;

    const grouped: Record<string, WeeklyReportRow[]> = {};
    for (const report of reports) {
        grouped[report.employee_name] ??= [];
        grouped[report.employee_name].push(report);
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Reporte semanal</Text>
                <Text style={styles.subtitle}>
                    Área: {areaName}
                    {"\n"}
                    Semana del {formatShortDate(weekStart)} al{" "}
                    {formatShortDate(weekEnd)}
                </Text>

                {Object.entries(grouped).map(([employeeName, employeeReports]) => {
                    const role =
                        employeeReports[0].employee_role ?? "Sin puesto";

                    return (
                        <View key={employeeName} style={styles.employeeSection}>
                            <Text style={styles.employeeName}>
                                {employeeName}
                            </Text>
                            <Text style={styles.employeeRole}>{role}</Text>

                            {employeeReports.map((report) => (
                                <View
                                    key={report.report_id}
                                    style={styles.reportBox}
                                >
                                    <Text style={styles.reportTitle}>
                                        {report.title || "Reporte diario"}
                                    </Text>

                                    <Text style={styles.reportMeta}>
                                        {formatDate(report.created_at)} —{" "}
                                        {formatTime(report.created_at)}
                                    </Text>

                                    <Text style={styles.reportContent}>
                                        {report.content}
                                    </Text>

                                    <Text style={styles.mood}>
                                        Estado: {moodLabel(report.mood)}
                                    </Text>

                                    {report.images?.slice(0, 2).map(
                                        (url, index) => (
                                            // eslint-disable-next-line jsx-a11y/alt-text
                                            <Image
                                                key={index}
                                                src={url}
                                                style={styles.image}
                                            />
                                        )
                                    )}
                                </View>
                            ))}
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
}
