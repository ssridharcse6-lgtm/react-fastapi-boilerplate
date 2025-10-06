from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import logging

from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..auth import get_current_user

from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, pipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = None

class ChatResponse(BaseModel):
    reply: str

MODEL_NAME = "facebook/blenderbot-90M"
_chat_pipeline = None

def init_pipeline():
    global _chat_pipeline
    if _chat_pipeline:
        return _chat_pipeline

    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

        _chat_pipeline = pipeline(
            task="text2text-generation",  # must use text2text-generation now
            model=model,
            tokenizer=tokenizer,
            device=-1,  # CPU; use 0 for GPU
            max_new_tokens=256,
            do_sample=True,
            top_p=0.9,
            temperature=0.7,
        )
        logger.info("Pipeline initialized successfully.")
        return _chat_pipeline
    except Exception as e:
        logger.exception("Failed to initialize pipeline")
        raise RuntimeError(f"Pipeline init failed: {e}")

@router.post("/", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message required")

    pipeline_instance = init_pipeline()
    loop = asyncio.get_running_loop()

    try:
        output = await loop.run_in_executor(
            None,
            lambda: pipeline_instance(req.message)
        )
        reply = output[0]["generated_text"] if output else ""
    except Exception as e:
        logger.exception("LLM generation failed")
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {e}")

    if not reply.strip():
        reply = "Sorry, I couldn't generate a response."

    return ChatResponse(reply=reply.strip())
