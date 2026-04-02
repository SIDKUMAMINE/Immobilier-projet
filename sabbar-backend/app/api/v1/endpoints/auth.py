"""
Endpoints pour l'authentification des agents immobiliers
- POST /auth/register - Créer un compte
- POST /auth/login - Se connecter
- POST /auth/refresh - Rafraîchir l'access token
"""
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse

from app.crud import user as user_crud
from app.models.user import UserCreate, UserLogin, TokenResponse, RefreshTokenRequest, UserResponse
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_token,
)
from app.db.supabase_client import get_supabase

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])


# ============================================================================
# HELPER - Sauvegarder un refresh token (delete ancien + insert nouveau)
# ============================================================================

def _save_refresh_token(user_id: str, refresh_token: str, expires_at: datetime):
    """
    Sauvegarde le refresh token en base.
    Supprime d'abord l'ancien token de l'utilisateur pour éviter les doublons.
    """
    # Supprimer tous les anciens tokens de cet utilisateur
    get_supabase().table("refresh_tokens").delete().eq(
        "user_id", user_id
    ).execute()

    # Insérer le nouveau token
    get_supabase().table("refresh_tokens").insert({
        "user_id": user_id,
        "token_hash": hash_token(refresh_token),
        "expires_at": expires_at.isoformat(),
    }).execute()



# ============================================================================
# LOGIN - Se connecter
# ============================================================================

@router.post("/login", response_model=TokenResponse)
async def login(user_login: UserLogin):
    """Se connecter avec email et mot de passe"""

    # Récupérer l'utilisateur
    user = await user_crud.get_user_by_email_with_password(user_login.email)

    if not user:
        logger.warning(f"Tentative de connexion avec email inexistant : {user_login.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )

    # Vérifier le password
    if not verify_password(user_login.password, user.password_hash):
        logger.warning(f"Tentative de connexion avec mauvais password : {user_login.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect"
        )

    # Vérifier que l'utilisateur est actif
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ce compte a été désactivé"
        )

    # Mettre à jour last_login
    await user_crud.update_user_last_login(user.id)

    # Générer les tokens
    access_token, access_expires = create_access_token(user.id)
    refresh_token, refresh_expires = create_refresh_token(user.id)

    try:
        _save_refresh_token(str(user.id), refresh_token, refresh_expires)
    except Exception as e:
        logger.error(f"Erreur sauvegarde refresh token : {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création de la session"
        )

    logger.info(f"Connexion réussie : {user.email}")

    # ✅ Return user data along with tokens
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=30 * 60,
        user=UserResponse.from_orm(user)  # ✅ ADD THIS
    )


# ============================================================================
# REFRESH TOKEN - Rafraîchir l'access token
# ============================================================================

@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(request: RefreshTokenRequest):
    """
    Utiliser le refresh token pour obtenir un nouvel access token
    """

    # Décoder le refresh token
    payload = decode_token(request.refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token invalide ou expiré"
        )

    user_id = payload.get("sub")

    # Vérifier que le token existe en base (pas révoqué)
    try:
        response = get_supabase().table("refresh_tokens").select("*").eq(
            "token_hash", hash_token(request.refresh_token)
        ).execute()

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token non trouvé ou révoqué"
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur vérification refresh token : {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la vérification du token"
        )

    # Créer un nouvel access token
    access_token, _ = create_access_token(user_id)

    logger.info(f"Access token rafraîchi pour l'utilisateur : {user_id}")

    return TokenResponse(
        access_token=access_token,
        refresh_token=request.refresh_token,  # Réutiliser le même refresh token
        expires_in=30 * 60
    )


# ============================================================================
# LOGOUT - Révoquer le refresh token
# ============================================================================

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(request: RefreshTokenRequest):
    """
    Révoquer le refresh token (logout)
    """
    try:
        get_supabase().table("refresh_tokens").delete().eq(
            "token_hash", hash_token(request.refresh_token)
        ).execute()

        logger.info("Logout réussi")
        return None

    except Exception as e:
        logger.error(f"Erreur logout : {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors du logout"
        )