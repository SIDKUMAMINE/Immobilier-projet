"""
Dépendances FastAPI pour l'authentification et l'autorisation
À utiliser dans les endpoints protégés
"""
import logging
from uuid import UUID
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials

from app.core.security import decode_token
from app.crud import user as user_crud

logger = logging.getLogger(__name__)

# Schéma de sécurité HTTP Bearer
security = HTTPBearer()


# ============================================================================
# DÉPENDANCE - Utilisateur authentifié
# ============================================================================

async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    """
    Dépendance pour vérifier et extraire l'utilisateur actuel
    
    Utilisation dans un endpoint :
    @router.get("/me")
    async def get_me(current_user: UserInDB = Depends(get_current_user)):
        return current_user
    """
    token = credentials.credentials
    
    # Décoder et valider le token
    payload = decode_token(token)
    
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide : pas de user_id",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        user_id = UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide : user_id malformé",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Récupérer l'utilisateur en base de données
    user = await user_crud.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Utilisateur non trouvé",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cet utilisateur a été désactivé",
        )
    
    return user


# ============================================================================
# DÉPENDANCE - Optionnel : Utilisateur si authentifié
# ============================================================================

async def get_current_user_optional(credentials: HTTPAuthCredentials | None = Depends(security)):
    """
    Dépendance optionnelle - retourne l'utilisateur s'il est authentifié, None sinon
    
    Utilisation : pour les endpoints publics mais avec features additionnelles si auth
    """
    if not credentials:
        return None
    
    token = credentials.credentials
    payload = decode_token(token)
    
    if not payload or payload.get("type") != "access":
        return None
    
    user_id_str = payload.get("sub")
    if not user_id_str:
        return None
    
    try:
        user_id = UUID(user_id_str)
    except ValueError:
        return None
    
    user = await user_crud.get_user_by_id(user_id)
    return user if user and user.is_active else None


# ============================================================================
# DÉPENDANCE - Extraction du user_id
# ============================================================================

async def get_current_user_id(current_user = Depends(get_current_user)) -> UUID:
    """
    Retourne juste l'ID de l'utilisateur authentifié
    """
    return current_user.id