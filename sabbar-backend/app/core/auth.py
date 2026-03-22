
from fastapi import HTTPException, status, Header
from typing import Optional
from uuid import UUID

class AgentAuth:
    """Authentifier et valider l'agent"""
    
    @staticmethod
    def validate_agent_id(agent_id: str) -> str:
        """Valider que l'agent_id est un UUID valide"""
        try:
            # Vérifier format UUID
            UUID(agent_id)
            return agent_id
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid agent_id format: {agent_id}"
            )

async def get_current_agent(
    x_agent_id: Optional[str] = Header(None, alias="X-Agent-ID")
) -> str:
    """
    Dépendance FastAPI pour extraire et valider l'agent_id
    Header attendu: X-Agent-ID: <uuid>
    """
    if not x_agent_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing X-Agent-ID header"
        )
    
    return AgentAuth.validate_agent_id(x_agent_id)