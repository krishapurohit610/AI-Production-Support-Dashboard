from datetime import date, timedelta
from database import SessionLocal, engine, Base
import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Clear existing data first (children before parents, due to foreign keys)
db.query(models.KnowledgeBase).delete()
db.query(models.Incident).delete()
db.query(models.Log).delete()
db.query(models.Bot).delete()
db.commit()

bots_data = [
    {"name": "Invoice Processing Bot", "status": "Success"},
    {"name": "Email Alert Bot", "status": "Failed"},
    {"name": "Data Sync Bot", "status": "Running"},
    {"name": "Report Generator Bot", "status": "Failed"},
    {"name": "Payroll Automation Bot", "status": "Success"},
]

bots = []
for b in bots_data:
    bot = models.Bot(name=b["name"], status=b["status"])
    db.add(bot)
    bots.append(bot)
db.commit()
for bot in bots:
    db.refresh(bot)

today = date.today()

logs_data = [
    {"bot": bots[0], "status": "Success", "date": today,
        "error_type": None, "message": "Execution completed successfully."},
    {"bot": bots[1], "status": "Failed", "date": today, "error_type": "Timeout Error",
        "message": "Request to mail server timed out after 30s."},
    {"bot": bots[2], "status": "Running", "date": today,
        "error_type": None, "message": "Sync in progress."},
    {"bot": bots[3], "status": "Failed", "date": today, "error_type": "Data Validation Error",
        "message": "Missing required field 'region' in report input."},
    {"bot": bots[0], "status": "Failed", "date": today - timedelta(
        days=1), "error_type": "Connection Error", "message": "Could not connect to invoice database."},
    {"bot": bots[4], "status": "Success", "date": today -
        timedelta(days=1), "error_type": None, "message": "Payroll batch completed."},
]

logs = []
for l in logs_data:
    log = models.Log(
        bot_id=l["bot"].id,
        status=l["status"],
        date=l["date"],
        error_type=l["error_type"],
        message=l["message"],
    )
    db.add(log)
    logs.append(log)
db.commit()
for log in logs:
    db.refresh(log)

# One incident per distinct failed log, with varied statuses — no repeats
incidents_data = [
    {"bot": bots[1], "log": logs[1],
        "error_type": "Timeout Error", "status": "Open"},
    {"bot": bots[3], "log": logs[3],
        "error_type": "Data Validation Error", "status": "In Progress"},
    {"bot": bots[0], "log": logs[4],
        "error_type": "Connection Error", "status": "Resolved"},
]

for i in incidents_data:
    db.add(models.Incident(
        bot_id=i["bot"].id,
        log_id=i["log"].id,
        error_type=i["error_type"],
        status=i["status"],
    ))
    knowledge_base_data = [
        {
            "error_type": "Timeout Error",
            "solution": "Increase the request timeout threshold if the external service is expected to have high latency. Implement retry logic with exponential backoff for transient network issues. Verify the target server's health and response times separately.",
        },
        {
            "error_type": "Data Validation Error",
            "solution": "Add input validation at the point of data ingestion to catch missing or malformed fields before processing begins. Check upstream systems to confirm they're populating all required fields consistently.",
        },
        {
            "error_type": "Connection Error",
            "solution": "Confirm the target database or service is running and reachable on the expected port. Verify connection strings and credentials haven't expired or changed. Add automatic reconnection logic with a capped retry count.",
        },
        {
            "error_type": "Authentication Error",
            "solution": "Check whether the API key, token, or credentials have expired or been rotated. Confirm the bot's stored credentials match what the target system currently expects, and set up alerts before expiry where possible.",
        },
        {
            "error_type": "Rate Limit Error",
            "solution": "Implement exponential backoff and request batching to stay within provider rate limits. Review current usage against the account's quota and consider request throttling during peak hours.",
        },
    ]

for k in knowledge_base_data:
    db.add(models.KnowledgeBase(
        error_type=k["error_type"], solution=k["solution"]))
db.commit()
db.close()

print("Database seeded successfully.")
