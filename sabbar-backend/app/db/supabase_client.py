"""Client Supabase - Lazy Loading avec singleton global"""
import logging
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger(__name__)

class SupabaseClient:
    _instance: Client = None

    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            try:
                logger.info("🔌 Initialisation Supabase...")
                cls._instance = create_client(
                    supabase_url=settings.SUPABASE_URL,
                    supabase_key=settings.SUPABASE_KEY
                )
                logger.info("✅ Supabase OK")
            except Exception as e:
                logger.error(f"❌ Erreur Supabase: {str(e)}")
                raise
        return cls._instance


# ✅ AJOUT: Fonctions utilitaires
def get_supabase() -> Client:
    return SupabaseClient.get_client()

def get_supabase_client() -> Client:
    return SupabaseClient.get_client()

def get_db() -> Client:
    return SupabaseClient.get_client()


# ✅ AJOUT CRITIQUE: Variable singleton globale (ce qui manquait!)
supabase: Client = None

def init_supabase():
    """Initialise le client Supabase au démarrage"""
    global supabase
    supabase = get_supabase()
    logger.info("✅ Supabase initialisé")


# ✅ Export pour les imports existants
__all__ = [
    "get_supabase",
    "get_supabase_client", 
    "get_db",
    "SupabaseClient",
    "supabase",
    "init_supabase"
]