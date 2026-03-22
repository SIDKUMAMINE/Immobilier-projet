"""
Endpoints pour le matching des annonces avec les critères du lead
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel

from app.crud.property import PropertyCRUD
from app.db.supabase_client import get_supabase_client

router = APIRouter()


class MatchRequest(BaseModel):
    extracted_criteria: Dict[str, Any]


async def match_properties(criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Trouve les annonces correspondant aux critères extraits
    """
    try:
        supabase = get_supabase_client()
        
        # Construire la requête Supabase avec filtres
        query = supabase.table("properties").select("*").eq("is_active", True)
        
        # Filtrer par ville
        if criteria.get("cities") and len(criteria["cities"]) > 0:
            # Si plusieurs villes, prendre la première
            city = criteria["cities"][0]
            query = query.ilike("city", f"%{city}%")
        
        # Filtrer par type de bien
        if criteria.get("property_type"):
            query = query.ilike("type", f"%{criteria['property_type']}%")
        
        # Filtrer par budget
        if criteria.get("budget_min") and criteria.get("budget_max"):
            query = query.gte("price", criteria["budget_min"]).lte("price", criteria["budget_max"])
        elif criteria.get("budget_max"):
            query = query.lte("price", criteria["budget_max"])
        
        # Filtrer par nombre de chambres
        if criteria.get("bedrooms"):
            query = query.gte("bedrooms", criteria["bedrooms"])
        
        # Limiter à 5 résultats
        query = query.limit(5)
        
        # Exécuter la requête
        response = query.execute()
        
        return response.data if response.data else []
        
    except Exception as e:
        print(f"Error matching properties: {e}")
        return []


@router.post("/match")
async def match_with_criteria(request: MatchRequest):
    """
    Trouve les annonces correspondant aux critères
    """
    try:
        properties = await match_properties(request.extracted_criteria)
        
        return {
            "count": len(properties),
            "properties": properties,
            "criteria": request.extracted_criteria
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/test")
async def test_matching():
    """
    Test avec des critères exemple
    """
    test_criteria = {
        "cities": ["Casablanca"],
        "property_type": "appartement",
        "budget_min": 800000,
        "budget_max": 1200000,
        "bedrooms": 2
    }
    
    properties = await match_properties(test_criteria)
    
    return {
        "count": len(properties),
        "properties": properties,
        "test_criteria": test_criteria
    }