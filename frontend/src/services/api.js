const API_BASE_URL = "https://ai-production-support-dashboard.onrender.com";

export async function fetchBots() {
    const response = await fetch(`${API_BASE_URL}/bots`);
    if (!response.ok) {
        throw new Error("Failed to fetch bots");
    }
    return response.json();
}
export async function fetchLogs() {
    const response = await fetch(`${API_BASE_URL}/logs`);
    if (!response.ok) {
        throw new Error("Failed to fetch logs");
    }
    return response.json();
}
export async function analyzeLog(logId) {
    const response = await fetch(`${API_BASE_URL}/logs/${logId}/analyze`, {
        method: "POST",
    });
    if (!response.ok) {
        throw new Error("Failed to analyze log");
    }
    const data = await response.json();
    return JSON.parse(data.analysis);
}
export async function createIncident(botId, errorType) {
    const response = await fetch(`${API_BASE_URL}/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bot_id: botId, error_type: errorType, status: "Open" }),
    });
    if (!response.ok) {
        throw new Error("Failed to create incident");
    }
    return response.json();
}

export async function fetchIncidents() {
    const response = await fetch(`${API_BASE_URL}/incidents`);
    if (!response.ok) {
        throw new Error("Failed to fetch incidents");
    }
    return response.json();
}

export async function updateIncidentStatus(incidentId, status) {
    const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        throw new Error("Failed to update incident");
    }
    return response.json();
}
export async function fetchReports() {
    const response = await fetch(`${API_BASE_URL}/reports/summary`);
    if (!response.ok) {
        throw new Error("Failed to fetch reports");
    }
    return response.json();
}
export async function fetchKnowledgeBase() {
    const response = await fetch(`${API_BASE_URL}/knowledge-base`);
    if (!response.ok) {
        throw new Error("Failed to fetch knowledge base");
    }
    return response.json();
}

export async function createKnowledgeEntry(errorType, solution) {
    const response = await fetch(`${API_BASE_URL}/knowledge-base`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error_type: errorType, solution }),
    });
    if (!response.ok) {
        throw new Error("Failed to create entry");
    }
    return response.json();
}