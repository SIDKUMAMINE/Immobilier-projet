"""
FastAPI Main Application - VERSION FINALE CORRIGÉE
Fichier: main.py

✅ COMPLET ET DANS LE BON ORDRE:
   - Routes CRUD propriétés
   - Normalisation des données
   - Upload d'images et vidéos
   - Gestion des buckets Supabase Storage
   - ✅ AUTHENTIFICATION INTÉGRÉE
   - ✅ CORS CORRIGÉ
"""
import json
from fastapi import FastAPI, Query, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import logging
from contextlib import asynccontextmanager
from typing import Optional
from supabase import Client
from pathlib import Path
import uuid
import os

# ✅ IMPORT SUPABASE
from app.db.supabase_client import get_db, init_supabase

# ✅ IMPORT AUTHENTIFICATION
from app.api.v1.endpoints import auth as auth_routes

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# FONCTION DE MAPPING - Normaliser les données
# ============================================================================
def normalize_property_data(data: dict) -> dict:
    """
    Normalise les données reçues du formulaire
    Mappe 'surface' → 'area'
    Ajoute les champs manquants
    """
    normalized = data.copy()
    
    # Mapper 'surface' → 'area'
    if 'surface' in normalized:
        normalized['area'] = normalized.pop('surface')
        logger.info(f"   ✓ Mapper: surface → area ({normalized['area']} m²)")
    
    # Ajouter owner_id s'il manque
    if not normalized.get('owner_id'):
        normalized['owner_id'] = 'test-agent-001'
        logger.info(f"   ✓ owner_id par défaut: test-agent-001")
    
    # Ajouter status s'il manque
    if not normalized.get('status'):
        normalized['status'] = 'available'
        logger.info(f"   ✓ status par défaut: available")
    
    # Ajouter location s'il manque (lat,lon)
    if not normalized.get('location'):
        normalized['location'] = '0,0'
        logger.info(f"   ✓ location par défaut: 0,0")
    
    # Nettoyer les champs vides ou None
    cleaned = {k: v for k, v in normalized.items() if v is not None and v != ''}
    
    logger.info(f"   ✓ Données normalisées: {list(cleaned.keys())}")
    
    return cleaned

# ============================================================================
# LIFESPAN - Startup/Shutdown
# ============================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gère le cycle de vie de l'application"""
    logger.info("=" * 70)
    logger.info("🚀 DÉMARRAGE APPLICATION SABBAR")
    logger.info("=" * 70)
    
    try:
        init_supabase()
        logger.info("✅ Supabase initialisé")
        
        try:
            supabase = get_db()
            response = supabase.table("properties").select("*").limit(1).execute()
            logger.info(f"✅ Connexion BD OK - {len(response.data)} propriété(s)")
        except Exception as test_error:
            logger.warning(f"⚠️ Test BD: {str(test_error)}")
        
        logger.info("✅ Application prête!")
        logger.info("=" * 70)
        
    except Exception as e:
        logger.error(f"❌ ERREUR DÉMARRAGE: {str(e)}")
        raise
    
    yield
    logger.info("🛑 Arrêt...")


# ============================================================================
# ✅ CRÉER L'APP (AVANT include_router!)
# ============================================================================
app = FastAPI(
    title="SABBAR API",
    description="API Immobilière SABBAR avec Authentification",
    version="1.0.0",
    lifespan=lifespan
)

# ============================================================================
# ✅ CORS MIDDLEWARE - CONFIGURATION CORRIGÉE
# ============================================================================
cors_origins = os.getenv("BACKEND_CORS_ORIGINS", '["http://localhost:3000", "http://localhost:8000"]')

# Parse the JSON string into a Python list
try:
    allowed_origins = json.loads(cors_origins)
    logger.info(f"✅ CORS Origines autorisées: {allowed_origins}")
except json.JSONDecodeError as e:
    logger.warning(f"⚠️ Erreur parsing CORS_ORIGINS: {str(e)}")
    allowed_origins = ["http://localhost:3000", "http://localhost:8000", "https://landmarkk-estate.com"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow ALL methods
    allow_headers=["*"],  # Allow ALL headers
    expose_headers=["*"],
    max_age=86400,  # Longer cache for preflight
)
@app.options("/{full_path:path}") 
async def preflight_handler(full_path: str):
    """Handle CORS preflight requests"""    
    return {"message": "CORS OK"}
logger.info("✅ Middleware CORS configuré")

# ============================================================================
# ✅ INCLURE LES ROUTERS D'AUTHENTIFICATION (APRÈS app creation!)
# ============================================================================
logger.info("📌 Inclusion des routers...")
app.include_router(
    auth_routes.router,
    prefix="/api/v1",
    tags=["authentication"]
)
logger.info("✅ Router d'authentification inclus: /api/v1/auth/*")

# ============================================================================
# HEALTHCHECK
# ============================================================================
@app.get("/health")
async def health():
    """Vérifier l'API"""
    return {"status": "ok"}


@app.get("/health/db")
async def health_db():
    """Vérifier la connexion BD"""
    try:
        supabase = get_db()
        response = supabase.table("properties").select("count", count="exact").execute()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": "disconnected", "error": str(e)}


@app.get("/")
async def root():
    """Endpoint racine"""
    return {
        "message": "SABBAR API",
        "version": "1.0.0",
        "endpoints": {
            "documentation": "/docs",
            "authentification": "/api/v1/auth/register, /api/v1/auth/login",
            "proprietes": "/api/v1/properties"
        }
    }


# ============================================================================
# ✅ ROUTES PROPERTIES - CRUD AVEC NORMALISATION
# ============================================================================

@app.get("/api/v1/properties")
async def get_all_properties(
    limit: int = Query(50, le=100, ge=1),
    offset: int = Query(0, ge=0),
    city: Optional[str] = Query(None),
    transaction_type: Optional[str] = Query(None),
):
    """📚 Récupérer toutes les propriétés"""
    try:
        supabase: Client = get_db()
        
        logger.info(f"📡 GET /properties")
        logger.info(f"   Filtres: city={city}, type={transaction_type}")
        
        query = supabase.table("properties").select("*")
        
        if city:
            query = query.eq("city", city)
            logger.info(f"   ✓ Filtre: city={city}")
        
        if transaction_type:
            query = query.eq("transaction_type", transaction_type)
            logger.info(f"   ✓ Filtre: transaction_type={transaction_type}")
        
        query = query.range(offset, offset + limit - 1)
        response = query.execute()
        
        logger.info(f"✅ {len(response.data)} propriétés trouvées")
        return response.data if response.data else []
        
    except Exception as e:
        logger.error(f"❌ Erreur: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/v1/properties/{property_id}")
async def get_property(property_id: str):
    """🏠 Récupérer une propriété par ID"""
    try:
        supabase: Client = get_db()
        response = supabase.table("properties").select("*").eq("id", property_id).execute()
        
        if response.data:
            return response.data[0]
        else:
            raise HTTPException(status_code=404, detail="Non trouvée")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/v1/properties")
async def create_property(property_data: dict):
    """
    ➕ Créer une propriété
    ✅ Normalise les données automatiquement
    """
    try:
        supabase: Client = get_db()
        
        logger.info(f"📝 Création propriété reçue:")
        logger.info(f"   Champs reçus: {list(property_data.keys())}")
        
        # ✅ NORMALISER LES DONNÉES
        normalized_data = normalize_property_data(property_data)
        
        logger.info(f"   Champs après normalisation: {list(normalized_data.keys())}")
        
        # Insérer
        response = supabase.table("properties").insert(normalized_data).execute()
        
        if response.data:
            logger.info(f"✅ Propriété créée: {response.data[0]['id']}")
            return response.data[0]
        else:
            raise HTTPException(status_code=400, detail="Impossible de créer")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur création: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@app.put("/api/v1/properties/{property_id}")
async def update_property(property_id: str, property_data: dict):
    """✏️ Mettre à jour une propriété"""
    try:
        supabase: Client = get_db()
        
        logger.info(f"🔄 Mise à jour: {property_id}")
        
        # Vérifier
        check = supabase.table("properties").select("id").eq("id", property_id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="Non trouvée")
        
        # ✅ NORMALISER LES DONNÉES
        normalized_data = normalize_property_data(property_data)
        
        # Mettre à jour
        response = supabase.table("properties").update(normalized_data).eq("id", property_id).execute()
        
        if response.data:
            logger.info(f"✅ Propriété mise à jour: {property_id}")
            return response.data[0]
        else:
            raise HTTPException(status_code=400, detail="Erreur")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/v1/properties/{property_id}")
async def delete_property(property_id: str):
    """🗑️ Supprimer une propriété"""
    try:
        supabase: Client = get_db()
        
        logger.info(f"Suppression: {property_id}")
        
        # Vérifier
        check = supabase.table("properties").select("id").eq("id", property_id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="Non trouvée")
        
        # Supprimer
        supabase.table("properties").delete().eq("id", property_id).execute()
        
        logger.info(f"✅ Propriété supprimée: {property_id}")
        return {"message": "Supprimée", "id": property_id}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# ✅ ENDPOINTS D'UPLOAD D'IMAGES ET VIDÉOS
# ============================================================================

# Créer les buckets au démarrage
@app.on_event("startup")
async def startup_event():
    """Initialiser les buckets au démarrage"""
    try:
        supabase = get_db()
        
        # Créer bucket pour images
        try:
            supabase.storage.create_bucket(
                "property-images",
                options={"public": True}
            )
            logger.info("✅ Bucket 'property-images' créé")
        except Exception as e:
            if "already exists" in str(e):
                logger.info("✅ Bucket 'property-images' existe déjà")
        
        # Créer bucket pour vidéos
        try:
            supabase.storage.create_bucket(
                "property-videos",
                options={"public": True}
            )
            logger.info("✅ Bucket 'property-videos' créé")
        except Exception as e:
            if "already exists" in str(e):
                logger.info("✅ Bucket 'property-videos' existe déjà")
                
    except Exception as e:
        logger.warning(f"⚠️ Erreur création buckets: {str(e)}")


# ENDPOINT 1: Upload images
@app.post("/api/v1/properties/{property_id}/images")
async def upload_property_images(
    property_id: str,
    files: list[UploadFile] = File(...)
):
    """📸 Upload des images pour une propriété"""
    try:
        supabase = get_db()
        
        logger.info(f"📸 Upload images pour propriété: {property_id}")
        logger.info(f"   Nombre d'images: {len(files)}")
        
        # Vérifier que la propriété existe
        check = supabase.table("properties").select("id").eq("id", property_id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="Propriété non trouvée")
        
        # Dossier de stockage
        storage_path = f"properties/{property_id}"
        image_urls = []
        
        # Uploader chaque image
        for idx, file in enumerate(files):
            try:
                # Générer un nom unique
                file_extension = Path(file.filename).suffix if file.filename else ".jpg"
                unique_filename = f"image_{idx}_{uuid.uuid4().hex}{file_extension}"
                file_path = f"{storage_path}/{unique_filename}"
                
                logger.info(f"   ↳ Upload image {idx + 1}/{len(files)}: {file.filename}")
                
                # Lire le contenu du fichier
                content = await file.read()
                
                # Uploader vers Supabase Storage
                supabase.storage.from_("property-images").upload(
                    file_path,
                    content,
                    file_options={"content-type": file.content_type or "image/jpeg"}
                )
                
                # Récupérer l'URL public
                public_url = supabase.storage.from_("property-images").get_public_url(file_path)
                image_urls.append(public_url)
                
                logger.info(f"   ✅ Image {idx + 1} uploadée")
                
            except Exception as e:
                logger.error(f"   ❌ Erreur upload image {idx + 1}: {str(e)}")
                continue
        
        if not image_urls:
            raise HTTPException(status_code=400, detail="Aucune image uploadée")
        
        # Mettre à jour la propriété
        logger.info(f"🔄 Mise à jour propriété avec {len(image_urls)} images")
        
        update_response = supabase.table("properties").update({
            "images": image_urls
        }).eq("id", property_id).execute()
        
        if update_response.data:
            logger.info(f"✅ Propriété mise à jour avec {len(image_urls)} images")
            return {
                "status": "success",
                "message": "Images uploadées avec succès",
                "property_id": property_id,
                "count": len(image_urls),
                "urls": image_urls
            }
        else:
            raise HTTPException(status_code=400, detail="Erreur mise à jour")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur upload images: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ENDPOINT 2: Upload vidéo
@app.post("/api/v1/properties/{property_id}/video")
async def upload_property_video(
    property_id: str,
    file: UploadFile = File(...)
):
    """🎥 Upload d'une vidéo pour une propriété"""
    try:
        supabase = get_db()
        
        logger.info(f"🎥 Upload vidéo pour propriété: {property_id}")
        logger.info(f"   Fichier: {file.filename}")
        
        # Vérifier que la propriété existe
        check = supabase.table("properties").select("id").eq("id", property_id).execute()
        if not check.data:
            raise HTTPException(status_code=404, detail="Propriété non trouvée")
        
        # Générer un nom unique
        file_extension = Path(file.filename).suffix if file.filename else ".mp4"
        unique_filename = f"video_{uuid.uuid4().hex}{file_extension}"
        file_path = f"properties/{property_id}/{unique_filename}"
        
        # Lire le contenu du fichier
        content = await file.read()
        file_size_mb = len(content) / (1024 * 1024)
        logger.info(f"   Taille: {file_size_mb:.2f} MB")
        
        # Vérifier la taille (max 100 MB)
        if file_size_mb > 100:
            raise HTTPException(status_code=413, detail="Fichier trop volumineux (max 100 MB)")
        
        # Uploader vers Supabase Storage
        supabase.storage.from_("property-videos").upload(
            file_path,
            content,
            file_options={"content-type": file.content_type or "video/mp4"}
        )
        
        # Récupérer l'URL public
        video_url = supabase.storage.from_("property-videos").get_public_url(file_path)
        
        logger.info(f"✅ Vidéo uploadée")
        
        # Mettre à jour la propriété
        logger.info(f"🔄 Mise à jour propriété avec vidéo")
        
        update_response = supabase.table("properties").update({
            "video": video_url
        }).eq("id", property_id).execute()
        
        if update_response.data:
            logger.info(f"✅ Propriété mise à jour avec vidéo")
            return {
                "status": "success",
                "message": "Vidéo uploadée avec succès",
                "property_id": property_id,
                "video_url": video_url
            }
        else:
            raise HTTPException(status_code=400, detail="Erreur mise à jour")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur upload vidéo: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ENDPOINT 3: Supprimer une image
@app.delete("/api/v1/properties/{property_id}/images/{image_index}")
async def delete_property_image(
    property_id: str,
    image_index: int
):
    """🗑️ Supprimer une image d'une propriété"""
    try:
        supabase = get_db()
        
        logger.info(f"🗑️ Suppression image {image_index} pour {property_id}")
        
        # Récupérer la propriété
        response = supabase.table("properties").select("images").eq("id", property_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Propriété non trouvée")
        
        images = response.data[0].get("images", [])
        
        if image_index < 0 or image_index >= len(images):
            raise HTTPException(status_code=400, detail="Index d'image invalide")
        
        # Supprimer l'image
        deleted_image = images.pop(image_index)
        logger.info(f"   Supprimée: {deleted_image}")
        
        # Mettre à jour
        update_response = supabase.table("properties").update({
            "images": images
        }).eq("id", property_id).execute()
        
        if update_response.data:
            logger.info(f"✅ Image supprimée")
            return {
                "status": "success",
                "message": "Image supprimée",
                "remaining_images": len(images)
            }
        else:
            raise HTTPException(status_code=400, detail="Erreur")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ENDPOINT 4: Supprimer la vidéo
@app.delete("/api/v1/properties/{property_id}/video")
async def delete_property_video(property_id: str):
    """🎥 Supprimer la vidéo d'une propriété"""
    try:
        supabase = get_db()
        
        logger.info(f"🎥 Suppression vidéo pour {property_id}")
        
        # Vérifier
        response = supabase.table("properties").select("id").eq("id", property_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Propriété non trouvée")
        
        # Supprimer
        update_response = supabase.table("properties").update({
            "video": None
        }).eq("id", property_id).execute()
        
        if update_response.data:
            logger.info(f"✅ Vidéo supprimée")
            return {"status": "success", "message": "Vidéo supprimée"}
        else:
            raise HTTPException(status_code=400, detail="Erreur")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erreur: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# LANCER L'APP
# ============================================================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)