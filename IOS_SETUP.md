# Hic Sunt sur iOS — mise en route (Xcode, sur votre Mac)

Le projet Capacitor/Xcode est déjà généré et committé dans `ios/`. Ce
document couvre uniquement ce qui se fait sur votre machine.

## 1. Récupérer le projet

```
git pull
npm install
```

## 2. Générer www/ et synchroniser le projet iOS

`www/` n'est jamais committé (il est régénéré à partir des fichiers du
dépôt à chaque fois — voir `scripts/build-www.sh`) :

```
npm run ios:sync
```

Cette commande copie les fichiers app dans `www/` puis synchronise
`ios/App/App/public` avec ce contenu. À relancer à chaque fois que vous
récupérez des changements du dépôt avant d'ouvrir Xcode.

## 3. Ouvrir dans Xcode

```
npm run ios:open
```

(ou directement `ios/App/App.xcworkspace` depuis le Finder)

## 4. Signature

Dans Xcode : sélectionnez la cible **App** → onglet **Signing &
Capabilities** → cochez **Automatically manage signing** → choisissez
votre équipe (votre compte Apple Developer). Xcode gère certificats et
profils de provisionnement tout seul pour un compte solo.

Vérifiez aussi le **Bundle Identifier** : `com.hicsunt.app` par défaut
(`capacitor.config.json`) — changez-le ici ET dans `capacitor.config.json`
si vous voulez autre chose, puis relancez `npm run ios:sync`.

## 5. Lancer sur le simulateur

Bouton ▶️ dans Xcode, choisir un simulateur iPhone. Premier moment pour
vérifier visuellement que tout s'affiche correctement.

## 6. Archiver pour TestFlight / App Store

Product → Archive, puis Distribute App → App Store Connect → Upload.

## Ce qui a déjà été préparé pour vous

- **Icône d'app** : `ios/App/App/Assets.xcassets/AppIcon.appiconset/` — générée depuis `icons/icon-1024.png`.
- **Écran de lancement** : `ios/App/App/Assets.xcassets/Splash.imageset/` — fond sable + mot-symbole "Hic Sunt", cohérent avec l'animation d'ouverture de l'app.
- **Paywall désactivé sur iOS** : le déblocage payant (liens Stripe) est **spécifiquement contourné** quand l'app tourne dans la coquille native (voir `_isNativeIOSApp()` dans `generate.js`) — décision "app gratuite" pour la première publication. Le web garde Stripe inchangé.
- **Politique de confidentialité** : `privacy.html`, à référencer dans App Store Connect une fois déployée sur Vercel.

## Encore à faire avant soumission

- Les deux fonctions serveur (génération d'itinéraire + suppression de
  compte) sont déployées et opérationnelles. Note technique : Supabase leur
  a attribué des noms auto-générés (`smooth-service` et `smooth-handler`)
  au lieu de `generate-itinerary`/`delete-account` — le code de l'app a été
  ajusté pour appeler les bonnes URLs, aucune action supplémentaire requise.
- Le reste : voir `APP_STORE_LISTING.md`.
