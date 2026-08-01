function LogsTable({ logs, onAnalyze, analyzingId, onCreateIncident }) {
    return (
        <table className="logs-table">
            <thead>
                <tr>
                    <th>Bot Name</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Error Type</th>
                    <th>Message</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {logs.map((log) => (
                    <tr key={log.id}>
                        <td>{log.botName}</td>
                        <td>{log.status}</td>
                        <td>{log.date}</td>
                        <td>{log.errorType}</td>
                        <td>{log.message}</td>
                        <td>
                            {log.status === "Failed" && (
                                <div className="log-actions">
                                    <button onClick={() => onAnalyze(log.id)} disabled={analyzingId === log.id}>
                                        {analyzingId === log.id ? "Analyzing..." : "Analyze"}
                                    </button>
                                    <button onClick={() => onCreateIncident(log.botId, log.errorType)}>
                                        Create Incident
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default LogsTable;