function AnalysisPanel({ analysis, loading, error }) {
    if (loading) return <div className="analysis-panel"><p>Analyzing log with AI...</p></div>;
    if (error) return <div className="analysis-panel"><p>Error: {error}</p></div>;
    if (!analysis) return null;

    return (
        <div className="analysis-panel">
            <h2>AI Analysis</h2>
            <p><strong>Explanation:</strong> {analysis.explanation}</p>
            <p><strong>Root Cause:</strong> {analysis.root_cause}</p>

            <p><strong>Troubleshooting Steps:</strong></p>
            <ul>
                {analysis.troubleshooting_steps.map((step, i) => (
                    <li key={i}>{step}</li>
                ))}
            </ul>

            <p><strong>Preventive Actions:</strong></p>
            <ul>
                {analysis.preventive_actions.map((action, i) => (
                    <li key={i}>{action}</li>
                ))}
            </ul>
        </div>
    );
}

export default AnalysisPanel;