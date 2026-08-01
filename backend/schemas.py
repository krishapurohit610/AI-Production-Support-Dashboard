from pydantic import BaseModel, ConfigDict
from datetime import datetime, date
from typing import Optional


class BotBase(BaseModel):
    name: str
    status: str


class BotCreate(BotBase):
    pass


class BotOut(BotBase):
    id: int
    last_run: datetime

    model_config = ConfigDict(from_attributes=True)


class LogBase(BaseModel):
    bot_id: int
    status: str
    date: date
    error_type: Optional[str] = None
    message: Optional[str] = None


class LogCreate(LogBase):
    pass


class LogOut(LogBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class LogOut(LogBase):
    id: int
    bot_name: str

    model_config = ConfigDict(from_attributes=True)


class IncidentBase(BaseModel):
    bot_id: int
    log_id: Optional[int] = None
    error_type: str
    status: str = "Open"


class IncidentCreate(IncidentBase):
    pass


class IncidentUpdate(BaseModel):
    status: str


class IncidentOut(IncidentBase):
    id: int
    bot_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class KnowledgeBaseCreate(BaseModel):
    error_type: str
    solution: str


class KnowledgeBaseOut(KnowledgeBaseCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
