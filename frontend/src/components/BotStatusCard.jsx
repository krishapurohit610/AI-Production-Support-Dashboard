function BotStatusCard({ name, status, lastRun }) {
    return (
        <div className="bot-card">
            <h3>{name}</h3>
            <p>Status: {status}</p>
            <p>Last Run: {lastRun}</p>
        </div>
    );
}

export default BotStatusCard;