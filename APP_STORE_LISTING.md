# Fiche App Store — brouillon

À copier dans App Store Connect (Phase 5 de la feuille de route). Tout ici est un point de départ — ajustez librement.

## Nom
Hic Sunt — Cartographe de voyage

## Sous-titre (30 caractères max)
Itinéraires sur-mesure, IA

## Catégorie
Voyage (principale) · Style de vie (secondaire, optionnel)

## Description

```
Hic Sunt compose votre prochain voyage sur-mesure — au-delà des sentiers battus.

Décrivez votre envie en quelques mots : une destination, une occasion, un
rythme de voyage. Le cartographe compose un itinéraire complet — étapes,
hébergements, restaurants, pépites cachées — pensé pour éviter le circuit
touristique de masse et révéler l'authenticité de chaque lieu.

CE QUE HIC SUNT FAIT POUR VOUS
— Un itinéraire jour par jour, cohérent géographiquement, jamais improvisé
— Des hébergements et restaurants vérifiés, jamais inventés
— Des pépites cachées trouvées dans de vrais avis de voyageurs
— Un budget réaliste, ajusté au coût de vie de la destination
— Un Atlas personnel qui se dévoile à mesure que vous voyagez

Pensé pour les lunes de miel, les EVJF/EVG, les voyages en famille, entre
amis, en solo — chaque itinéraire s'adapte à l'occasion.

Hic Sunt. Beyond the Known.
```

## Mots-clés (100 caractères max, séparés par virgules)
```
voyage,itinéraire,vacances,voyage sur-mesure,cartographe,city trip,road trip,découverte,séjour
```

## URL de support
`https://hic-suntapp.vercel.app` *(ou une adresse dédiée si vous en créez une)*

## URL de politique de confidentialité
`https://hic-suntapp.vercel.app/privacy.html`

## Notes de version (première soumission)
```
Première version de Hic Sunt sur l'App Store.
```

## Compte de démonstration (pour le reviewer Apple)
Compte fixe, créé directement via l'API Supabase Auth (email déjà confirmé,
profil déjà rempli — pas d'écran d'onboarding bloquant à la connexion) :

```
Email    : appreview.demo@hicsunt.app
Password : AppReview2026!
Notes    : "Connectez-vous avec ce compte, puis composez un itinéraire
            depuis l'onglet Créer pour tester la génération."
```
À coller dans App Store Connect → App Review Information → Sign-in required.

## Réponses au questionnaire de confidentialité (App Privacy)

| Donnée | Collectée | Liée à l'identité | Usage |
|---|---|---|---|
| Adresse e-mail | Oui | Oui | Fonctionnalité de l'app (compte) |
| Contenu utilisateur (itinéraires, préférences de voyage) | Oui | Oui | Fonctionnalité de l'app |
| Identifiants (ID utilisateur Supabase) | Oui | Oui | Fonctionnalité de l'app |
| Localisation | Non | — | — |
| Contacts | Non | — | — |
| Données de paiement | Non *(traitées par Stripe, jamais stockées par Hic Sunt)* | — | — |
| Données d'usage/diagnostic | Non *(sauf ce qu'Apple collecte lui-même automatiquement)* | — | — |

## ✅ Suppression de compte (règle 5.1.1(v))
Fait : **Profil → Supprimer mon compte** (bottom-sheet de confirmation, puis
suppression immédiate et définitive de toutes les données via la fonction
serveur `delete-account`). Déployée et opérationnelle côté Supabase.
