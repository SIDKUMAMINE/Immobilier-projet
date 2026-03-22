"""Agent de qualification avec Claude API - SABBAR"""
import logging
import asyncio
import json
from typing import Optional
from anthropic import Anthropic
from app.core.config import settings

logger = logging.getLogger(__name__)

class QualificationAgent:
    """Agent immobilier de qualification avec Claude API"""
    _instance: Optional['QualificationAgent'] = None
    _lock = asyncio.Lock()
    
    def __init__(self):
        try:
            logger.info("🤖 Initialisation Agent Claude...")
            self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            self.model = settings.LLM_MODEL
            logger.info(f"✅ Agent Claude initialisé avec modèle: {self.model}")
        except Exception as e:
            logger.error(f"❌ Erreur initialisation Agent: {str(e)}")
            raise
    
    @classmethod
    async def get_instance(cls) -> 'QualificationAgent':
        """Singleton thread-safe avec async"""
        if cls._instance is None:
            async with cls._lock:
                if cls._instance is None:
                    cls._instance = QualificationAgent()
        return cls._instance
    
    async def qualify_prospect(self, prospect_data: dict) -> dict:
        """
        Qualifie un prospect immobilier via conversation Claude
        
        Args:
            prospect_data: Données du prospect
            
        Returns:
            dict avec qualification et recommandations
        """
        try:
            prompt = self._build_qualification_prompt(prospect_data)
            
            # Exécuter en thread pool pour ne pas bloquer l'event loop
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.client.messages.create(
                    model=self.model,
                    max_tokens=settings.LLM_MAX_TOKENS,
                    system=self._get_system_prompt(),
                    messages=[
                        {"role": "user", "content": prompt}
                    ]
                )
            )
            
            result_text = response.content[0].text
            
            # Essayer de parser en JSON
            try:
                qualification_data = json.loads(result_text)
            except json.JSONDecodeError:
                qualification_data = {"raw_response": result_text}
            
            return {
                "success": True,
                "result": qualification_data,
                "model": self.model,
                "usage": {
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens
                }
            }
        except Exception as e:
            logger.error(f"❌ Erreur qualification: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "model": self.model
            }
    
    def _get_system_prompt(self) -> str:
        """Prompt système pour l'agent"""
        return """Tu es un agent immobilier marocain expert, spécialisé dans la qualification de leads immobiliers.

Ton objectif est de qualifier les prospects via des conversations naturelles en français ou darija.

Lors de la qualification, tu dois extraire:
1. Budget disponible (en MAD)
2. Localisation préférée (villes marocaines)
3. Type de bien recherché (appartement, villa, riad, terrain, etc.)
4. Critères prioritaires (chambres, surface, standing, etc.)
5. Urgence de la recherche

Réponds toujours en JSON structuré avec ces clés:
- score: nombre entre 0-100 (qualification)
- budget_min: nombre
- budget_max: nombre
- locations: liste de villes
- property_types: liste des types
- priority_criteria: liste des critères
- urgency: "haute", "moyenne", "basse"
- recommendation: texte court
- next_step: action recommandée"""
    
    def _build_qualification_prompt(self, prospect_data: dict) -> str:
        """Construit le prompt pour la qualification"""
        return f"""Qualifie ce prospect immobilier:

Informations fournies:
{json.dumps(prospect_data, ensure_ascii=False, indent=2)}

Analyse complète et fournis une réponse en JSON."""


# ============================================================================
# FUNCTIONS PUBLIQUES
# ============================================================================

async def get_qualification_agent() -> QualificationAgent:
    """Récupère l'instance singleton de l'agent"""
    return await QualificationAgent.get_instance()


# Variable globale pour stockage du singleton
agent = None


async def init_agent():
    """Initialise l'agent Claude au démarrage de l'app"""
    global agent
    try:
        agent = await get_qualification_agent()
        logger.info("✅ Agent Claude IA initialisé avec succès")
    except Exception as e:
        logger.error(f"❌ Erreur initialisation Agent: {str(e)}")
        agent = None
        raise