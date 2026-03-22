from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel

# ==================== MODÈLES PYDANTIC ====================

class PropertyCreate(BaseModel):
    """Modèle pour créer une propriété"""
    title: str
    description: str
    price: float
    surface: float
    bedrooms: int
    bathrooms: int
    transaction_type: str  # "Vente" ou "Location"
    property_type: str     # "Appartement", "Maison", etc.
    location: str
    image_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class Property(PropertyCreate):
    """Modèle pour afficher une propriété"""
    id: Optional[int] = None
    
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    role: str = "user"

class User(UserCreate):
    id: Optional[int] = None
    
    class Config:
        from_attributes = True

class ContactCreate(BaseModel):
    name: str
    email: str
    phone: str
    message: str
    property_id: Optional[int] = None

class Contact(ContactCreate):
    id: Optional[int] = None
    
    class Config:
        from_attributes = True

# ==================== ROUTEUR ====================

api_router = APIRouter()

# ==================== ROUTES DE BASE ====================

@api_router.get("/")
async def read_root():
    """Route racine de l'API"""
    return {
        "message": "Bienvenue sur l'API Sabbar",
        "version": "1.0.0",
        "description": "API pour la plateforme immobilière"
    }

@api_router.get("/health")
async def health_check():
    """Vérifier l'état de l'API"""
    return {"status": "ok", "message": "API est opérationnelle"}

# ==================== ROUTES PROPRIÉTÉS ====================

# Données temporaires (à remplacer par une vraie base de données)
fake_properties_db = [
    {
        "id": 1,
        "title": "Bel appartement à Casablanca",
        "description": "Appartement moderne avec vue sur la mer",
        "price": 2500000,
        "surface": 120.0,
        "bedrooms": 3,
        "bathrooms": 2,
        "transaction_type": "Vente",
        "property_type": "Appartement",
        "location": "Casablanca",
        "image_url": None
    }
]

@api_router.get("/properties", response_model=List[Property])
async def get_properties(skip: int = 0, limit: int = 10):
    """Récupérer la liste des propriétés"""
    return fake_properties_db[skip:skip + limit]

@api_router.get("/properties/{property_id}", response_model=Property)
async def get_property(property_id: int):
    """Récupérer une propriété par ID"""
    for prop in fake_properties_db:
        if prop["id"] == property_id:
            return prop
    raise HTTPException(status_code=404, detail="Propriété non trouvée")

@api_router.post("/properties", response_model=Property)
async def create_property(property_data: PropertyCreate):
    """Créer une nouvelle propriété"""
    # TODO: Remplacer par une vraie insertion en base de données
    new_property = property_data.dict()
    new_property["id"] = len(fake_properties_db) + 1
    fake_properties_db.append(new_property)
    return new_property

@api_router.put("/properties/{property_id}", response_model=Property)
async def update_property(property_id: int, property_data: PropertyCreate):
    """Mettre à jour une propriété"""
    # TODO: Remplacer par une vraie mise à jour en base de données
    for i, prop in enumerate(fake_properties_db):
        if prop["id"] == property_id:
            updated_property = property_data.dict()
            updated_property["id"] = property_id
            fake_properties_db[i] = updated_property
            return updated_property
    raise HTTPException(status_code=404, detail="Propriété non trouvée")

@api_router.delete("/properties/{property_id}")
async def delete_property(property_id: int):
    """Supprimer une propriété"""
    # TODO: Remplacer par une vraie suppression en base de données
    for i, prop in enumerate(fake_properties_db):
        if prop["id"] == property_id:
            fake_properties_db.pop(i)
            return {"message": f"Propriété {property_id} supprimée"}
    raise HTTPException(status_code=404, detail="Propriété non trouvée")

# ==================== ROUTES UTILISATEURS ====================

fake_users_db = []

@api_router.get("/users", response_model=List[User])
async def get_users():
    """Récupérer la liste des utilisateurs"""
    return fake_users_db

@api_router.post("/users", response_model=User)
async def create_user(user_data: UserCreate):
    """Créer un nouvel utilisateur"""
    new_user = user_data.dict()
    new_user["id"] = len(fake_users_db) + 1
    fake_users_db.append(new_user)
    return new_user

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int):
    """Récupérer un utilisateur par ID"""
    for user in fake_users_db:
        if user["id"] == user_id:
            return user
    raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

# ==================== ROUTES CONTACTS ====================

fake_contacts_db = []

@api_router.post("/contacts", response_model=Contact)
async def create_contact(contact_data: ContactCreate):
    """Créer une demande de contact"""
    new_contact = contact_data.dict()
    new_contact["id"] = len(fake_contacts_db) + 1
    fake_contacts_db.append(new_contact)
    return new_contact

@api_router.get("/contacts")
async def get_contacts():
    """Récupérer tous les contacts"""
    return fake_contacts_db

# ==================== ROUTES RECHERCHE ====================

@api_router.get("/search")
async def search_properties(
    location: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None
):
    """Rechercher des propriétés avec filtres"""
    results = fake_properties_db
    
    if location:
        results = [p for p in results if location.lower() in p["location"].lower()]
    
    if min_price:
        results = [p for p in results if p["price"] >= min_price]
    
    if max_price:
        results = [p for p in results if p["price"] <= max_price]
    
    if bedrooms:
        results = [p for p in results if p["bedrooms"] >= bedrooms]
    
    return {
        "filters": {
            "location": location,
            "min_price": min_price,
            "max_price": max_price,
            "bedrooms": bedrooms
        },
        "results": results
    }