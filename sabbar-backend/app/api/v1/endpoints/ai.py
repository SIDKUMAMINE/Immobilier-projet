"""Endpoints simples pour l'agent IA conversationnel (version simplifiée)"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.ai.agent import QualificationAgent  # ✅ CHANGÉ ICI
from app.db.supabase_client import get_supabase_client
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


class ChatRequest(BaseModel):
    """Requête de chat simple"""
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Réponse du chat simple"""
    response: str
    conversation_id: str
    qualification_score: int
    lead_quality: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, supabase=Depends(get_supabase_client)):
    """
    Endpoint simple de chat (wrapper autour de conversations.py)
    
    - **message**: Message de l'utilisateur
    - **conversation_id**: ID de conversation (optionnel, créé automatiquement)
    """
    try:
        logger.info(f"📩 Message reçu : {request.message}")
        
        # Initialiser l'agent
        agent = QualificationAgent(supabase)
        
        # Si pas de conversation_id, démarrer une nouvelle conversation
        if not request.conversation_id:
            result = await agent.start_conversation(
                initial_message=request.message
            )
            return ChatResponse(
                response=result["response"],
                conversation_id=result["conversation_id"],
                qualification_score=result["qualification_score"],
                lead_quality="cold"
            )
        
        # Sinon, continuer la conversation existante
        else:
            result = await agent.continue_conversation(
                conversation_id=request.conversation_id,
                user_message=request.message
            )
            return ChatResponse(
                response=result["response"],
                conversation_id=result["conversation_id"],
                qualification_score=result["qualification_score"],
                lead_quality=result["lead_quality"]
            )
    
    except Exception as e:
        logger.error(f"❌ Erreur dans le chat : {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check(supabase=Depends(get_supabase_client)):
    """Vérifier que l'agent IA fonctionne"""
    try:
        agent = QualificationAgent(supabase)
        return {
            "status": "healthy",
            "agent": "SABBAR AI",
            "model": agent.model
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }