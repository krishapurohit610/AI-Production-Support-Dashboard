import { useState, useEffect } from 'react';
import LogFilters from '../components/LogFilters';
import LogsTable from '../components/LogsTable';
import AnalysisPanel from '../components/AnalysisPanel';
import { fetchLogs, analyzeLog, createIncident } from '../services/api';

function Logs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        status: "All",
        botName: "",
        date: "",
        errorType: "",
    });

    const [analyzingId, setAnalyzingId] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [analysisError, setAnalysisError] = useState(null);

    useEffect(() => {
        fetchLogs()
            .then((data) => {
                const normalized = data.map((log) => ({
                    id: log.id,
                    botId: log.bot_id,
                    botName: log.bot_name,
                    status: log.status,
                    date: log.date,
                    errorType: log.error_type || "-",
                    message: log.message,
                }));
                setLogs(normalized);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleAnalyze = (logId) => {
        setAnalyzingId(logId);
        setAnalysis(null);
        setAnalysisError(null);

        analyzeLog(logId)
            .then((result) => {
                setAnalysis(result);
                setAnalyzingId(null);
            })
            .catch((err) => {
                setAnalysisError(err.message);
                setAnalyzingId(null);
            });
    };

    const filteredLogs = logs.filter((log) => {
        const matchesStatus = filters.status === "All" || log.status === filters.status;
        const matchesBot = log.botName.toLowerCase().includes(filters.botName.toLowerCase());
        const matchesDate = filters.date === "" || log.date === filters.date;
        const matchesError = log.errorType.toLowerCase().includes(filters.errorType.toLowerCase());
        return matchesStatus && matchesBot && matchesDate && matchesError;
    });

    if (loading) return <div className="logs-page"><p>Loading logs...</p></div>;
    if (error) return <div className="logs-page"><p>Error: {error}. Is the backend running?</p></div>;

    return (
        <div className="logs-page">
            <h1>Log Monitoring</h1>
            <LogFilters filters={filters} onFilterChange={handleFilterChange} />
            <LogsTable logs={filteredLogs} onAnalyze={handleAnalyze} analyzingId={analyzingId} onCreateIncident={handleCreateIncident} />
            <AnalysisPanel analysis={analysis} loading={analyzingId !== null} error={analysisError} />
        </div>
    );
}

export default Logs;
const handleCreateIncident = (botId, errorType) => {
    createIncident(botId, errorType)
        .then(() => {
            alert("Incident created! Check the Incidents page.");
        })
        .catch((err) => {
            alert("Failed to create incident: " + err.message);
        });
};