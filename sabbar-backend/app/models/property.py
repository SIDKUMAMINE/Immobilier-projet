"""
Modèles SQLAlchemy pour Property
Fichier: sabbar-backend/app/models/property.py

✅ CORRIGÉ:
- Modèles SQLAlchemy UNIQUEMENT (pas Pydantic)
- Tous les champs nécessaires
"""

from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


class Property(Base):
    """Modèle SQLAlchemy pour la table properties"""
    __tablename__ = "properties"

    # Clés primaires et relations
    id = Column(String, primary_key=True, index=True)
    owner_id = Column(String, nullable=False, index=True)

    # Informations de base
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    
    # Type et transaction
    property_type = Column(String, nullable=False)  # apartment, villa, house, etc.
    transaction_type = Column(String, nullable=False)  # sale, rent, etc.
    
    # Prix et dimensions
    price = Column(Float, nullable=False)
    area = Column(Float, nullable=False)
    
    # Détails du logement
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    floor = Column(Integer, nullable=True)
    
    # Localisation
    city = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=True)
    address = Column(String(255), nullable=True)
    
    # Équipements et caractéristiques
    has_parking = Column(Boolean, default=False)
    has_garden = Column(Boolean, default=False)
    has_pool = Column(Boolean, default=False)
    has_elevator = Column(Boolean, default=False)
    is_furnished = Column(Boolean, default=False)
    
    # Médias
    images = Column(String, default="[]")  # JSON array stored as string
    video = Column(String, nullable=True)
    
    # Statuts et métadonnées
    is_available = Column(Boolean, default=True)
    status = Column(String, default="available")  # available, pending, sold, archived, inactive
    views_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Property(id={self.id}, title={self.title}, city={self.city})>"