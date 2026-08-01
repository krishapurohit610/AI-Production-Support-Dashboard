import { useState, useEffect } from 'react';
import { fetchIncidents, updateIncidentStatus } from '../services/api';

function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadIncidents();
    }, []);

    const loadIncidents = () => {
        fetchIncidents()
            .then((data) => {
                setIncidents(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    const handleStatusChange = (incidentId, newStatus) => {
        updateIncidentStatus(incidentId, newStatus)
            .then(() => {
                loadIncidents();
            })
            .catch((err) => setError(err.message));
    };

    if (loading) return <div className="incidents-page"><p>Loading incidents...</p></div>;
    if (error) return <div className="incidents-page"><p>Error: {error}</p></div>;

    return (
        <div className="incidents-page">
            <h1>Incident Management</h1>
            {incidents.length === 0 && <p>No incidents yet. Create one from a failed log.</p>}
            <div className="incident-list">
                {incidents.map((incident) => (
                    <div key={incident.id} className="incident-card">
                        <p><strong>{incident.bot_name}</strong> — {incident.error_type}</p>
                        <p className="incident-meta">Created: {new Date(incident.created_at).toLocaleString()}</p>
                        <select
                            value={incident.status}
                            onChange={(e) => handleStatusChange(incident.id, e.target.value)}
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Incidents;