"""
Service de sécurité et d'authentification
- Hachage des mots de passe
- Génération et validation des JWT tokens
- Extraction des claims des tokens
"""
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple
from uuid import UUID
import jwt
from passlib.context import CryptContext
from pydantic import ValidationError

# Configuration
from app.core.config import settings

# ============================================================================
# CONFIGURATION PASSWORD HASHING
# ============================================================================

# Utiliser bcrypt pour le hachage des passwords (sécurisé et lent intentionnellement)
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12  # Nombre d'itérations (plus élevé = plus sécurisé mais plus lent)
)


# ============================================================================
# FONCTIONS DE PASSWORD
# ============================================================================

def hash_password(password: str) -> str:
    """Hacher un mot de passe"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifier un mot de passe contre son hash"""
    return pwd_context.verify(plain_password, hashed_password)


# ============================================================================
# FONCTIONS JWT
# ============================================================================

def create_access_token(user_id: UUID, expires_delta: Optional[timedelta] = None) -> Tuple[str, datetime]:
    """
    Créer un access token JWT
    
    Args:
        user_id: UUID de l'utilisateur
        expires_delta: Durée de validité personnalisée
        
    Returns:
        Tuple (token, expires_at)
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    now = datetime.now(timezone.utc)
    expires_at = now + expires_delta
    
    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    
    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return token, expires_at


def create_refresh_token(user_id: UUID, expires_delta: Optional[timedelta] = None) -> Tuple[str, datetime]:
    """
    Créer un refresh token JWT
    
    Args:
        user_id: UUID de l'utilisateur
        expires_delta: Durée de validité personnalisée
        
    Returns:
        Tuple (token, expires_at)
    """
    if expires_delta is None:
        expires_delta = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    now = datetime.now(timezone.utc)
    expires_at = now + expires_delta
    
    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    
    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return token, expires_at


def decode_token(token: str) -> Optional[dict]:
    """
    Décoder et valider un JWT token
    
    Args:
        token: Token JWT
        
    Returns:
        Payload du token ou None si invalide
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expiré
    except jwt.InvalidTokenError:
        return None  # Token invalide


def hash_token(token: str) -> str:
    """
    Hacher un token pour le stocker en base de données
    (plus sécurisé que de stocker le token en clair)
    """
    return hashlib.sha256(token.encode()).hexdigest()


def generate_random_token() -> str:
    """Générer un token aléatoire pour d'autres usages"""
    return secrets.token_urlsafe(32)