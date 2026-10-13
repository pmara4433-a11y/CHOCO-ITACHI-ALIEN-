# CHOCO-ITACHI-ALIEN

Bot WhatsApp multi-devices basé sur Baileys + Express + Render-ready.

Ce repo contient une base robuste pour un bot WhatsApp moderne avec :
- endpoint HTTP de santé pour Render
- /qr pour scanner le QR
- support pairing retry
- système de commandes par catégories
- 360 commandes de base et plus de 200 commandes utiles nommées selon les bots modernes
- protection / moderation / owner panel de base

## Structure
- index.js : point d’entrée principal
- config/ : config du bot et du propriétaire
- lib/ : handlers et gestion de session
- commands/index.js : registry de commandes
- data/ : blacklist & roles (JSON)

## Démarrage local
```bash
npm install
npm start
```

Puis ouvrir :
- http://localhost:3000/
- http://localhost:3000/qr

## Déploiement Render
- Build command: `npm install`
- Start command: `npm start`
- Variables d’environnement: `OWNER_NUMBER`, `PAIRING_NUMBER`
- Vérifier les logs pour le QR ou le code de liaison

## Variables d’environnement
```bash
OWNER_NUMBER=224629447488
PAIRING_NUMBER=224629447488
PORT=3000
NODE_ENV=production
```

## Commandes de base
- .menu
- .help
- .ping
- .alive
- .info
- .owner
- .repo
- .qr
- .groupinfo
- .weather
- .news
- .joke
- .fact
- .8ball
- .ban
- .kick
- .warn
- .mute
- .unmute
- .tagall
- .restart

## Catégories supportées
- General
- Admin
- Protection
- Group
- Download
- Fun
- Sticker
- Search
- AI
- Owner
- Utilities

## Important
- Le QR est la méthode la plus fiable sur Render.
- Les commandes de download / image / AI / translate / weather / news exigent des API externes ou clés.
- Les commandes de groupe/admin nécessitent des droits d’admin dans le groupe.
- Ne jamais pousser de numéros secrets ou tokens dans le dépôt public.

# Ce bot est une base solide à enrichir selon ton activité et ton usage réel.
