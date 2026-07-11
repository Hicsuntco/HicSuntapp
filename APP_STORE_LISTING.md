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
À créer avant soumission — un compte email/mot de passe fixe, avec au moins
un itinéraire déjà généré dedans, pour que le reviewer puisse tout tester
sans attendre une génération complète.

```
Email    : ___________________
Password : ___________________
Notes    : "Un itinéraire est déjà disponible dans Mes voyages — composez-en
            un nouveau depuis l'onglet Créer pour tester la génération."
```

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

## ⚠️ À traiter avant soumission : suppression de compte
Apple exige (règle 5.1.1(v)) qu'une app permettant de créer un compte
permette aussi de le supprimer **depuis l'app elle-même**, pas seulement
par e-mail. `privacy.html` mentionne pour l'instant une suppression sur
demande par e-mail — insuffisant tel quel pour la review. Il faut soit
ajouter un vrai bouton "Supprimer mon compte" dans l'écran Profil (nouvelle
fonction serveur avec clé service_role pour supprimer l'utilisateur
Supabase Auth et ses données en cascade), soit être prêt à ce que la review
le signale. Dites-moi si vous voulez que je le construise avant la première
soumission.
