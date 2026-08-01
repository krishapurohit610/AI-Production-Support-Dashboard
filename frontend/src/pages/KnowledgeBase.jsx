import { useState, useEffect } from 'react';
import { fetchKnowledgeBase, createKnowledgeEntry } from '../services/api';

function KnowledgeBase() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [errorType, setErrorType] = useState("");
    const [solution, setSolution] = useState("");

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = () => {
        fetchKnowledgeBase()
            .then((data) => {
                setEntries(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!errorType.trim() || !solution.trim()) return;

        createKnowledgeEntry(errorType, solution).then(() => {
            setErrorType("");
            setSolution("");
            loadEntries();
        });
    };

    if (loading) return <div className="kb-page"><p>Loading knowledge base...</p></div>;
    if (error) return <div className="kb-page"><p>Error: {error}</p></div>;

    return (
        <div className="kb-page">
            <h1>Knowledge Base</h1>

            <form onSubmit={handleSubmit} className="kb-form">
                <input
                    type="text"
                    placeholder="Error type (e.g. Timeout Error)"
                    value={errorType}
                    onChange={(e) => setErrorType(e.target.value)}
                />
                <textarea
                    placeholder="Known solution"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                />
                <button type="submit">Add Entry</button>
            </form>

            {entries.length === 0 && <p>No entries yet.</p>}
            <div className="kb-list">
                {entries.map((entry) => (
                    <div key={entry.id} className="kb-card">
                        <h3>{entry.error_type}</h3>
                        <p>{entry.solution}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default KnowledgeBase;