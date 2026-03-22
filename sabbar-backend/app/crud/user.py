"""
Opérations CRUD pour les utilisateurs
"""
import logging
from typing import Optional
from uuid import UUID
from datetime import datetime, timezone

from app.db.supabase_client import get_supabase
from app.models.user import UserCreate, UserInDB
from app.core.security import hash_password

logger = logging.getLogger(__name__)


def split_full_name(full_name: str) -> tuple[str, str]:
    """Diviser full_name en first_name et last_name"""
    parts = full_name.strip().split(" ", 1)
    first_name = parts[0]
    last_name = parts[1] if len(parts) > 1 else ""
    return first_name, last_name


def merge_full_name(data: dict) -> dict:
    """
    Convertir first_name + last_name en full_name
    pour compatibilité avec le modèle Pydantic
    """
    if "first_name" in data and "full_name" not in data:
        first = data.get("first_name", "") or ""
        last = data.get("last_name", "") or ""
        data["full_name"] = f"{first} {last}".strip()
    return data


# ============================================================================
# CREATE
# ============================================================================

async def create_user(user_create: UserCreate) -> Optional[UserInDB]:
    """
    Créer un nouvel utilisateur (agent immobilier)
    """
    try:
        password_hash = hash_password(user_create.password)
        first_name, last_name = split_full_name(user_create.full_name)

        user_data = {
            "email": user_create.email.lower(),
            "first_name": first_name,
            "last_name": last_name,
            "password_hash": password_hash,
            "is_active": True,
        }

        # Ajouter les champs optionnels si présents
        if user_create.phone_number:
            user_data["phone_number"] = user_create.phone_number
        if user_create.agency_name:
            user_data["agency_name"] = user_create.agency_name

        response = get_supabase().table("users").insert(user_data).execute()

        if response.data:
            logger.info(f"Utilisateur créé : {user_create.email}")
            return UserInDB(**merge_full_name(response.data[0]))

        return None

    except Exception as e:
        logger.error(f"Erreur création utilisateur : {str(e)}")
        return None


# ============================================================================
# READ
# ============================================================================

async def get_user_by_id(user_id: UUID) -> Optional[UserInDB]:
    """Récupérer un utilisateur par son ID"""
    try:
        response = get_supabase().table("users").select("*").eq("id", str(user_id)).execute()

        if response.data:
            return UserInDB(**merge_full_name(response.data[0]))
        return None

    except Exception as e:
        logger.error(f"Erreur lecture utilisateur : {str(e)}")
        return None


async def get_user_by_email(email: str) -> Optional[UserInDB]:
    """Récupérer un utilisateur par son email"""
    try:
        response = (
            get_supabase().table("users")
            .select("*")
            .eq("email", email.lower())
            .execute()
        )

        if response.data:
            return UserInDB(**merge_full_name(response.data[0]))
        return None

    except Exception as e:
        logger.error(f"Erreur lecture utilisateur par email : {str(e)}")
        return None


async def get_user_by_email_with_password(email: str) -> Optional[UserInDB]:
    """
    Récupérer un utilisateur avec son password hash (pour authentification)
    """
    try:
        response = (
            get_supabase().table("users")
            .select("*")
            .eq("email", email.lower())
            .execute()
        )

        if response.data:
            return UserInDB(**merge_full_name(response.data[0]))
        return None

    except Exception as e:
        logger.error(f"Erreur authentification : {str(e)}")
        return None


async def get_all_users(skip: int = 0, limit: int = 100) -> list[UserInDB]:
    """Lister tous les utilisateurs"""
    try:
        response = (
            get_supabase().table("users")
            .select("*")
            .range(skip, skip + limit - 1)
            .execute()
        )

        return [UserInDB(**merge_full_name(u)) for u in response.data] if response.data else []

    except Exception as e:
        logger.error(f"Erreur listage utilisateurs : {str(e)}")
        return []


# ============================================================================
# UPDATE
# ============================================================================

async def update_user_last_login(user_id: UUID) -> bool:
    """Mettre à jour le timestamp last_login"""
    try:
        get_supabase().table("users").update({
            "last_login": datetime.now(timezone.utc).isoformat()
        }).eq("id", str(user_id)).execute()

        return True

    except Exception as e:
        logger.error(f"Erreur update last_login : {str(e)}")
        return False


async def update_user(user_id: UUID, **kwargs) -> Optional[UserInDB]:
    """Mettre à jour un utilisateur"""
    try:
        # Si full_name est passé, le convertir
        if "full_name" in kwargs:
            first_name, last_name = split_full_name(kwargs.pop("full_name"))
            kwargs["first_name"] = first_name
            kwargs["last_name"] = last_name

        kwargs["updated_at"] = datetime.now(timezone.utc).isoformat()

        response = (
            get_supabase().table("users")
            .update(kwargs)
            .eq("id", str(user_id))
            .execute()
        )

        if response.data:
            return UserInDB(**merge_full_name(response.data[0]))
        return None

    except Exception as e:
        logger.error(f"Erreur update utilisateur : {str(e)}")
        return None


# ============================================================================
# DELETE
# ============================================================================

async def delete_user(user_id: UUID) -> bool:
    """Soft delete un utilisateur (is_active = False)"""
    try:
        get_supabase().table("users").update({
            "is_active": False
        }).eq("id", str(user_id)).execute()

        logger.info(f"Utilisateur désactivé : {user_id}")
        return True

    except Exception as e:
        logger.error(f"Erreur suppression utilisateur : {str(e)}")
        return False