import { useState, useEffect } from 'react';
import { fetchReports } from '../services/api';

function Reports() {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReports()
            .then((data) => {
                setReport(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="reports-page"><p>Loading reports...</p></div>;
    if (error) return <div className="reports-page"><p>Error: {error}</p></div>;

    return (
        <div className="reports-page">
            <h1>Reports</h1>

            <div className="stats-summary">
                <div className="stat-box">Total Logs: {report.total_logs}</div>
                <div className="stat-box">Success: {report.success_count}</div>
                <div className="stat-box">Failed: {report.failed_count}</div>
                <div className="stat-box">Running: {report.running_count}</div>
            </div>

            <div className="report-section">
                <h2>Most Common Errors</h2>
                {report.most_common_errors.length === 0 && <p>No errors recorded.</p>}
                <ul>
                    {report.most_common_errors.map((e, i) => (
                        <li key={i}>{e.error_type} — {e.count} occurrence{e.count !== 1 ? "s" : ""}</li>
                    ))}
                </ul>
            </div>

            <div className="report-section">
                <h2>Bot Performance</h2>
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>Bot Name</th>
                            <th>Total Runs</th>
                            <th>Success</th>
                            <th>Failed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.bot_performance.map((b, i) => (
                            <tr key={i}>
                                <td>{b.bot_name}</td>
                                <td>{b.total_runs}</td>
                                <td>{b.success_count}</td>
                                <td>{b.failed_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Reports;