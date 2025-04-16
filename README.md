# Bataille Navale CLI

Un jeu de bataille navale en ligne de commande développé en TypeScript.

## Description

Ce projet implémente le jeu classique de la bataille navale avec deux modes de jeu :
- Mode Simple : Placement aléatoire des navires
- Mode Normal : Placement manuel des navires avec configuration personnalisée

## Prérequis

- Node.js (version 18 ou supérieure)
- npm (version 8 ou supérieure)
- TypeScript

## Installation

1. Clonez le dépôt :
```bash
git clone [URL_DU_REPO]
cd cli-battleship
```

2. Installez les dépendances :
```bash
npm install
```

3. Compilez le code TypeScript :
```bash
tsc
```

## Utilisation

### Mode Simple
```bash
node main.js --mode simple --number <n>
```
Où `<n>` est le nombre de navires à placer pour chaque joueur.

### Mode Normal
```bash
node main.js --mode normal --data <chemin_vers_fichier_json>
```
Où `<chemin_vers_fichier_json>` est le chemin vers le fichier de configuration des navires.

## Structure du fichier JSON

Le fichier JSON doit suivre cette structure :
```json
{
  "ships": [
    {
      "name": "Nom du navire",
      "length": 3,
      "quantity": 2,
      "weapons": ["Arme1", "Arme2"],
      "crew": {
        "captain": "Nom du capitaine",
        "officers": 3,
        "sailors": 10
      }
    }
  ]
}
```

## Règles du jeu

1. La grille est de taille 8x8
2. Les navires ne peuvent pas se toucher
3. Les joueurs jouent à tour de rôle
4. Le premier à couler tous les navires de l'adversaire gagne
5. En mode simple, les navires sont de taille 1x1
6. En mode normal, les navires peuvent avoir différentes tailles

## Commandes du jeu

- Pour placer un navire :
  - Choisir la direction (H pour horizontal, V pour vertical)
  - Entrer la position de départ (ex: A1)

- Pour tirer :
  - Entrer la position à viser (ex: A1)

## Affichage

- `S` : Navire
- `X` : Touché
- `O` : À l'eau
- ` ` : Case vide

## Dépendances

- commander : Gestion des arguments en ligne de commande
- inquirer : Interface utilisateur interactive

## Licence

MIT
