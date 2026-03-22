"""
CRUD operations for Property
Fichier: sabbar-backend/app/crud/property.py

✅ CORRIGÉ:
- Import depuis app.models.property (PAS schemas)
- SANS vérification propriétaire pour update/delete
"""

from typing import List, Optional
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

# ✅ IMPORT CORRECT - PropertyCreate et PropertyUpdate sont dans property.py
from app.models.property import PropertyCreate, PropertyUpdate, Property


class PropertyCRUD:
    """CRUD operations for Properties"""

    @staticmethod
    async def create_property(
        session: AsyncSession,
        property_data: PropertyCreate,
        owner_id: str
    ) -> Property:
        """
        Créer une nouvelle propriété
        """
        new_property = Property(
            title=property_data.title,
            description=property_data.description,
            transaction_type=property_data.transaction_type,
            property_type=property_data.property_type,
            price=property_data.price,
            area=property_data.area,
            bedrooms=property_data.bedrooms,
            bathrooms=property_data.bathrooms,
            city=property_data.city,
            district=property_data.district,
            address=property_data.address,
            owner_id=owner_id,
            is_available=getattr(property_data, 'is_available', True),
            images=getattr(property_data, 'images', [])
        )
        session.add(new_property)
        await session.commit()
        await session.refresh(new_property)
        return new_property

    @staticmethod
    async def get_property(session: AsyncSession, property_id: str) -> Optional[Property]:
        """
        Récupérer une propriété par ID
        """
        result = await session.execute(
            select(Property).where(Property.id == property_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_properties(
        session: AsyncSession,
        limit: int = 50,
        offset: int = 0,
        city: Optional[str] = None,
        transaction_type: Optional[str] = None
    ) -> List[Property]:
        """
        Récupérer toutes les propriétés avec filtres optionnels
        """
        query = select(Property)

        if city:
            query = query.where(Property.city == city)
        if transaction_type:
            query = query.where(Property.transaction_type == transaction_type)

        query = query.limit(limit).offset(offset)
        result = await session.execute(query)
        return result.scalars().all()

    @staticmethod
    async def get_owner_properties(
        session: AsyncSession,
        owner_id: str,
        limit: int = 50
    ) -> List[Property]:
        """
        Récupérer les propriétés d'un propriétaire spécifique
        """
        result = await session.execute(
            select(Property)
            .where(Property.owner_id == owner_id)
            .limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def update_property(
        session: AsyncSession,
        property_id: str,
        property_data: PropertyUpdate
    ) -> Optional[Property]:
        """
        Mettre à jour une propriété
        
        ✅ IMPORTANT: PAS DE VÉRIFICATION DE PROPRIÉTAIRE
        L'admin peut modifier n'importe quelle propriété
        """
        # Vérifie que la propriété existe
        property_obj = await PropertyCRUD.get_property(session, property_id)
        if not property_obj:
            return None

        # ✅ UPDATE DIRECT - SANS VÉRIFICATION DE PROPRIÉTAIRE
        update_data = property_data.dict(exclude_unset=True)
        
        await session.execute(
            update(Property)
            .where(Property.id == property_id)
            .values(**update_data)
        )
        await session.commit()
        
        # Retourne la propriété mise à jour
        return await PropertyCRUD.get_property(session, property_id)

    @staticmethod
    async def delete_property(
        session: AsyncSession,
        property_id: str
    ) -> bool:
        """
        Supprimer une propriété
        
        ✅ IMPORTANT: PAS DE VÉRIFICATION DE PROPRIÉTAIRE
        L'admin peut supprimer n'importe quelle propriété
        """
        # Vérifie que la propriété existe
        property_obj = await PropertyCRUD.get_property(session, property_id)
        if not property_obj:
            return False

        # ✅ DELETE DIRECT - SANS VÉRIFICATION DE PROPRIÉTAIRE
        await session.execute(
            delete(Property).where(Property.id == property_id)
        )
        await session.commit()
        return True

    @staticmethod
    async def search_properties(
        session: AsyncSession,
        keyword: str,
        limit: int = 50
    ) -> List[Property]:
        """
        Rechercher des propriétés par titre ou description
        """
        result = await session.execute(
            select(Property)
            .where(
                (Property.title.ilike(f"%{keyword}%")) |
                (Property.description.ilike(f"%{keyword}%"))
            )
            .limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def filter_properties(
        session: AsyncSession,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        city: Optional[str] = None,
        property_type: Optional[str] = None,
        transaction_type: Optional[str] = None,
        limit: int = 50
    ) -> List[Property]:
        """
        Filtrer les propriétés par critères multiples
        """
        query = select(Property)

        if min_price is not None:
            query = query.where(Property.price >= min_price)
        if max_price is not None:
            query = query.where(Property.price <= max_price)
        if city:
            query = query.where(Property.city == city)
        if property_type:
            query = query.where(Property.property_type == property_type)
        if transaction_type:
            query = query.where(Property.transaction_type == transaction_type)

        query = query.limit(limit)
        result = await session.execute(query)
        return result.scalars().all()


# ✅ Factory function pour rétrocompatibilité
def get_property_crud():
    """Factory pour accéder aux opérations CRUD"""
    return PropertyCRUD