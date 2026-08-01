from google import genai
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from collections import Counter
from database import engine, Base
import models
from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
import schemas
Base.metadata.create_all(bind=engine)

gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "AI Production Support Dashboard API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/bots", response_model=list[schemas.BotOut])
def get_bots(db: Session = Depends(get_db)):
    return db.query(models.Bot).all()


@app.post("/bots", response_model=schemas.BotOut)
def create_bot(bot: schemas.BotCreate, db: Session = Depends(get_db)):
    new_bot = models.Bot(name=bot.name, status=bot.status)
    db.add(new_bot)
    db.commit()
    db.refresh(new_bot)
    return new_bot


@app.post("/logs", response_model=schemas.LogOut)
def create_log(log: schemas.LogCreate, db: Session = Depends(get_db)):
    new_log = models.Log(**log.model_dump())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@app.get("/logs", response_model=list[schemas.LogOut])
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(models.Log).all()
    return [
        {
            "id": log.id,
            "bot_id": log.bot_id,
            "bot_name": log.bot.name if log.bot else "Unknown",
            "status": log.status,
            "date": log.date,
            "error_type": log.error_type,
            "message": log.message,
        }
        for log in logs
    ]


@app.post("/logs/{log_id}/analyze")
def analyze_log(log_id: int, db: Session = Depends(get_db)):
    log = db.query(models.Log).filter(models.Log.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")

    prompt = f"""You are a production support assistant. A bot execution failed with this log:

Bot: {log.bot.name}
Error Type: {log.error_type}
Message: {log.message}

Respond ONLY with valid JSON in this exact shape, no other text:
{{
  "explanation": "simple explanation of what went wrong",
  "root_cause": "likely root cause",
  "troubleshooting_steps": ["step 1", "step 2", "step 3"],
  "preventive_actions": ["action 1", "action 2"]
}}"""

    response = gemini_client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt,
    )

    return {"analysis": response.text}


@app.post("/incidents", response_model=schemas.IncidentOut)
def create_incident(incident: schemas.IncidentCreate, db: Session = Depends(get_db)):
    new_incident = models.Incident(**incident.model_dump())
    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)
    return {
        "id": new_incident.id,
        "bot_id": new_incident.bot_id,
        "bot_name": new_incident.bot.name,
        "log_id": new_incident.log_id,
        "error_type": new_incident.error_type,
        "status": new_incident.status,
        "created_at": new_incident.created_at,
    }


@app.get("/incidents", response_model=list[schemas.IncidentOut])
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(models.Incident).all()
    return [
        {
            "id": i.id,
            "bot_id": i.bot_id,
            "bot_name": i.bot.name if i.bot else "Unknown",
            "log_id": i.log_id,
            "error_type": i.error_type,
            "status": i.status,
            "created_at": i.created_at,
        }
        for i in incidents
    ]


@app.patch("/incidents/{incident_id}", response_model=schemas.IncidentOut)
def update_incident(incident_id: int, update: schemas.IncidentUpdate, db: Session = Depends(get_db)):
    incident = db.query(models.Incident).filter(
        models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    incident.status = update.status
    db.commit()
    db.refresh(incident)

    return {
        "id": incident.id,
        "bot_id": incident.bot_id,
        "bot_name": incident.bot.name,
        "log_id": incident.log_id,
        "error_type": incident.error_type,
        "status": incident.status,
        "created_at": incident.created_at,
    }


@app.get("/reports/summary")
def get_reports_summary(db: Session = Depends(get_db)):
    logs = db.query(models.Log).all()
    bots = db.query(models.Bot).all()

    total_logs = len(logs)
    success_count = sum(1 for l in logs if l.status == "Success")
    failed_count = sum(1 for l in logs if l.status == "Failed")
    running_count = sum(1 for l in logs if l.status == "Running")

    error_counter = Counter(l.error_type for l in logs if l.error_type)
    most_common_errors = [{"error_type": e, "count": c}
                          for e, c in error_counter.most_common(5)]

    bot_performance = []
    for bot in bots:
        bot_logs = [l for l in logs if l.bot_id == bot.id]
        bot_performance.append({
            "bot_name": bot.name,
            "total_runs": len(bot_logs),
            "success_count": sum(1 for l in bot_logs if l.status == "Success"),
            "failed_count": sum(1 for l in bot_logs if l.status == "Failed"),
        })

    return {
        "total_logs": total_logs,
        "success_count": success_count,
        "failed_count": failed_count,
        "running_count": running_count,
        "most_common_errors": most_common_errors,
        "bot_performance": bot_performance,
    }


@app.get("/knowledge-base", response_model=list[schemas.KnowledgeBaseOut])
def get_knowledge_base(db: Session = Depends(get_db)):
    return db.query(models.KnowledgeBase).all()


@app.post("/knowledge-base", response_model=schemas.KnowledgeBaseOut)
def create_knowledge_entry(entry: schemas.KnowledgeBaseCreate, db: Session = Depends(get_db)):
    new_entry = models.KnowledgeBase(**entry.model_dump())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry
