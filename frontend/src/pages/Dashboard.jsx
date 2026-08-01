import { useState, useEffect } from 'react';
import BotStatusCard from '../components/BotStatusCard';
import StatsSummary from '../components/StatsSummary';
import RecentIncidents from '../components/RecentIncidents';
import mockIncidents from '../data/mockIncidents';
import { fetchBots } from '../services/api';

function Dashboard() {
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBots()
            .then((data) => {
                setBots(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="dashboard"><p>Loading bots...</p></div>;
    if (error) return <div className="dashboard"><p>Error: {error}. Is the backend running?</p></div>;

    return (
        <div className="dashboard">
            <h1>Bot Status</h1>
            <StatsSummary bots={bots} />
            <div className="bot-list">
                {bots.map((bot) => (
                    <BotStatusCard
                        key={bot.id}
                        name={bot.name}
                        status={bot.status}
                        lastRun={new Date(bot.last_run).toLocaleString()}
                    />
                ))}
            </div>
            <RecentIncidents incidents={mockIncidents} />
        </div>
    );
}

export default Dashboard;