"""Client Supabase - Lazy Loading avec singleton global"""
import logging
import os
from supabase import create_client, Client

logger = logging.getLogger(__name__)

class SupabaseClient:
    _instance: Client = None

    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            try:
                logger.info("🔌 Initialisation Supabase...")
                
                # Récupérer les variables d'environnement
                supabase_url = os.getenv("SUPABASE_URL")
                supabase_key = os.getenv("SUPABASE_KEY")
                
                if not supabase_url or not supabase_key:
                    raise ValueError("❌ SUPABASE_URL ou SUPABASE_KEY manquants dans .env")
                
                cls._instance = create_client(
                    supabase_url=supabase_url,
                    supabase_key=supabase_key
                )
                logger.info("✅ Supabase OK")
            except Exception as e:
                logger.error(f"❌ Erreur Supabase: {str(e)}")
                raise
        return cls._instance


# ✅ Fonctions utilitaires
def get_supabase() -> Client:
    """Récupérer le client Supabase"""
    return SupabaseClient.get_client()

def get_supabase_client() -> Client:
    """Récupérer le client Supabase (alias)"""
    return SupabaseClient.get_client()

def get_db() -> Client:
    """Récupérer le client Supabase (alias pour compatibilité)"""
    return SupabaseClient.get_client()


# ✅ Variable singleton globale (ce qui manquait!)
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