# CHOCO-ITACHI-ALIEN

Un bot WhatsApp multi-devices construit avec Node.js + Baileys + Express. Il est conçu pour fonctionner sur Render avec un endpoint HTTP de santé et un endpoint /qr pour le scan QR.

## Caractéristiques
- Connexion WhatsApp via Baileys
- Serveur HTTP pour Render
- Endpoint /qr pour scanner le code QR
- Health check / pour Render
- Base de commandes structurée
- 360 commandes générées dans la commande registry
- Support de variables d’environnement

## Structure du projet
- `index.js` : point d’entrée principal
- `config/` : configuration du bot et du propriétaire
- `lib/` : gestion des sessions et handlers
- `commands/` : commandes du bot
- `session/` : stockage des sessions WhatsApp

## Variables d’environnement
Voir `.env.example`.

Exemple :
```bash
OWNER_NUMBER=224000000000
PAIRING_NUMBER=224000000000
PORT=3000
NODE_ENV=production
```

## Démarrage local
```bash
npm install
npm start
```

Puis ouvrir :
- http://localhost:3000/
- http://localhost:3000/qr

## Déploiement Render
1. Créer un Web Service sur Render.
2. Connecter le dépôt GitHub.
3. Configurer :
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Ajouter les variables d’environnement dans Render:
   - OWNER_NUMBER
   - PAIRING_NUMBER
5. Vérifier les logs Render :
   - un QR est affiché via /qr
   - ou un code de liaison est généré dans les logs

## Commandes de base
- `.menu`
- `.help`
- `.ping`
- `.info`
- `.status`
- `.owner`
- `.qr`
- `.echo <texte>`
- `.time`
- `.date`

Plus de 360 commandes générées, structurées comme templates et automatiquement chargées.

## Notes
- Le QR est la méthode la plus fiable sur Render.
- Le pairing code peut être tenté automatiquement, mais le QR est recommandé.
- Laisser les tokens et numéros dans `.env`, pas dans le dépôt.
