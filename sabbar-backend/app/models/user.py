"""
Modèles pour la gestion des utilisateurs (agents immobiliers)
"""
from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, validator


# ============================================================================
# MODÈLES REQUEST/RESPONSE
# ============================================================================

class UserBase(BaseModel):
    """Données de base pour un utilisateur"""
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)
    phone_number: Optional[str] = None
    agency_name: Optional[str] = None


class UserCreate(UserBase):
    """Données pour créer un utilisateur"""
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('password')
    def validate_password(cls, v):
        """Valider la complexité du password"""
        if not any(char.isupper() for char in v):
            raise ValueError("Le mot de passe doit contenir au moins une majuscule")
        if not any(char.isdigit() for char in v):
            raise ValueError("Le mot de passe doit contenir au moins un chiffre")
        if not any(char in "!@#$%^&*()_+-=[]{}|;:,.<>?" for char in v):
            raise ValueError("Le mot de passe doit contenir au moins un caractère spécial")
        return v


class UserLogin(BaseModel):
    """Données pour se connecter"""
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserResponse(UserBase):
    """Réponse API pour un utilisateur (sans password)"""
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class LoggedUser(BaseModel):
    id: str
    email: str
    full_name: str
    is_active: bool
    
    class Config:
        from_attributes = True


class UserInDB(UserResponse):
    """Modèle utilisateur dans la base de données"""
    password_hash: str


# ============================================================================
# MODÈLES AUTHENTIFICATION
# ============================================================================

class TokenPayload(BaseModel):
    """Payload d'un JWT token"""
    sub: str  # user_id
    type: str  # "access" ou "refresh"
    iat: int  # issued at
    exp: int  # expiration


class TokenResponse(BaseModel):
    """Réponse contenant les tokens"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # secondes
    user: LoggedUser
    
    class Config:
        from_attributes = True

class RefreshTokenRequest(BaseModel):
    """Requête pour rafraîchir l'access token"""
    refresh_token: str