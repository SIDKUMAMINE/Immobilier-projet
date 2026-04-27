'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Clock, Calendar, BookOpen, TrendingUp, BarChart2, Home, Users, Share2 } from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  navy:      '#0D1F3C',
  gold:      '#C8A96E',
  goldLight: '#E2C98A',
  ivory:     '#F9F5EF',
  muted:     'rgba(226,201,138,0.55)',
  border:    'rgba(200,169,110,0.15)',
  glassDeep: 'rgba(13,31,60,0.82)',
};

// ─── Types ────────────────────────────────────────────────────────────────────
type SectionType = 'h2' | 'p' | 'highlight' | 'table' | 'list';
interface Section { type: SectionType; content?: string; rows?: { cells: string[]; head?: boolean }[]; items?: string[]; }
interface Article {
  slug: string; category: string; categoryLabel: string; featured: boolean;
  title: string; excerpt: string; date: string; readTime: string;
  author: string; tags: string[]; content: Section[];
}

// ─── Content ──────────────────────────────────────────────────────────────────
const ARTICLES: Article[] = [
  {
    slug: 'marche-immobilier-maroc-2025',
    category: 'marche', categoryLabel: 'Marché', featured: true,
    title: 'Bilan du marché immobilier au Maroc en 2025 : prix, volumes et tendances par ville',
    excerpt: 'Analyse complète des données de transaction du premier semestre 2025. Prix au m² actualisés pour Casablanca, Rabat, Marrakech et Tanger. Quels quartiers ont surperformé ? Où se trouvent encore les opportunités ?',
    date: '18 avril 2025', readTime: '10 min', author: 'Mohamed Sabbar',
    tags: ['Bilan 2025', 'Casablanca', 'Rabat', 'Marrakech', 'Prix'],
    content: [
      { type: 'p', content: `Le marché immobilier marocain aborde 2025 avec une solidité retrouvée après deux années de turbulences. La stabilisation des taux de crédit entre 5,5 et 6,2%, combinée à une demande structurelle portée par le déficit chronique de logements — estimé à 400 000 unités selon le Ministère de l'Habitat — dessine un contexte favorable pour les acheteurs patients et les investisseurs à horizon moyen terme.` },
      { type: 'p', content: `Les données de l'ANCFCC pour le T1 2025 font état d'une hausse de 4,3% du nombre de transactions immobilières par rapport au T1 2024, après une contraction de 7,8% l'année précédente. Le signal est clair : le marché reprend souffle.` },
      { type: 'h2', content: 'Casablanca : le marché prime résiste, la périphérie sous pression' },
      { type: 'p', content: `La métropole économique confirme sa dualité. Les quartiers premium — Anfa, Ain Diab, Californie, Racine — affichent des prix stables à légèrement haussiers, entre +2% et +5% sur un an. La raréfaction du foncier disponible dans ces secteurs, combinée à une demande soutenue des MRE et des cadres expatriés, soutient les valorisations.` },
      { type: 'table', rows: [
        { cells: ['Quartier', 'Prix min MAD/m²', 'Prix max MAD/m²', 'Évol. 12 mois'], head: true },
        { cells: ['Ain Diab', '20 000', '35 000', '+4,8%'] },
        { cells: ['Anfa', '18 000', '28 000', '+3,9%'] },
        { cells: ['Californie', '16 000', '24 000', '+3,1%'] },
        { cells: ['Racine', '15 000', '22 000', '+2,4%'] },
        { cells: ['Maarif', '14 000', '20 000', '+1,2%'] },
        { cells: ['Oasis / Palmier', '12 000', '18 000', '+0,6%'] },
        { cells: ['Sidi Maarouf', '10 000', '15 000', '-0,8%'] },
        { cells: ['Ain Sbaa', '7 000', '11 000', '-2,3%'] },
      ]},
      { type: 'h2', content: 'Rabat : la capitale administrative tient ses positions' },
      { type: 'p', content: `Rabat bénéficie d'une demande locative soutenue par la présence d'institutions publiques, d'ambassades et d'une population estudiantine importante. Les quartiers Agdal, Hay Riad et Souissi restent très demandés. Le prix moyen au m² dans ces secteurs s'établit entre 14 000 et 22 000 MAD, avec une progression modérée de 2 à 3%.` },
      { type: 'highlight', content: `« À Rabat, le vrai manque se situe sur les appartements de 80 à 120 m² bien situés entre 1,2 et 1,8 M MAD — ce segment est systématiquement sous-offert face à une demande de fonctionnaires et de cadres bien établis. »` },
      { type: 'h2', content: 'Marrakech : le retour des investisseurs étrangers' },
      { type: 'p', content: `La ville ocre connaît un regain spectaculaire depuis fin 2024. Les acheteurs européens sont de retour sur le marché des riads et des villas de la Palmeraie. Les prix des riads en médina ont progressé de 8 à 12% sur un an, portés par la hausse des prix de l'hébergement touristique de luxe et la rentabilité de la location saisonnière.` },
      { type: 'h2', content: 'Tanger : la nouvelle locomotive du nord' },
      { type: 'p', content: `Tanger s'affirme comme l'une des villes les plus dynamiques du Maroc en 2025. L'implantation de groupes industriels internationaux dans la région attire une main-d'œuvre qualifiée et crée une demande immobilière structurelle. Le quartier de Malabata et les nouvelles résidences de Cap Spartel enregistrent les plus fortes progressions : +7 à +9% sur un an.` },
      { type: 'h2', content: 'Perspectives pour le reste de 2025' },
      { type: 'p', content: `Notre projection : une hausse modérée de 2 à 4% sur les segments prime des grandes métropoles, une stabilisation sur les segments intermédiaires, et une légère correction persistante sur les zones périphériques mal desservies. Le marché récompense la qualité et la localisation plus que jamais.` },
    ],
  },
  {
    slug: 'roi-locatif-maroc-meilleurs-quartiers',
    category: 'investissement', categoryLabel: 'Investissement', featured: false,
    title: 'ROI locatif au Maroc : les 10 quartiers offrant les meilleurs rendements en 2025',
    excerpt: 'Rendements bruts et nets calculés pour 10 quartiers à travers le Maroc. Méthode de calcul, charges à anticiper et réalité du marché locatif pour les investisseurs.',
    date: '5 avril 2025', readTime: '8 min', author: 'Mohamed Sabbar',
    tags: ['ROI', 'Rendement locatif', 'Investissement', 'Casablanca', 'Tanger'],
    content: [
      { type: 'p', content: `L'investissement locatif reste l'une des classes d'actifs les plus plébiscitées au Maroc. Dans un contexte d'inflation persistante et de marchés financiers volatils, la pierre offre une visibilité que peu d'alternatives peuvent égaler. Mais tous les quartiers ne se valent pas — le différentiel de rendement peut dépasser 3 points entre une petite surface bien placée à Tanger et un appartement en périphérie de Casablanca.` },
      { type: 'h2', content: 'Méthodologie : rendement brut vs rendement net' },
      { type: 'p', content: `Le rendement brut se calcule simplement : (loyer annuel / prix d'achat) × 100. Mais c'est le rendement net qui compte. Il faut déduire la taxe de services communaux (10,5% de la valeur locative), les charges de copropriété (300 à 800 MAD/mois), les périodes de vacance locative (estimées à 1 mois/an) et les frais d'entretien courant (environ 1% du prix d'achat par an).` },
      { type: 'highlight', content: `Un rendement brut affiché de 7% peut se transformer en 4,5% net réel une fois toutes les charges déduites. La rigueur dans l'estimation est la première compétence de l'investisseur.` },
      { type: 'h2', content: 'Classement des 10 quartiers à meilleur rendement' },
      { type: 'table', rows: [
        { cells: ['Quartier', 'Ville', 'Prix m² moyen', 'Rendement brut', 'Rendement net est.'], head: true },
        { cells: ['Boukhalef', 'Tanger', '9 000 MAD', '8,7%', '6,2%'] },
        { cells: ['Hay Mohammadi', 'Casablanca', '7 500 MAD', '8,3%', '5,9%'] },
        { cells: ['Tilila', 'Agadir', '9 000 MAD', '8,0%', '5,7%'] },
        { cells: ['Ville Nouvelle', 'Fès', '10 500 MAD', '7,8%', '5,5%'] },
        { cells: ['Takaddoum', 'Rabat', '9 250 MAD', '7,5%', '5,3%'] },
        { cells: ['Sidi Maarouf', 'Casablanca', '12 500 MAD', '7,3%', '5,1%'] },
        { cells: ['Massira', 'Marrakech', '9 000 MAD', '7,2%', '5,0%'] },
        { cells: ['Hay Riad', 'Rabat', '16 000 MAD', '6,8%', '4,7%'] },
        { cells: ['Maarif', 'Casablanca', '17 000 MAD', '6,5%', '4,5%'] },
        { cells: ['Guéliz', 'Marrakech', '16 500 MAD', '6,2%', '4,3%'] },
      ]},
      { type: 'h2', content: 'Pourquoi Tanger et Agadir surperforment' },
      { type: 'p', content: `Boukhalef se distingue par une demande locative soutenue d'ouvriers qualifiés et de cadres travaillant dans les zones industrielles de Tanger Med et Renault. Les loyers progressent de 6 à 8% par an depuis 3 ans, portés par une offre insuffisante. Les petites surfaces (F2, F3) se louent en moins de 2 semaines sur les plateformes locales.` },
      { type: 'h2', content: 'Les pièges à éviter' },
      { type: 'list', items: [
        `Surestimer le loyer de marché : comparez avec les annonces actives sur Mubawab, Avito et Sarouty avant d'acheter.`,
        `Négliger l'état de la copropriété : des charges en hausse ou des travaux votés peuvent amputer votre rendement.`,
        `Acheter sans gardien ni ascenseur dans les zones concurrentielles : les locataires sont de plus en plus exigeants.`,
        `Sous-estimer la fiscalité : les revenus fonciers sont imposables au taux progressif de l'IR après abattement de 40%.`,
      ]},
    ],
  },
  {
    slug: 'guide-achat-immobilier-maroc',
    category: 'conseils', categoryLabel: 'Conseils', featured: false,
    title: 'Acheter un bien immobilier au Maroc en 2025 : le guide complet en 8 étapes',
    excerpt: 'De la définition du budget à la signature chez le notaire, chaque étape expliquée clairement. Documents requis, délais réalistes, frais cachés et pièges à éviter.',
    date: '28 mars 2025', readTime: '12 min', author: 'Mohamed Sabbar',
    tags: ['Guide achat', 'Notaire', 'Crédit immobilier', 'Primo-accédant'],
    content: [
      { type: 'p', content: `Acheter un bien immobilier au Maroc est l'une des décisions financières les plus importantes d'une vie. Pourtant, de nombreux acquéreurs se lancent sans connaître les étapes du processus, les délais réalistes ou les coûts réels. Ce guide vous donne une vision complète et honnête du parcours d'achat.` },
      { type: 'h2', content: 'Étape 1 — Définir votre budget global' },
      { type: 'p', content: `Le prix d'achat ne représente que 85 à 88% du coût total de l'acquisition. Il faut ajouter les frais de notaire (~1%), les droits d'enregistrement (3 à 6%), la conservation foncière (1,5% + 100 MAD), les frais d'agence (2 à 3% + TVA) et les éventuels travaux.` },
      { type: 'table', rows: [
        { cells: ['Poste de coût', 'Taux', 'Sur un bien à 1 M MAD'], head: true },
        { cells: ['Droits d\'enregistrement', '4%', '40 000 MAD'] },
        { cells: ['Conservation foncière', '1,5% + 100 MAD', '15 100 MAD'] },
        { cells: ['Honoraires notaire', '1% (min 3 000 MAD)', '10 000 MAD'] },
        { cells: ['Frais agence', '2,5% + TVA 20%', '30 000 MAD'] },
        { cells: ['Timbre, divers', 'Forfait', '2 000 MAD'] },
        { cells: ['TOTAL frais annexes', '~9,7%', '97 100 MAD'] },
      ]},
      { type: 'h2', content: 'Étape 2 — Obtenir votre accord de principe bancaire' },
      { type: 'p', content: `Avant de visiter des biens, obtenez une simulation de crédit auprès d'au moins deux banques. Les banques marocaines financent généralement jusqu'à 80% de la valeur du bien sur 25 ans max. Le taux d'endettement ne doit pas dépasser 40% de votre revenu net mensuel.` },
      { type: 'highlight', content: `Comparer CIH Bank, Banque Populaire, Attijariwafa et BMCE peut vous faire économiser 0,5 à 0,8 point de taux — soit plusieurs dizaines de milliers de dirhams sur la durée totale du crédit.` },
      { type: 'h2', content: 'Étapes 3 à 5 — Recherche, visite et promesse de vente' },
      { type: 'p', content: `Définissez vos critères non-négociables et consultez Mubawab, Avito, Sarouty et les réseaux d'agences locales. Une fois le bien trouvé, un compromis est signé avec un acompte de 10 à 20%. Ce document doit mentionner le prix définitif, les délais de signature et les conditions suspensives (notamment l'obtention du crédit).` },
      { type: 'h2', content: 'Étapes 6 à 8 — Vérifications juridiques, crédit et signature' },
      { type: 'list', items: [
        `Vérifiez le titre foncier et l'absence d'hypothèques ou de servitudes auprès de la Conservation Foncière.`,
        `L'instruction du dossier de crédit prend généralement 3 à 6 semaines. La banque procède à une expertise du bien.`,
        `La signature de l'acte authentique chez le notaire intervient en présence des deux parties. Le notaire perçoit les droits d'enregistrement et les frais de conservation.`,
        `La remise des clés intervient le jour de la signature ou dans les 48 heures suivantes.`,
      ]},
    ],
  },
  {
    slug: 'negocier-prix-immobilier-maroc',
    category: 'conseils', categoryLabel: 'Conseils', featured: false,
    title: 'Comment négocier le prix d\'un bien immobilier au Maroc : marges et stratégies',
    excerpt: 'Quelle marge de négociation attendre selon le type de bien et le quartier ? Quand négocier, comment argumenter et quelles erreurs éviter.',
    date: '14 mars 2025', readTime: '7 min', author: 'Mohamed Sabbar',
    tags: ['Négociation', 'Achat', 'Stratégie', 'Prix'],
    content: [
      { type: 'p', content: `La négociation immobilière au Maroc reste un art mal compris. Certains n'osent pas négocier par crainte d'offenser. D'autres proposent des offres irréalistes qui torpillent la relation avant même qu'elle commence. La réalité : une négociation bien préparée permet d'économiser en moyenne 5 à 12% sur le prix affiché.` },
      { type: 'h2', content: 'Marges de négociation réalistes par segment' },
      { type: 'table', rows: [
        { cells: ['Contexte de vente', 'Marge de négociation réaliste'], head: true },
        { cells: ['Neuf promoteur (avant livraison)', '2 à 5%'] },
        { cells: ['Neuf invendu après livraison', '5 à 10%'] },
        { cells: ['Ancien — bon état, quartier prime', '3 à 6%'] },
        { cells: ['Ancien — travaux nécessaires', '8 à 15%'] },
        { cells: ['Succession / propriétaire pressé', '10 à 20%'] },
        { cells: ['Bien affiché depuis +6 mois', '7 à 12%'] },
        { cells: ['Marché très tendu (Anfa, Ain Diab)', '0 à 3%'] },
      ]},
      { type: 'h2', content: 'Les 5 leviers d\'une négociation réussie' },
      { type: 'list', items: [
        `**La durée d'annonce** : plus le bien est affiché depuis longtemps, plus le vendeur est disposé à négocier.`,
        `**Les défauts objectifs** : relevez les points négatifs mesurables et chiffrez-les dans votre offre.`,
        `**La rapidité de conclusion** : proposer un acompte immédiat et une signature rapide a une valeur réelle pour un vendeur pressé.`,
        `**L'achat comptant** : éliminer l'aléa du crédit bancaire. Certains vendeurs acceptent une décote de 3 à 5%.`,
        `**Le contexte de vente** : une succession, un divorce ou un départ à l'étranger créent une pression favorable à l'acheteur.`,
      ]},
      { type: 'highlight', content: `Ne négociez jamais sans avoir visité le bien deux fois. La deuxième visite vous permettra de repérer des défauts invisibles au premier passage.` },
    ],
  },
  {
    slug: 'investir-tanger-2025',
    category: 'investissement', categoryLabel: 'Investissement', featured: false,
    title: 'Pourquoi Tanger est la ville à surveiller pour investir en 2025',
    excerpt: 'Croissance économique, infrastructures, bassin d\'emploi et prix encore abordables : Tanger présente un profil d\'investissement exceptionnel. Analyse des meilleurs quartiers.',
    date: '2 mars 2025', readTime: '6 min', author: 'Mohamed Sabbar',
    tags: ['Tanger', 'Investissement', 'Croissance', 'Quartiers'],
    content: [
      { type: 'p', content: `Il y a dix ans, Tanger était souvent décrite comme un marché secondaire. Ce temps est révolu. La ville du détroit s'est transformée en l'une des métropoles industrielles les plus actives du continent africain, et son marché immobilier reflète désormais cette réalité.` },
      { type: 'h2', content: 'Les moteurs économiques de la croissance tangéroise' },
      { type: 'p', content: `Tanger Med est désormais le premier port à conteneurs d'Afrique avec 9 millions d'EVP par an. L'usine Renault de Melloussa produit 400 000 véhicules annuellement et emploie 12 000 personnes. La zone franche accueille plus de 1 000 entreprises. Ces activités génèrent un flux continu d'emplois qualifiés et une demande immobilière structurelle.` },
      { type: 'h2', content: 'Analyse des quartiers par profil d\'investisseur' },
      { type: 'table', rows: [
        { cells: ['Quartier', 'Prix m² moyen', 'Rendement brut', 'Profil recommandé'], head: true },
        { cells: ['Malabata', '16 000 MAD', '5,8%', 'Cadres, long terme'] },
        { cells: ['Cap Spartel', '15 000 MAD', '6,1%', 'Résidence secondaire'] },
        { cells: ['Boukhalef', '8 500 MAD', '8,7%', 'Locatif ouvriers qualifiés'] },
        { cells: ['Mesnana', '9 000 MAD', '7,9%', 'Locatif, primo-accédant'] },
        { cells: ['Iberia', '14 000 MAD', '6,0%', 'Résidentiel premium'] },
      ]},
      { type: 'highlight', content: `Boukhalef et Mesnana offrent les meilleurs rendements bruts de Tanger — mais aussi les meilleures perspectives de valorisation à horizon 5-7 ans, portées par la densification progressive de ces secteurs.` },
      { type: 'h2', content: 'Ce que les investisseurs casablancais ont compris' },
      { type: 'p', content: `De nombreux investisseurs de Casablanca diversifient leur portefeuille sur Tanger depuis 2022. Leur logique : acquérir des appartements de 60 à 90 m² dans des résidences sécurisées à Boukhalef entre 700 000 et 1 200 000 MAD, les louer à des cadres de l'industrie pour 5 500 à 8 000 MAD/mois, et bénéficier d'une double création de valeur.` },
    ],
  },
  {
    slug: 'riad-marrakech-location-saisonniere',
    category: 'investissement', categoryLabel: 'Investissement', featured: false,
    title: 'Investir dans un riad à Marrakech : réalité et rentabilité de la location saisonnière',
    excerpt: 'Les riads de Marrakech offrent des rendements attractifs via les plateformes de luxe — mais les contraintes sont nombreuses. Analyse honnête du modèle.',
    date: '18 février 2025', readTime: '8 min', author: 'Mohamed Sabbar',
    tags: ['Riad', 'Marrakech', 'Location saisonnière', 'Airbnb'],
    content: [
      { type: 'p', content: `Le riad de Marrakech fait rêver. Acheter un joyau architectural en médina, le restaurer et le louer à des touristes du monde entier semble une formule gagnante. Et elle peut l'être — mais à condition d'entrer dans cette aventure avec les yeux grands ouverts.` },
      { type: 'h2', content: 'Le potentiel : des revenus exceptionnels en haute saison' },
      { type: 'p', content: `Un riad bien restauré peut générer entre 2 000 et 6 000 MAD par nuit en haute saison. Sur un riad de 6 chambres, cela représente un chiffre d'affaires potentiel de 600 000 à 1 200 000 MAD par an, pour un taux d'occupation autour de 65 à 75% annuel.` },
      { type: 'table', rows: [
        { cells: ['Saison', 'Taux d\'occupation', 'Prix nuit moyen (6 ch.)', 'CA mensuel estimé'], head: true },
        { cells: ['Haute (oct-nov, mars-avr)', '85%', '4 500 MAD', '114 750 MAD'] },
        { cells: ['Moyenne (jan-fév, mai, sept)', '65%', '3 200 MAD', '62 400 MAD'] },
        { cells: ['Basse (juin-août)', '45%', '2 500 MAD', '33 750 MAD'] },
        { cells: ['Fêtes (Noël, Aïd)', '95%', '5 500 MAD', '156 750 MAD'] },
      ]},
      { type: 'h2', content: 'Les contraintes réelles à ne pas minimiser' },
      { type: 'list', items: [
        `**Le coût de restauration** : entre 4 000 et 8 000 MAD/m² selon le niveau de finition. Pour un riad de 300 m², comptez 1,2 à 2,4 M MAD de travaux.`,
        `**La gestion opérationnelle** : personnel permanent (gardien, ménage, petit-déjeuner, conciergerie) absorbe 25 à 35% du CA.`,
        `**La saisonnalité extrême** : les mois de juin à août sont très creux. À anticiper dans le plan de financement.`,
        `**L'entretien continu** : la zellij, le tadelakt et le bois sculpté demandent un entretien régulier et coûteux.`,
      ]},
      { type: 'highlight', content: `Le rendement net réel d'un riad bien géré se situe entre 5 et 8% — comparable à un appartement classique mais avec une mise de départ 3 à 5 fois plus élevée. La vraie plus-value est patrimoniale, pas uniquement financière.` },
    ],
  },
  {
    slug: 'credit-immobilier-maroc-2025',
    category: 'conseils', categoryLabel: 'Conseils', featured: false,
    title: 'Crédit immobilier au Maroc en 2025 : taux, conditions et meilleures banques',
    excerpt: 'Comparatif des taux pratiqués par les principales banques marocaines, conditions d\'éligibilité, documents requis et stratégies pour obtenir les meilleures conditions.',
    date: '5 février 2025', readTime: '9 min', author: 'Mohamed Sabbar',
    tags: ['Crédit immobilier', 'Banques', 'Taux', 'Financement'],
    content: [
      { type: 'p', content: `Après deux années de hausse des taux qui ont pesé sur la capacité d'emprunt des ménages, 2025 marque un tournant. Bank Al-Maghrib a abaissé son taux directeur à 2,75% en décembre 2024, et les banques commerciales ont progressivement répercuté cette détente sur leurs grilles tarifaires.` },
      { type: 'h2', content: 'Comparatif des taux par banque — T1 2025' },
      { type: 'table', rows: [
        { cells: ['Banque', 'Taux fixe min', 'Taux variable min', 'Durée max', 'Quotité max'], head: true },
        { cells: ['CIH Bank', '5,50%', '5,20%', '25 ans', '100%'] },
        { cells: ['Banque Populaire', '5,70%', '5,35%', '25 ans', '100%'] },
        { cells: ['Attijariwafa Bank', '5,65%', 'NC', '25 ans', '80%'] },
        { cells: ['BMCE Bank of Africa', '5,75%', '5,40%', '25 ans', '80%'] },
        { cells: ['Société Générale Maroc', '5,80%', '5,50%', '20 ans', '80%'] },
        { cells: ['CFG Bank', '5,60%', 'NC', '25 ans', '80%'] },
      ]},
      { type: 'p', content: `Les taux affichés sont des minimums indicatifs. Le taux réel dépend du profil de l'emprunteur, du type de bien et de sa localisation. Un écart de 0,3 point sur 20 ans représente environ 60 000 MAD sur un crédit de 1 M MAD.` },
      { type: 'h2', content: 'Conditions d\'éligibilité et documents requis' },
      { type: 'list', items: [
        `Être salarié en CDI depuis au moins 6 mois ou professionnel libéral avec 2 ans de bilans.`,
        `Taux d'endettement ne dépassant pas 40% des revenus nets (toutes dettes confondues).`,
        `Apport personnel minimum : 10 à 20% selon la banque et le type de bien.`,
        `Documents : CIN, bulletins de paie des 3 derniers mois, relevés bancaires des 6 derniers mois, compromis de vente signé.`,
      ]},
      { type: 'highlight', content: `Le programme "Damane Assakane" de la Caisse Centrale de Garantie permet aux primo-accédants éligibles d'accéder à des crédits à taux préférentiel et sans apport sur des logements économiques et sociaux.` },
      { type: 'h2', content: 'Stratégies pour obtenir les meilleures conditions' },
      { type: 'p', content: `Domiciliez vos revenus dans la banque visée depuis au moins 12 mois avant votre demande. Réduisez vos crédits à la consommation en cours — chaque 500 MAD de mensualité réduit votre capacité d'emprunt d'environ 125 000 MAD. Présentez un dossier complet dès le premier rendez-vous. N'hésitez pas à faire appel à un courtier en crédit — leurs honoraires (1 à 1,5%) sont souvent compensés par le gain de taux obtenu.` },
    ],
  },
  {
    slug: 'commercialisation-promoteurs-maroc-2025',
    category: 'promoteurs', categoryLabel: 'Promoteurs', featured: false,
    title: 'Commercialisation immobilière : ce que les promoteurs doivent changer en 2025',
    excerpt: 'Les attentes des acheteurs ont radicalement changé. Photos professionnelles, présence digitale et transparence sur les délais sont des impératifs, pas des options.',
    date: '22 janvier 2025', readTime: '7 min', author: 'Mohamed Sabbar',
    tags: ['Promoteurs', 'Commercialisation', 'Marketing digital', 'Vente VEFA'],
    content: [
      { type: 'p', content: `Les promoteurs qui continuent de vendre comme en 2015 — brochures imprimées, visites de chantier sans préparation, communication opaque sur les délais — perdent des ventes face à des concurrents mieux organisés. En 2025, l'acheteur est informé, exigeant et compare systématiquement.` },
      { type: 'h2', content: 'Ce que les acheteurs attendent désormais' },
      { type: 'list', items: [
        `Des visuels 3D photoréalistes ou des visites virtuelles 360° disponibles en ligne avant la première visite physique.`,
        `Des plans clairs avec surfaces exactes et matériaux de finition détaillés.`,
        `Une transparence totale sur le calendrier de livraison et les pénalités de retard contractuelles.`,
        `Un interlocuteur commercial dédié et réactif (réponse en moins de 4 heures sur WhatsApp).`,
        `Des références vérifiables : photos de projets livrés, avis d'acquéreurs précédents.`,
      ]},
      { type: 'highlight', content: `Un projet avec une commercialisation digitale complète (photos pro, campagnes Meta, présence Mubawab premium, vidéo cinématique) se vend en moyenne 40% plus vite. Le coût de cette commercialisation est inférieur à 1% du chiffre d'affaires du programme.` },
      { type: 'h2', content: 'Le modèle de commercialisation exclusive' },
      { type: 'p', content: `Confier la commercialisation exclusive d'un programme à un partenaire spécialisé présente plusieurs avantages : unicité du message commercial, cohérence de la communication, investissement plus fort du partenaire et reporting mensuel centralisé. Les conditions de succès : objectifs de vente trimestriels contractuels, communication transparente sur l'avancement du chantier.` },
    ],
  },
];

const CATEGORIES = [
  { id: 'all',            label: 'Tous',          Icon: BookOpen   },
  { id: 'marche',         label: 'Marché',         Icon: TrendingUp },
  { id: 'investissement', label: 'Investissement', Icon: BarChart2  },
  { id: 'conseils',       label: 'Conseils',       Icon: Home       },
  { id: 'promoteurs',     label: 'Promoteurs',     Icon: Users      },
];

// ─── Section renderers ────────────────────────────────────────────────────────

function RenderSection({ s, idx }: { s: Section; idx: number }) {
  if (s.type === 'h2') return (
    <h2 key={idx} style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'clamp(20px,2.5vw,26px)', fontWeight:300, color:T.ivory, lineHeight:1.2, margin:'48px 0 16px', paddingBottom:'12px', borderBottom:`1px solid ${T.border}` }}>
      {s.content}
    </h2>
  );

  if (s.type === 'p') {
    const parts = (s.content ?? '').split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={idx} style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'15px', color:'rgba(226,201,138,0.58)', lineHeight:1.85, marginBottom:'18px' }}>
        {parts.map((p, j) => p.startsWith('**') && p.endsWith('**')
          ? <strong key={j} style={{ color:T.goldLight, fontWeight:500 }}>{p.slice(2,-2)}</strong>
          : p
        )}
      </p>
    );
  }

  if (s.type === 'highlight') return (
    <div key={idx} style={{ background:'rgba(200,169,110,0.06)', border:`1px solid rgba(200,169,110,0.18)`, borderLeft:`3px solid ${T.gold}`, borderRadius:'0 12px 12px 0', padding:'20px 24px', margin:'28px 0' }}>
      <p style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'18px', fontWeight:300, fontStyle:'italic', color:T.goldLight, lineHeight:1.65, margin:0 }}>{s.content}</p>
    </div>
  );

  if (s.type === 'table') return (
    <div key={idx} style={{ overflowX:'auto', margin:'24px 0', borderRadius:'12px', border:`1px solid ${T.border}` }}>
      <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'420px' }}>
        <tbody>
          {(s.rows ?? []).map((row, i) => (
            <tr key={i} style={{ borderBottom: i < (s.rows?.length ?? 0) - 1 ? `1px solid rgba(200,169,110,0.08)` : 'none', background: row.head ? 'rgba(200,169,110,0.07)' : 'transparent' }}>
              {row.cells.map((cell, j) => row.head
                ? <th key={j} style={{ padding:'11px 14px', textAlign:'left', fontSize:'10px', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(200,169,110,0.5)', fontFamily:"'DM Sans', system-ui, sans-serif" }}>{cell}</th>
                : <td key={j} style={{ padding:'12px 14px', fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'13px', fontWeight: j===0?500:400, color: j===0 ? T.ivory : cell.startsWith('+') ? '#4ade80' : cell.startsWith('-') ? '#f87171' : 'rgba(226,201,138,0.52)' }}>{cell}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (s.type === 'list') return (
    <ul key={idx} style={{ margin:'16px 0 20px', paddingLeft:0, listStyle:'none' }}>
      {(s.items ?? []).map((item, i) => {
        const parts = item.split(/(\*\*[^*]+\*\*)/g);
        return (
          <li key={i} style={{ display:'flex', gap:'12px', alignItems:'flex-start', marginBottom:'12px' }}>
            <span style={{ width:'20px', height:'20px', borderRadius:'50%', flexShrink:0, background:'rgba(200,169,110,0.12)', border:`1px solid rgba(200,169,110,0.22)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', color:T.gold, fontFamily:"'Cormorant Garamond', Georgia, serif", marginTop:'2px' }}>{i+1}</span>
            <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'14px', color:'rgba(226,201,138,0.55)', lineHeight:1.75, margin:0, flex:1 }}>
              {parts.map((p, j) => p.startsWith('**') && p.endsWith('**')
                ? <strong key={j} style={{ color:T.goldLight, fontWeight:500 }}>{p.slice(2,-2)}</strong>
                : p
              )}
            </p>
          </li>
        );
      })}
    </ul>
  );

  return null;
}

// ─── Small shared components ──────────────────────────────────────────────────

function Badge({ label }: { label: string }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 9px', borderRadius:'100px', fontSize:'10px', fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', fontFamily:"'DM Sans', system-ui, sans-serif", background:'rgba(200,169,110,0.10)', border:`1px solid rgba(200,169,110,0.22)`, color:T.gold }}>
      {label}
    </span>
  );
}

function Meta({ readTime, date }: { readTime: string; date: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
      <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', color:'rgba(200,169,110,0.38)', fontFamily:"'DM Sans', system-ui, sans-serif" }}>
        <Clock size={11}/> {readTime}
      </span>
      <span style={{ width:'3px', height:'3px', borderRadius:'50%', background:'rgba(200,169,110,0.2)', display:'inline-block' }}/>
      <span style={{ fontSize:'12px', color:'rgba(200,169,110,0.3)', fontFamily:"'DM Sans', system-ui, sans-serif" }}>{date}</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const featured = ARTICLES.find(a => a.featured)!;
  const gridArticles = activeCategory === 'all'
    ? ARTICLES.filter(a => !a.featured)
    : ARTICLES.filter(a => a.category === activeCategory);

  const openArticle = openSlug ? ARTICLES.find(a => a.slug === openSlug) : null;
  const toc = openArticle?.content.filter(s => s.type === 'h2').map(s => s.content!) ?? [];
  const related = openArticle
    ? ARTICLES.filter(a => a.slug !== openSlug).sort((a, b) => (a.category === openArticle.category ? -1 : 0) - (b.category === openArticle.category ? -1 : 0)).slice(0, 3)
    : [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .fu{animation:fadeUp 0.6s ease both}
        .f1{animation-delay:.05s}.f2{animation-delay:.15s}.f3{animation-delay:.25s}.f4{animation-delay:.35s}
        .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .rg{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .al{display:grid;grid-template-columns:1fr 268px;gap:56px;align-items:start}
        @media(max-width:1024px){.al{grid-template-columns:1fr}.sb{display:none!important}}
        @media(max-width:768px){.g3{grid-template-columns:1fr}.rg{grid-template-columns:1fr}.ht{font-size:32px!important}.fp{padding:24px 18px!important}}
        @media(max-width:640px){.g3{grid-template-columns:1fr}.cats{flex-wrap:wrap}.sh{display:none!important}}
      `}</style>

      <main style={{ minHeight:'100vh', background:`linear-gradient(160deg, ${T.navy} 0%, #091629 45%, #050D1A 100%)`, position:'relative', overflow:'hidden' }}>

        {/* Glows */}
        <div style={{ position:'fixed', top:'-160px', right:'-80px', width:'520px', height:'520px', borderRadius:'50%', background:'radial-gradient(circle,rgba(200,169,110,0.06) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }}/>
        <div style={{ position:'fixed', bottom:'-100px', left:'-60px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(200,169,110,0.03) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }}/>

        {/* ════════════════════════════════════════════════════════════
            VIEW A — ARTICLE DETAIL
        ═══════════════════════════════════════════════════════════════ */}
        {openArticle ? (
          <>
            {/* Breadcrumb */}
            <div style={{ padding:'16px 5%', borderBottom:`1px solid ${T.border}`, position:'relative', zIndex:1 }}>
              <div style={{ maxWidth:'1200px', margin:'0 auto', display:'flex', alignItems:'center', gap:'8px' }}>
                <button onClick={() => setOpenSlug(null)} style={{ display:'inline-flex', alignItems:'center', gap:'6px', color:T.gold, background:'transparent', border:'none', cursor:'pointer', fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'14px', fontWeight:500, padding:0, transition:'gap 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.gap='10px')}
                  onMouseLeave={e => (e.currentTarget.style.gap='6px')}
                >
                  <ArrowLeft size={14}/> Blog
                </button>
                <span style={{ color:'rgba(200,169,110,0.25)' }}>/</span>
                <span style={{ fontSize:'13px', color:'rgba(200,169,110,0.38)', fontFamily:"'DM Sans', system-ui, sans-serif" }}>{openArticle.categoryLabel}</span>
              </div>
            </div>

            {/* Article hero */}
            <section style={{ padding:'56px 5% 48px', position:'relative', zIndex:1 }}>
              <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
                <div className="fu f1" style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', flexWrap:'wrap' }}>
                  <Badge label={openArticle.categoryLabel}/>
                  <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', color:'rgba(200,169,110,0.38)', fontFamily:"'DM Sans', system-ui, sans-serif" }}><Clock size={11}/> {openArticle.readTime}</span>
                  <span style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', color:'rgba(200,169,110,0.32)', fontFamily:"'DM Sans', system-ui, sans-serif" }}><Calendar size={11}/> {openArticle.date}</span>
                </div>
                <h1 className="fu f2 ht" style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'clamp(26px,4vw,46px)', fontWeight:300, color:T.ivory, lineHeight:1.15, maxWidth:'800px', marginBottom:'28px' }}>
                  {openArticle.title}
                </h1>
                <div className="fu f3" style={{ display:'flex', alignItems:'center', gap:'14px', justifyContent:'space-between', flexWrap:'wrap' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'rgba(200,169,110,0.13)', border:`1px solid rgba(200,169,110,0.28)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'14px', color:T.gold, fontWeight:300, flexShrink:0 }}>MS</div>
                    <div>
                      <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'13px', fontWeight:500, color:T.goldLight }}>Mohamed Sabbar</p>
                      <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'11px', color:'rgba(200,169,110,0.38)' }}>Expert immobilier · LANDMARK ESTATE</p>
                    </div>
                  </div>
                  <button style={{ display:'flex', alignItems:'center', gap:'6px', padding:'7px 13px', borderRadius:'8px', border:`1px solid ${T.border}`, background:'transparent', color:T.muted, fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'12px', cursor:'pointer', transition:'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=T.gold; e.currentTarget.style.color=T.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}
                  >
                    <Share2 size={12}/> Partager
                  </button>
                </div>
              </div>
            </section>

            <div style={{ width:'100%', height:'1px', background:`linear-gradient(90deg,transparent,rgba(200,169,110,0.18),transparent)` }}/>

            {/* Article body + sidebar */}
            <section style={{ padding:'48px 5% 72px', position:'relative', zIndex:1 }}>
              <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
                <div className="al">
                  <article>
                    {/* Lead */}
                    <p style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'19px', fontWeight:300, fontStyle:'italic', color:T.muted, lineHeight:1.7, marginBottom:'32px', paddingBottom:'28px', borderBottom:`1px solid ${T.border}` }}>
                      {openArticle.excerpt}
                    </p>
                    {/* Content */}
                    {openArticle.content.map((s, i) => <RenderSection key={i} s={s} idx={i}/>)}
                    {/* Tags */}
                    <div style={{ display:'flex', gap:'7px', flexWrap:'wrap', marginTop:'48px', paddingTop:'24px', borderTop:`1px solid ${T.border}` }}>
                      {openArticle.tags.map(tag => (
                        <span key={tag} style={{ padding:'5px 11px', borderRadius:'7px', fontSize:'11px', fontFamily:"'DM Sans', system-ui, sans-serif", background:'rgba(200,169,110,0.06)', border:`1px solid rgba(200,169,110,0.13)`, color:'rgba(200,169,110,0.42)' }}>#{tag}</span>
                      ))}
                    </div>
                    {/* CTA */}
                    <div style={{ marginTop:'44px', padding:'28px 32px', background:'rgba(200,169,110,0.05)', border:`1px solid rgba(200,169,110,0.17)`, borderRadius:'16px' }}>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:'20px', flexWrap:'wrap' }}>
                        <div style={{ flex:1, minWidth:'160px' }}>
                          <p style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'20px', fontWeight:300, color:T.ivory, marginBottom:'6px' }}>Une question sur votre projet ?</p>
                          <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'13px', color:T.muted, lineHeight:1.7 }}>Mohamed Sabbar vous apporte une analyse gratuite et personnalisée de votre situation immobilière.</p>
                        </div>
                        <Link href="/contact" style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'12px 18px', borderRadius:'9px', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, color:T.navy, textDecoration:'none', fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'13px', fontWeight:600, whiteSpace:'nowrap', flexShrink:0, alignSelf:'center', transition:'all 0.25s' }}
                          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 28px rgba(200,169,110,0.25)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
                        >
                          Consultation gratuite <ArrowRight size={13}/>
                        </Link>
                      </div>
                    </div>
                  </article>

                  {/* Sidebar */}
                  <aside className="sb" style={{ position:'sticky', top:'80px', display:'flex', flexDirection:'column', gap:'16px' }}>
                    {/* TOC */}
                    <div style={{ background:T.glassDeep, border:`1px solid ${T.border}`, borderRadius:'13px', padding:'20px' }}>
                      <p style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'16px', fontWeight:400, color:T.ivory, marginBottom:'14px', display:'flex', alignItems:'center', gap:'7px' }}><BookOpen size={14} style={{ color:T.gold }}/> Sommaire</p>
                      {toc.map((item, i) => (
                        <div key={i} style={{ display:'flex', gap:'9px', alignItems:'baseline', marginBottom:'9px' }}>
                          <span style={{ fontSize:'11px', color:T.gold, fontFamily:"'Cormorant Garamond', Georgia, serif", flexShrink:0, minWidth:'16px' }}>{String(i+1).padStart(2,'0')}</span>
                          <span style={{ fontSize:'12px', color:'rgba(226,201,138,0.42)', fontFamily:"'DM Sans', system-ui, sans-serif", lineHeight:1.4 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    {/* Author */}
                    <div style={{ background:T.glassDeep, border:`1px solid ${T.border}`, borderRadius:'13px', padding:'20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'11px', marginBottom:'12px' }}>
                        <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:'rgba(200,169,110,0.12)', border:`1px solid rgba(200,169,110,0.26)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'14px', color:T.gold, fontWeight:300, flexShrink:0 }}>MS</div>
                        <div>
                          <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'13px', fontWeight:500, color:T.ivory }}>Mohamed Sabbar</p>
                          <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'11px', color:'rgba(200,169,110,0.36)' }}>Expert immobilier</p>
                        </div>
                      </div>
                      <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'12px', color:'rgba(226,201,138,0.38)', lineHeight:1.65 }}>Spécialiste du marché casablancais avec 10+ ans d'expérience en transaction et commercialisation.</p>
                    </div>
                    {/* Share */}
                    <div style={{ background:T.glassDeep, border:`1px solid ${T.border}`, borderRadius:'13px', padding:'16px 20px' }}>
                      <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'10px', fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(200,169,110,0.33)', marginBottom:'11px' }}>Partager</p>
                      <div style={{ display:'flex', gap:'7px' }}>
                        {['LinkedIn','WhatsApp','Email'].map(s => (
                          <button key={s} style={{ flex:1, padding:'7px', borderRadius:'7px', border:`1px solid ${T.border}`, background:'transparent', color:'rgba(200,169,110,0.42)', fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'11px', cursor:'pointer', transition:'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor=T.gold; e.currentTarget.style.color=T.gold; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color='rgba(200,169,110,0.42)'; }}
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </section>

            {/* Related */}
            <section style={{ borderTop:`1px solid ${T.border}`, padding:'52px 5%', position:'relative', zIndex:1 }}>
              <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px' }}>
                  <h2 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'21px', fontWeight:300, color:T.ivory, whiteSpace:'nowrap' }}>Articles similaires</h2>
                  <div style={{ flex:1, height:'1px', background:T.border }}/>
                  <button onClick={() => setOpenSlug(null)} style={{ display:'flex', alignItems:'center', gap:'5px', color:T.gold, background:'transparent', border:'none', cursor:'pointer', fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'13px', fontWeight:500, whiteSpace:'nowrap', padding:0, transition:'gap 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.gap='9px')}
                    onMouseLeave={e => (e.currentTarget.style.gap='5px')}
                  >
                    Voir tout <ArrowRight size={12}/>
                  </button>
                </div>
                <div className="rg">
                  {related.map(a => (
                    <div key={a.slug} onClick={() => setOpenSlug(a.slug)} style={{ background:T.glassDeep, border:`1px solid ${T.border}`, borderRadius:'13px', padding:'22px', cursor:'pointer', transition:'all 0.3s', display:'flex', flexDirection:'column' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(200,169,110,0.35)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform='none'; }}
                    >
                      <div style={{ width:'28px', height:'1px', background:`linear-gradient(90deg,${T.gold},transparent)`, marginBottom:'13px' }}/>
                      <Badge label={a.categoryLabel}/>
                      <h3 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'17px', fontWeight:300, color:T.ivory, lineHeight:1.3, margin:'11px 0 auto' }}>{a.title}</h3>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'14px' }}>
                        <span style={{ fontSize:'11px', color:'rgba(200,169,110,0.3)', fontFamily:"'DM Sans', system-ui, sans-serif", display:'flex', alignItems:'center', gap:'4px' }}><Clock size={10}/> {a.readTime}</span>
                        <ArrowRight size={13} style={{ color:T.gold }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>

        ) : (

        /* ════════════════════════════════════════════════════════════
            VIEW B — BLOG INDEX
        ═══════════════════════════════════════════════════════════════ */
        <>
          {/* Hero */}
          <section style={{ padding:'88px 5% 60px', position:'relative', zIndex:1, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
              <div className="fu f1" style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'26px' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:T.gold, display:'inline-block', animation:'pulse 2s infinite' }}/>
                <span style={{ fontSize:'11px', fontWeight:500, letterSpacing:'0.15em', textTransform:'uppercase', color:T.gold, fontFamily:"'DM Sans', system-ui, sans-serif" }}>
                  Analyses · Conseils · Marché immobilier marocain
                </span>
              </div>
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'36px', flexWrap:'wrap' }}>
                <div>
                  <h1 className="fu f2 ht" style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'clamp(40px,5.5vw,66px)', fontWeight:300, color:T.ivory, lineHeight:1.05, marginBottom:'16px' }}>
                    Le Blog<br/><span style={{ color:T.gold, fontStyle:'italic' }}>LANDMARK ESTATE</span>
                  </h1>
                  <p className="fu f3" style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'15px', color:T.muted, lineHeight:1.8, maxWidth:'480px' }}>
                    Analyses de marché, guides d'achat et stratégies d'investissement pour naviguer l'immobilier marocain avec clarté.
                  </p>
                </div>
                <div className="fu f4 sh" style={{ display:'flex', gap:'32px', flexShrink:0 }}>
                  {[{ val:String(ARTICLES.length), label:'Articles'}, { val:'4', label:'Catégories'}, { val:'Hebdo', label:'Fréquence'}].map(s => (
                    <div key={s.label} style={{ textAlign:'center' }}>
                      <p style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'32px', fontWeight:300, color:T.gold, lineHeight:1 }}>{s.val}</p>
                      <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'10px', color:'rgba(200,169,110,0.35)', letterSpacing:'0.08em', textTransform:'uppercase', marginTop:'4px' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Category filter */}
          <div style={{ padding:'28px 5% 0', position:'relative', zIndex:1 }}>
            <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
              <div className="cats" style={{ display:'flex', gap:'8px' }}>
                {CATEGORIES.map(({ id, label, Icon }) => {
                  const active = activeCategory === id;
                  return (
                    <button key={id} onClick={() => setActiveCategory(id)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'100px', cursor:'pointer', fontSize:'13px', fontWeight:500, fontFamily:"'DM Sans', system-ui, sans-serif", transition:'all 0.2s ease', background: active ? T.gold : 'rgba(13,31,60,0.6)', border:`1px solid ${active ? T.gold : T.border}`, color: active ? T.navy : T.muted }}>
                      <Icon size={12}/>{label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Featured */}
          {activeCategory === 'all' && (
            <section style={{ padding:'28px 5% 0', position:'relative', zIndex:1 }}>
              <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
                <div onClick={() => setOpenSlug(featured.slug)} style={{ background:T.glassDeep, border:`1px solid ${T.border}`, borderRadius:'18px', padding:'40px 44px', cursor:'pointer', transition:'all 0.3s', position:'relative', overflow:'hidden' }}
                  className="fp"
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(200,169,110,0.4)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 24px 60px rgba(0,0,0,0.28)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
                >
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg,${T.gold},rgba(200,169,110,0.15),transparent)` }}/>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
                    <span style={{ padding:'3px 10px', borderRadius:'100px', fontSize:'10px', fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', fontFamily:"'DM Sans', system-ui, sans-serif", background:T.gold, color:T.navy }}>À la une</span>
                    <Badge label={featured.categoryLabel}/>
                    <Meta readTime={featured.readTime} date={featured.date}/>
                  </div>
                  <h2 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'clamp(22px,3vw,34px)', fontWeight:300, color:T.ivory, lineHeight:1.2, marginBottom:'14px', maxWidth:'680px' }}>{featured.title}</h2>
                  <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'15px', color:T.muted, lineHeight:1.75, maxWidth:'620px', marginBottom:'24px' }}>{featured.excerpt}</p>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'14px' }}>
                    <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                      {featured.tags.slice(0,4).map(tag => <span key={tag} style={{ padding:'3px 9px', borderRadius:'6px', fontSize:'11px', fontFamily:"'DM Sans', system-ui, sans-serif", background:'rgba(200,169,110,0.06)', border:`1px solid rgba(200,169,110,0.12)`, color:'rgba(200,169,110,0.4)' }}>#{tag}</span>)}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'5px', color:T.gold, fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'13px', fontWeight:500 }}>Lire l'article <ArrowRight size={14}/></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Grid */}
          <section style={{ padding:'28px 5% 72px', position:'relative', zIndex:1 }}>
            <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px' }}>
                <h2 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'20px', fontWeight:300, color:T.ivory, whiteSpace:'nowrap' }}>
                  {activeCategory === 'all' ? 'Tous les articles' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                </h2>
                <div style={{ flex:1, height:'1px', background:T.border }}/>
                <span style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'12px', color:'rgba(200,169,110,0.32)', whiteSpace:'nowrap' }}>{gridArticles.length} article{gridArticles.length>1?'s':''}</span>
              </div>

              {gridArticles.length === 0 ? (
                <p style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'22px', fontWeight:300, color:T.muted, textAlign:'center', padding:'48px 0' }}>Aucun article dans cette catégorie.</p>
              ) : (
                <div className="g3">
                  {gridArticles.map((a, i) => (
                    <div key={a.slug} onClick={() => setOpenSlug(a.slug)} style={{ background:T.glassDeep, border:`1px solid ${T.border}`, borderRadius:'14px', padding:'26px', cursor:'pointer', transition:'all 0.3s', height:'100%', display:'flex', flexDirection:'column' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(200,169,110,0.38)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 18px 44px rgba(0,0,0,0.22)'; e.currentTarget.style.background='rgba(13,31,60,0.92)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.background=T.glassDeep; }}
                    >
                      <div style={{ width:'32px', height:'1px', background:`linear-gradient(90deg,${T.gold},transparent)`, marginBottom:'16px' }}/>
                      <Badge label={a.categoryLabel}/>
                      <h3 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'20px', fontWeight:300, color:T.ivory, lineHeight:1.3, margin:'13px 0 11px', flex:1 }}>{a.title}</h3>
                      <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'13px', color:'rgba(226,201,138,0.38)', lineHeight:1.7, marginBottom:'18px', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{a.excerpt}</p>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
                        <Meta readTime={a.readTime} date={a.date}/>
                        <ArrowRight size={13} style={{ color:T.gold, flexShrink:0 }}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Newsletter */}
          <section style={{ borderTop:`1px solid ${T.border}`, padding:'64px 5%', position:'relative', zIndex:1 }}>
            <div style={{ maxWidth:'520px', margin:'0 auto', textAlign:'center' }}>
              <div style={{ width:'32px', height:'1px', background:T.gold, margin:'0 auto 24px' }}/>
              <h2 style={{ fontFamily:"'Cormorant Garamond', Georgia, serif", fontSize:'clamp(24px,3vw,36px)', fontWeight:300, color:T.ivory, marginBottom:'12px', lineHeight:1.2 }}>Restez informé du marché</h2>
              <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'14px', color:T.muted, lineHeight:1.8, marginBottom:'28px' }}>Analyses hebdomadaires, alertes prix et guides pratiques. Uniquement de la valeur, jamais de spam.</p>
              <div style={{ display:'flex', gap:'9px', maxWidth:'420px', margin:'0 auto' }}>
                <input type="email" placeholder="votre@email.com" style={{ flex:1, padding:'12px 15px', borderRadius:'9px', background:'rgba(13,31,60,0.6)', border:`1px solid ${T.border}`, color:T.ivory, fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'14px', outline:'none' }}
                  onFocus={e => e.currentTarget.style.borderColor='rgba(200,169,110,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor=T.border}
                />
                <button style={{ padding:'12px 18px', borderRadius:'9px', border:'none', cursor:'pointer', background:`linear-gradient(135deg,${T.gold},${T.goldLight})`, color:T.navy, fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'13px', fontWeight:600, whiteSpace:'nowrap', transition:'all 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(200,169,110,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
                >S'abonner</button>
              </div>
              <p style={{ marginTop:'10px', fontSize:'11px', color:'rgba(200,169,110,0.22)', fontFamily:"'DM Sans', system-ui, sans-serif" }}>Désabonnement en un clic · Données confidentielles</p>
            </div>
          </section>
        </>
        )}

        {/* Footer */}
        <div style={{ borderTop:`1px solid ${T.border}`, padding:'16px 5%', textAlign:'center' }}>
          <p style={{ fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:'12px', color:'rgba(200,169,110,0.2)' }}>
            © {new Date().getFullYear()} LANDMARK ESTATE · Blog Immobilier Maroc
          </p>
        </div>

      </main>
    </>
  );
}