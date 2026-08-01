function StatsSummary({ bots }) {
    const total = bots.length;
    const success = bots.filter((bot) => bot.status === "Success").length;
    const failed = bots.filter((bot) => bot.status === "Failed").length;
    const running = bots.filter((bot) => bot.status === "Running").length;

    return (
        <div className="stats-summary">
            <div className="stat-box">Total: {total}</div>
            <div className="stat-box">Success: {success}</div>
            <div className="stat-box">Failed: {failed}</div>
            <div className="stat-box">Running: {running}</div>
        </div>
    );
}

export default StatsSummary;