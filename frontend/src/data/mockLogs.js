const mockLogs = [
    { id: 1, botName: "Invoice Processing Bot", status: "Success", date: "2026-07-28", errorType: "-", message: "Execution completed successfully." },
    { id: 2, botName: "Email Alert Bot", status: "Failed", date: "2026-07-28", errorType: "Timeout Error", message: "Request to mail server timed out after 30s." },
    { id: 3, botName: "Data Sync Bot", status: "Running", date: "2026-07-28", errorType: "-", message: "Sync in progress." },
    { id: 4, botName: "Report Generator Bot", status: "Failed", date: "2026-07-28", errorType: "Data Validation Error", message: "Missing required field 'region' in report input." },
    { id: 5, botName: "Invoice Processing Bot", status: "Failed", date: "2026-07-27", errorType: "Connection Error", message: "Could not connect to invoice database." },
];

export default mockLogs;