"""
Modèles Pydantic pour Property - CORRIGÉ
Fichier: sabbar-backend/app/schemas/property.py

✅ CORRIGÉ:
- Modèles Pydantic UNIQUEMENT (pas SQLAlchemy)
- Import correct des enums
- Tous les champs de validation
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class PropertyType(str, Enum):
    """Types de propriétés disponibles"""
    apartment = "apartment"
    villa = "villa"
    house = "house"
    riad = "riad"
    land = "land"
    office = "office"
    commercial = "commercial"
    bureau = "bureau"


class TransactionType(str, Enum):
    """Types de transactions"""
    sale = "sale"
    rent = "rent"
    vacation_rental = "vacation_rental"


class PropertyStatus(str, Enum):
    """Status des propriétés"""
    available = "available"      # Disponible
    pending = "pending"          # En attente
    inactive = "inactive"        # Inactive (annonce ancienne)
    sold = "sold"               # Vendue/louée
    archived = "archived"       # Archivée


class PropertyBase(BaseModel):
    """Schéma de base pour Property"""
    title: str = Field(..., min_length=10, max_length=200)
    description: str = Field(..., min_length=20, max_length=2000)
    price: float = Field(..., gt=0)
    property_type: PropertyType
    transaction_type: TransactionType
    city: str = Field(..., min_length=2, max_length=100)
    district: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=255)
    area: float = Field(..., gt=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    floor: Optional[int] = None
    has_parking: bool = False
    has_garden: bool = False
    has_pool: bool = False
    has_elevator: bool = False
    is_furnished: bool = False
    is_available: bool = True
    images: Optional[List[str]] = Field(default_factory=list)
    video: Optional[str] = None
    status: PropertyStatus = PropertyStatus.available


class PropertyCreate(PropertyBase):
    """Schéma pour créer une propriété"""
    pass


class PropertyUpdate(BaseModel):
    """Schéma pour mettre à jour une propriété - tous les champs optionnels"""
    title: Optional[str] = Field(None, min_length=10, max_length=200)
    description: Optional[str] = Field(None, min_length=20, max_length=2000)
    price: Optional[float] = Field(None, gt=0)
    property_type: Optional[PropertyType] = None
    transaction_type: Optional[TransactionType] = None
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    district: Optional[str] = Field(None, max_length=100)
    address: Optional[str] = Field(None, max_length=255)
    area: Optional[float] = Field(None, gt=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    floor: Optional[int] = None
    has_parking: Optional[bool] = None
    has_garden: Optional[bool] = None
    has_pool: Optional[bool] = None
    has_elevator: Optional[bool] = None
    is_furnished: Optional[bool] = None
    is_available: Optional[bool] = None
    images: Optional[List[str]] = None
    video: Optional[str] = None
    status: Optional[PropertyStatus] = None


class PropertyResponse(BaseModel):
    """Schéma pour la réponse complète"""
    id: str
    title: str
    description: str
    price: float
    property_type: PropertyType
    transaction_type: TransactionType
    city: str
    district: Optional[str]
    address: Optional[str]
    area: float
    bedrooms: Optional[int]
    bathrooms: Optional[int]
    floor: Optional[int]
    has_parking: bool
    has_garden: bool
    has_pool: bool
    has_elevator: bool
    is_furnished: bool
    is_available: bool
    images: Optional[List[str]]
    video: Optional[str]
    status: PropertyStatus
    owner_id: str
    views_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PropertyList(BaseModel):
    """Schéma simplifié pour les listes"""
    id: str
    title: str
    price: float
    property_type: PropertyType
    transaction_type: TransactionType
    city: str
    district: Optional[str]
    area: float
    bedrooms: Optional[int]
    bathrooms: Optional[int]
    images: Optional[List[str]]
    video: Optional[str]
    status: PropertyStatus
    created_at: datetime

    class Config:
        from_attributes = True