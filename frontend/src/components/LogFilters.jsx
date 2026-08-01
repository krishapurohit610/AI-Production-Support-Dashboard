function LogFilters({ filters, onFilterChange }) {
    return (
        <div className="log-filters">
            <select
                value={filters.status}
                onChange={(e) => onFilterChange("status", e.target.value)}
            >
                <option value="All">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Running">Running</option>
            </select>

            <input
                type="text"
                placeholder="Filter by bot name"
                value={filters.botName}
                onChange={(e) => onFilterChange("botName", e.target.value)}
            />

            <input
                type="date"
                value={filters.date}
                onChange={(e) => onFilterChange("date", e.target.value)}
            />

            <input
                type="text"
                placeholder="Filter by error type"
                value={filters.errorType}
                onChange={(e) => onFilterChange("errorType", e.target.value)}
            />
        </div>
    );
}

export default LogFilters;