function RecentIncidents({ incidents }) {
    return (
        <div className="recent-incidents">
            <h2>Recent Incidents</h2>
            {incidents.map((incident) => (
                <div key={incident.id} className="incident-item">
                    <p><strong>{incident.botName}</strong> — {incident.errorType}</p>
                    <p>Status: {incident.status} | {incident.createdAt}</p>
                </div>
            ))}
        </div>
    );
}

export default RecentIncidents;