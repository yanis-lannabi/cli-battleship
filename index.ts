/* eslint-disable no-await-in-loop */
import inquirer from 'inquirer';
import * as fs from 'fs';
import { Command } from 'commander';

type Grid = string[][];
type Position = { row: number; col: number };

interface ShipData {
  name: string;
  length: number;
  quantity: number;
  weapons: string[];
  crew: {
    captain: string;
    officers: number;
    sailors: number;
  };
}

interface Resources {
  ships: ShipData[];
}

type Ship = {
  name: string;
  size: number;
  positions: Position[];
  weapons: string[];
  crew: {
    captain: string;
    officers: number;
    sailors: number;
  };
};

class Player {
  name: string;

  grid: Grid;

  ships: Ship[];

  constructor(name: string) {
    this.name = name;
    this.grid = Array(8).fill(null).map(() => Array(8).fill(' '));
    this.ships = [];
  }

  loadShips(jsonFile: string): void {
    try {
      const data = fs.readFileSync(jsonFile, 'utf8');
      const resources: Resources = JSON.parse(data);
      this.ships = resources.ships.flatMap((shipData) => Array(shipData.quantity)
        .fill(null).map(() => ({
          name: shipData.name,
          size: shipData.length,
          positions: [],
          weapons: shipData.weapons,
          crew: shipData.crew,
        })));
    } catch (error) {
      console.error('Erreur lors du chargement des navires:', error);
      this.ships = [];
    }
  }

  generateSimpleShips(count: number): void {
    this.ships = [];
    const positions = new Set<string>();

    while (this.ships.length < count) {
      const row = Math.floor(Math.random() * 8);
      const col = Math.floor(Math.random() * 8);
      const posKey = `${row},${col}`;

      if (!positions.has(posKey)) {
        positions.add(posKey);
        this.ships.push({
          name: `Bateau ${this.ships.length + 1}`,
          size: 1,
          positions: [{ row, col }],
          weapons: [],
          crew: { captain: '', officers: 0, sailors: 0 },
        });
        this.grid[row][col] = 'S';
      }
    }
  }

  displayGrid(hideShips: boolean = false): void {
    let header = '  ';
    for (let i = 0; i < 8; i += 1) {
      header += ` ${String.fromCharCode(65 + i)} `;
    }
    console.log(header);

    const horizontalLine = `  ${'+---'.repeat(8)}+`;

    for (let row = 0; row < 8; row += 1) {
      console.log(horizontalLine);
      let line = `${(row + 1).toString().padStart(2)} `;
      for (let col = 0; col < 8; col += 1) {
        const cell = this.grid[row][col];
        const displayCell = hideShips && cell === 'S' ? ' ' : cell;
        line += `| ${displayCell} `;
      }
      line += '|';
      console.log(line);
    }
    console.log(horizontalLine);
  }

  async placeShips(): Promise<void> {
    console.log(`\n${this.name}, placez vos bateaux:`);

    for (const ship of this.ships) {
      let placed = false;
      while (!placed) {
        this.displayGrid();
        console.log(`\nPlacement du ${ship.name} (${ship.size} cases)`);
        console.log(`Armes: ${ship.weapons.join(', ')}`);
        console.log(`Capitaine: ${ship.crew.captain}`);
        console.log(`Équipage: ${ship.crew.officers} officiers et ${ship.crew.sailors} marins`);

        const { direction, startPos } = await inquirer.prompt([
          {
            type: 'input',
            name: 'direction',
            message: 'Choisissez la direction (H pour horizontal, V pour vertical):',
            validate: (input: string) => input.toUpperCase() === 'H' || input.toUpperCase() === 'V' || 'Entrez H ou V',
          },
          {
            type: 'input',
            name: 'startPos',
            message: 'Entrez la position de départ (ex: A1):',
            validate: (input: string) => {
              const regex = /^[A-H]([1-8])$/i;
              return regex.test(input) || 'Position invalide (ex: A1)';
            },
          },
        ]);

        const col = startPos[0].toUpperCase().charCodeAt(0) - 65;
        const row = parseInt(startPos.slice(1), 10) - 1;
        const isHorizontal = direction.toUpperCase() === 'H';

        if (this.canPlaceShip(ship, row, col, isHorizontal)) {
          this.placeShip(ship, row, col, isHorizontal);
          placed = true;
        } else {
          console.log('Position invalide, réessayez');
        }
      }
    }
  }

  canPlaceShip(ship: Ship, row: number, col: number, isHorizontal: boolean): boolean {
    if (isHorizontal) {
      if (col + ship.size > 8) return false;
      for (let i = 0; i < ship.size; i += 1) {
        // Vérifie la case du navire
        if (this.grid[row][col + i] !== ' ') return false;
        // Vérifie la case au-dessus
        if (row > 0 && this.grid[row - 1][col + i] !== ' ') return false;
        // Vérifie la case en-dessous
        if (row < 7 && this.grid[row + 1][col + i] !== ' ') return false;
      }
      if (col > 0) {
        // Vérifie la case à gauche
        if (this.grid[row][col - 1] !== ' ') return false;
        // Vérifie la case en haut à gauche
        if (row > 0 && this.grid[row - 1][col - 1] !== ' ') return false;
        // Vérifie la case en bas à gauche
        if (row < 7 && this.grid[row + 1][col - 1] !== ' ') return false;
      }
      if (col + ship.size < 8) {
        // Vérifie la case à droite
        if (this.grid[row][col + ship.size] !== ' ') return false;
        // Vérifie la case en haut à droite
        if (row > 0 && this.grid[row - 1][col + ship.size] !== ' ') return false;
        // Vérifie la case en bas à droite
        if (row < 7 && this.grid[row + 1][col + ship.size] !== ' ') return false;
      }
    } else {
      if (row + ship.size > 8) return false;
      for (let i = 0; i < ship.size; i += 1) {
        // Vérifie la case du navire
        if (this.grid[row + i][col] !== ' ') return false;
        // Vérifie la case à gauche
        if (col > 0 && this.grid[row + i][col - 1] !== ' ') return false;
        // Vérifie la case à droite
        if (col < 7 && this.grid[row + i][col + 1] !== ' ') return false;
      }
      if (row > 0) {
        // Vérifie la case en haut
        if (this.grid[row - 1][col] !== ' ') return false;
        // Vérifie la case en haut à gauche
        if (col > 0 && this.grid[row - 1][col - 1] !== ' ') return false;
        // Vérifie la case en haut à droite
        if (col < 7 && this.grid[row - 1][col + 1] !== ' ') return false;
      }
      if (row + ship.size < 8) {
        // Vérifie la case en bas
        if (this.grid[row + ship.size][col] !== ' ') return false;
        // Vérifie la case en bas à gauche
        if (col > 0 && this.grid[row + ship.size][col - 1] !== ' ') return false;
        // Vérifie la case en bas à droite
        if (col < 7 && this.grid[row + ship.size][col + 1] !== ' ') return false;
      }
    }
    return true;
  }

  placeShip(ship: Ship, row: number, col: number, isHorizontal: boolean): void {
    ship.positions = [];
    if (isHorizontal) {
      for (let i = 0; i < ship.size; i += 1) {
        this.grid[row][col + i] = 'S';
        ship.positions.push({ row, col: col + i });
      }
    } else {
      for (let i = 0; i < ship.size; i += 1) {
        this.grid[row + i][col] = 'S';
        ship.positions.push({ row: row + i, col });
      }
    }
  }

  shoot(row: number, col: number): boolean {
    if (this.grid[row][col] === 'S') {
      this.grid[row][col] = 'X';
      return true;
    } if (this.grid[row][col] === ' ') {
      this.grid[row][col] = 'O';
    }
    return false;
  }

  isDefeated(): boolean {
    return this.ships.every((ship) => ship.positions.every((pos) => this.grid[pos.row][pos.col] === 'X'));
  }
}

async function playGame(mode: string, data?: string, number?: number): Promise<void> {
  const player1 = new Player('Joueur 1');
  const player2 = new Player('Joueur 2');

  if (mode === 'simple' && number) {
    player1.generateSimpleShips(number);
    player2.generateSimpleShips(number);
  } else if (mode === 'normal' && data) {
    player1.loadShips(data);
    player2.loadShips(data);
    console.log('Phase de placement des bateaux');
    await player1.placeShips();
    await player2.placeShips();
  } else {
    console.error('Mode de jeu invalide ou paramètres manquants');
    return;
  }

  let currentPlayer = player1;
  let opponent = player2;

  while (!player1.isDefeated() && !player2.isDefeated()) {
    console.log(`\nTour de ${currentPlayer.name}`);
    opponent.displayGrid(true);

    const { target } = await inquirer.prompt([
      {
        type: 'input',
        name: 'target',
        message: 'Entrez la position à viser (ex: A1):',
        validate: (input: string) => {
          const regex = /^[A-H]([1-8])$/i;
          return regex.test(input) || 'Position invalide (ex: A1)';
        },
      },
    ]);

    const col = target[0].toUpperCase().charCodeAt(0) - 65;
    const row = parseInt(target.slice(1), 10) - 1;

    const hit = opponent.shoot(row, col);
    console.log(hit ? 'Touché !' : "À l'eau !");

    if (opponent.isDefeated()) {
      console.log(`\n${currentPlayer.name} a gagné !`);
      break;
    }

    [currentPlayer, opponent] = [opponent, currentPlayer];
  }
}

const program = new Command();

program
  .option('--mode <mode>', 'Mode de jeu (simple ou normal)')
  .option('--number <number>', 'Nombre de bateaux en mode simple')
  .option('--data <data>', 'Fichier JSON des bateaux en mode normal')
  .parse(process.argv);

const options = program.opts();

if (!options.mode || (options.mode === 'simple' && !options.number) || (options.mode === 'normal' && !options.data)) {
  console.error('Paramètres invalides. Utilisation:');
  console.error('Mode simple: node main.js --mode simple --number <n>');
  console.error('Mode normal: node main.js --mode normal --data <json_file>');
  process.exit(1);
}

playGame(options.mode, options.data, options.number ? parseInt(options.number, 10) : undefined);
