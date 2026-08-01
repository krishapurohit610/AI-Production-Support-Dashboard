from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Bot(Base):
    __tablename__ = "bots"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    last_run = Column(DateTime, default=datetime.utcnow)

    logs = relationship("Log", back_populates="bot")
    incidents = relationship("Incident", back_populates="bot")


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    bot_id = Column(Integer, ForeignKey("bots.id"))
    status = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    error_type = Column(String, nullable=True)
    message = Column(String, nullable=True)

    bot = relationship("Bot", back_populates="logs")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    bot_id = Column(Integer, ForeignKey("bots.id"))
    log_id = Column(Integer, ForeignKey("logs.id"), nullable=True)
    error_type = Column(String, nullable=False)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=datetime.utcnow)

    bot = relationship("Bot", back_populates="incidents")


class KnowledgeBase(Base):
    __tablename__ = "knowledge_base"

    id = Column(Integer, primary_key=True, index=True)
    error_type = Column(String, nullable=False)
    solution = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
