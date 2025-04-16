import inquirer from "inquirer";

type Grid = string[][];
type Position = { row: number; col: number };
type Ship = {
  name: string;
  size: number;
  positions: Position[];
};

class Player {
  name: string;
  grid: Grid;
  ships: Ship[];

  constructor(name: string) {
    this.name = name;
    this.grid = Array(10).fill(null).map(() => Array(10).fill(' '));
    this.ships = [
      { name: "Porte-avions", size: 5, positions: [] },
      { name: "Cuirassé", size: 4, positions: [] },
      { name: "Croiseur", size: 3, positions: [] },
      { name: "Sous-marin", size: 3, positions: [] },
      { name: "Torpilleur", size: 2, positions: [] }
    ];
  }

  displayGrid(hideShips: boolean = false): void {
    let header = "  ";
    for (let i = 0; i < 10; i++) {
      header += " " + String.fromCharCode(65 + i) + " ";
    }
    console.log(header);

    const horizontalLine = "  " + "+---".repeat(10) + "+";

    for (let row = 0; row < 10; row++) {
      console.log(horizontalLine);
      let line = (row + 1).toString().padStart(2) + " ";
      for (let col = 0; col < 10; col++) {
        const cell = this.grid[row][col];
        const displayCell = hideShips && cell === 'S' ? ' ' : cell;
        line += "| " + displayCell + " ";
      }
      line += "|";
      console.log(line);
    }
    console.log(horizontalLine);
  }

  placeShips(): void {
    console.log(`\nPlacement automatique des bateaux pour ${this.name}...`);

    for (const ship of this.ships) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;

      while (!placed && attempts < maxAttempts) {
        attempts++;
        const isHorizontal = Math.random() < 0.5;
        let row, col;

        if (isHorizontal) {
          row = Math.floor(Math.random() * 10);
          col = Math.floor(Math.random() * (10 - ship.size + 1));
        } else {
          row = Math.floor(Math.random() * (10 - ship.size + 1));
          col = Math.floor(Math.random() * 10);
        }

        if (this.canPlaceShip(ship, row, col, isHorizontal)) {
          this.placeShip(ship, row, col, isHorizontal);
          placed = true;
        }
      }

      if (!placed) {
        console.log(`Impossible de placer le ${ship.name} après ${maxAttempts} tentatives. Réinitialisation...`);
        this.grid = Array(10).fill(null).map(() => Array(10).fill(' '));
        this.ships.forEach(s => s.positions = []);
        this.placeShips();
        return;
      }
    }
    console.log("Placement terminé !");
    this.displayGrid();
  }

  canPlaceShip(ship: Ship, row: number, col: number, isHorizontal: boolean): boolean {
    if (isHorizontal) {
      if (col + ship.size > 10) return false;
      for (let i = 0; i < ship.size; i++) {
        if (this.grid[row][col + i] !== ' ') return false;
        if (row > 0 && this.grid[row - 1][col + i] !== ' ') return false;
        if (row < 9 && this.grid[row + 1][col + i] !== ' ') return false;
      }
      if (col > 0) {
        if (this.grid[row][col - 1] !== ' ') return false;
        if (row > 0 && this.grid[row - 1][col - 1] !== ' ') return false;
        if (row < 9 && this.grid[row + 1][col - 1] !== ' ') return false;
      }
      if (col + ship.size < 10) {
        if (this.grid[row][col + ship.size] !== ' ') return false;
        if (row > 0 && this.grid[row - 1][col + ship.size] !== ' ') return false;
        if (row < 9 && this.grid[row + 1][col + ship.size] !== ' ') return false;
      }
    } else {
      if (row + ship.size > 10) return false;
      for (let i = 0; i < ship.size; i++) {
        if (this.grid[row + i][col] !== ' ') return false;
        if (col > 0 && this.grid[row + i][col - 1] !== ' ') return false;
        if (col < 9 && this.grid[row + i][col + 1] !== ' ') return false;
      }
      if (row > 0) {
        if (this.grid[row - 1][col] !== ' ') return false;
        if (col > 0 && this.grid[row - 1][col - 1] !== ' ') return false;
        if (col < 9 && this.grid[row - 1][col + 1] !== ' ') return false;
      }
      if (row + ship.size < 10) {
        if (this.grid[row + ship.size][col] !== ' ') return false;
        if (col > 0 && this.grid[row + ship.size][col - 1] !== ' ') return false;
        if (col < 9 && this.grid[row + ship.size][col + 1] !== ' ') return false;
      }
    }
    return true;
  }

  placeShip(ship: Ship, row: number, col: number, isHorizontal: boolean): void {
    ship.positions = [];
    if (isHorizontal) {
      for (let i = 0; i < ship.size; i++) {
        this.grid[row][col + i] = 'S';
        ship.positions.push({ row, col: col + i });
      }
    } else {
      for (let i = 0; i < ship.size; i++) {
        this.grid[row + i][col] = 'S';
        ship.positions.push({ row: row + i, col });
      }
    }
  }

  shoot(row: number, col: number): boolean {
    if (this.grid[row][col] === 'S') {
      this.grid[row][col] = 'X';
      return true;
    } else if (this.grid[row][col] === ' ') {
      this.grid[row][col] = 'O';
    }
    return false;
  }

  isDefeated(): boolean {
    return this.ships.every(ship =>
      ship.positions.every(pos => this.grid[pos.row][pos.col] === 'X')
    );
  }
}

async function playGame(): Promise<void> {
  const player1 = new Player("Joueur 1");
  const player2 = new Player("Joueur 2");

  console.log("Phase de placement des bateaux");
  player1.placeShips();
  player2.placeShips();

  let currentPlayer = player1;
  let opponent = player2;

  while (true) {
    console.log(`\nTour de ${currentPlayer.name}`);
    opponent.displayGrid(true);

    const { target } = await inquirer.prompt([
      {
        type: "input",
        name: "target",
        message: "Entrez la position à viser (ex: A1):",
        validate: (input: string) => {
          const regex = /^[A-J]([1-9]|10)$/i;
          return regex.test(input) || "Position invalide (ex: A1)";
        }
      }
    ]);

    const col = target[0].toUpperCase().charCodeAt(0) - 65;
    const row = parseInt(target.slice(1)) - 1;

    const hit = opponent.shoot(row, col);
    console.log(hit ? "Touché !" : "À l'eau !");

    if (opponent.isDefeated()) {
      console.log(`\n${currentPlayer.name} a gagné !`);
      break;
    }

    [currentPlayer, opponent] = [opponent, currentPlayer];
  }
}

playGame(); 