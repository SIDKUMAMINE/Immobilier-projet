"""
Routes pour Property API - CORRIGÉ ET SÉCURISÉ
Fichier: sabbar-backend/app/api/v1/endpoints/properties.py
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import Optional
import logging
from uuid import uuid4

from app.models.property import PropertyCreate, PropertyUpdate, Property, PropertyStatus
from app.db.supabase_client import get_db

logger = logging.getLogger(__name__)

router = APIRouter(tags=["properties"])


# ============================================================================
# 1️⃣ CRÉER PROPRIÉTÉ (POST) - PUBLIQUE POUR DEV
# ============================================================================
@router.post("")
async def create_property(
    property_data: PropertyCreate,
    supabase: Client = Depends(get_db)
):
    """
    Créer une nouvelle propriété
    
    ✅ CORRIGÉ:
    - owner_id est généré automatiquement
    - status par défaut = "available"
    - Toutes les données sont sauvegardées
    """
    try:
        # Préparer les données
        data_dict = property_data.dict()
        
        # ✅ CORRECTION 1: Générer un owner_id unique
        # En production, ce serait: current_agent: str = Depends(get_current_agent)
        data_dict["owner_id"] = f"agent-{str(uuid4())[:8]}"
        
        # ✅ CORRECTION 2: S'assurer que le status est défini
        if not data_dict.get("status"):
            data_dict["status"] = "available"
        
        logger.info(f"📝 Création propriété: {property_data.title}")
        logger.info(f"   owner_id: {data_dict['owner_id']}")
        logger.info(f"   status: {data_dict['status']}")
        
        # Insérer dans Supabase
        response = supabase.table("properties").insert(data_dict).execute()
        
        if response.data:
            logger.info(f"✅ Propriété créée: {response.data[0]['id']}")
            return response.data[0]
        else:
            raise HTTPException(status_code=400, detail="Impossible de créer la propriété")
            
    except Exception as e:
        logger.error(f"❌ Erreur création propriété: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# 2️⃣ LISTER TOUTES LES PROPRIÉTÉS (GET sans paramètre)
# ============================================================================
@router.get("")
async def get_all_properties(
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    city: Optional[str] = Query(None),
    transaction_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),  # ✅ AJOUTÉ: filtre par status
    supabase: Client = Depends(get_db)
):
    """
    Récupérer toutes les propriétés avec filtres optionnels
    
    ✅ CORRIGÉ:
    - Filtre par status pour voir les annonces anciennes (inactive)
    - Filtre par ville et type de transaction
    - Pagination avec limit et offset
    """
    try:
        # Construire la requête
        query = supabase.table("properties").select("*")
        
        # Appliquer les filtres
        if city:
            logger.info(f"🔍 Filtre city: {city}")
            query = query.eq("city", city)
            
        if transaction_type:
            logger.info(f"🔍 Filtre transaction_type: {transaction_type}")
            query = query.eq("transaction_type", transaction_type)
        
        # ✅ Filtre status - par défaut "available" si non spécifié
        if status:
            logger.info(f"🔍 Filtre status: {status}")
            query = query.eq("status", status)
        else:
            # Par défaut, afficher uniquement les propriétés disponibles
            logger.info(f"🔍 Filtre status par défaut: available")
            query = query.eq("status", "available")
        
        # Appliquer limit et offset
        query = query.range(offset, offset + limit - 1)
        
        # Exécuter
        response = query.execute()
        
        logger.info(f"📚 Propriétés récupérées: {len(response.data)} résultats")
        return response.data if response.data else []
        
    except Exception as e:
        logger.error(f"❌ Erreur lecture propriétés: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# 3️⃣ RÉCUPÉRER PROPRIÉTÉ PAR ID
# ============================================================================
@router.get("/{property_id}")
async def get_property(
    property_id: str,
    supabase: Client = Depends(get_db)
):
    """
    Récupérer une propriété par ID
    """
    try:
        response = supabase.table("properties").select("*").eq("id", property_id).execute()
        
        if response.data:
            logger.info(f"✅ Propriété trouvée: {property_id}")
            return response.data[0]
        else:
            raise HTTPException(status_code=404, detail="Propriété non trouvée")
            
    except Exception as e:
        logger.error(f"❌ Erreur lecture propriété: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# 4️⃣ MODIFIER PROPRIÉTÉ (PUT)
# ============================================================================
@router.put("/{property_id}")
async def update_property(
    property_id: str,
    property_data: PropertyUpdate,
    supabase: Client = Depends(get_db)
):
    """
    Mettre à jour une propriété
    """
    try:
        # Vérifier que la propriété existe
        check = supabase.table("properties").select("id").eq("id", property_id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="Propriété non trouvée")
        
        # Mettre à jour (uniquement les champs définis)
        update_data = property_data.dict(exclude_unset=True)
        
        logger.info(f"🔄 Mise à jour propriété: {property_id}")
        
        response = supabase.table("properties").update(update_data).eq("id", property_id).execute()
        
        if response.data:
            logger.info(f"✅ Propriété mise à jour: {property_id}")
            return response.data[0]
        else:
            raise HTTPException(status_code=400, detail="Impossible de mettre à jour la propriété")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur mise à jour propriété: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# 5️⃣ SUPPRIMER PROPRIÉTÉ (DELETE)
# ============================================================================
@router.delete("/{property_id}")
async def delete_property(
    property_id: str,
    supabase: Client = Depends(get_db)
):
    """
    Supprimer une propriété
    """
    try:
        # Vérifier que la propriété existe
        check = supabase.table("properties").select("id").eq("id", property_id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="Propriété non trouvée")
        
        logger.info(f"🗑️ Suppression propriété: {property_id}")
        
        # Supprimer
        response = supabase.table("properties").delete().eq("id", property_id).execute()
        
        logger.info(f"✅ Propriété supprimée: {property_id}")
        return {"message": "Propriété supprimée avec succès", "id": property_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur suppression propriété: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# 6️⃣ RÉCUPÉRER PROPRIÉTÉS PAR AGENT
# ============================================================================
@router.get("/agent/{agent_id}")
async def get_agent_properties(
    agent_id: str,
    limit: int = Query(50, le=100),
    supabase: Client = Depends(get_db)
):
    """
    Récupérer les propriétés d'un agent spécifique
    """
    try:
        response = (
            supabase.table("properties")
            .select("*")
            .eq("owner_id", agent_id)
            .limit(limit)
            .execute()
        )
        
        logger.info(f"👤 Propriétés agent {agent_id}: {len(response.data)} résultats")
        return response.data if response.data else []
        
    except Exception as e:
        logger.error(f"❌ Erreur lecture propriétés agent: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# 7️⃣ RÉCUPÉRER TOUTES LES PROPRIÉTÉS (ADMIN - inclus les anciennes)
# ============================================================================
@router.get("/admin/all")
async def get_all_properties_admin(
    limit: int = Query(100, le=1000),
    offset: int = Query(0, ge=0),
    supabase: Client = Depends(get_db)
):
    """
    ⭐ ROUTE ADMIN: Récupère TOUTES les propriétés (y compris inactive, sold, etc.)
    
    À PROTÉGER EN PRODUCTION avec une vérification du rôle admin!
    """
    try:
        # NE PAS filtrer par status - récupérer TOUT
        query = supabase.table("properties").select("*")
        query = query.range(offset, offset + limit - 1)
        
        response = query.execute()
        
        logger.info(f"📚 [ADMIN] Propriétés récupérées: {len(response.data)} résultats")
        return response.data if response.data else []
        
    except Exception as e:
        logger.error(f"❌ Erreur lecture propriétés admin: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))