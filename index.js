"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-await-in-loop */
var inquirer_1 = require("inquirer");
var fs = require("fs");
var commander_1 = require("commander");
var Player = /** @class */ (function () {
    function Player(name) {
        this.name = name;
        this.grid = Array(8).fill(null).map(function () { return Array(8).fill(' '); });
        this.ships = [];
    }
    Player.prototype.loadShips = function (jsonFile) {
        try {
            var data = fs.readFileSync(jsonFile, 'utf8');
            var resources = JSON.parse(data);
            this.ships = resources.ships.flatMap(function (shipData) { return Array(shipData.quantity)
                .fill(null).map(function () { return ({
                name: shipData.name,
                size: shipData.length,
                positions: [],
                weapons: shipData.weapons,
                crew: shipData.crew,
            }); }); });
        }
        catch (error) {
            console.error('Erreur lors du chargement des navires:', error);
            this.ships = [];
        }
    };
    Player.prototype.generateSimpleShips = function (count) {
        this.ships = [];
        var positions = new Set();
        while (this.ships.length < count) {
            var row = Math.floor(Math.random() * 8);
            var col = Math.floor(Math.random() * 8);
            var posKey = "".concat(row, ",").concat(col);
            if (!positions.has(posKey)) {
                positions.add(posKey);
                this.ships.push({
                    name: "Bateau ".concat(this.ships.length + 1),
                    size: 1,
                    positions: [{ row: row, col: col }],
                    weapons: [],
                    crew: { captain: '', officers: 0, sailors: 0 },
                });
                this.grid[row][col] = 'S';
            }
        }
    };
    Player.prototype.displayGrid = function (hideShips) {
        if (hideShips === void 0) { hideShips = false; }
        var header = '  ';
        for (var i = 0; i < 8; i += 1) {
            header += " ".concat(String.fromCharCode(65 + i), " ");
        }
        console.log(header);
        var horizontalLine = "  ".concat('+---'.repeat(8), "+");
        for (var row = 0; row < 8; row += 1) {
            console.log(horizontalLine);
            var line = "".concat((row + 1).toString().padStart(2), " ");
            for (var col = 0; col < 8; col += 1) {
                var cell = this.grid[row][col];
                var displayCell = hideShips && cell === 'S' ? ' ' : cell;
                line += "| ".concat(displayCell, " ");
            }
            line += '|';
            console.log(line);
        }
        console.log(horizontalLine);
    };
    Player.prototype.placeShips = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, ship, placed, _b, direction, startPos, col, row, isHorizontal;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("\n".concat(this.name, ", placez vos bateaux:"));
                        _i = 0, _a = this.ships;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        ship = _a[_i];
                        placed = false;
                        _c.label = 2;
                    case 2:
                        if (!!placed) return [3 /*break*/, 4];
                        this.displayGrid();
                        console.log("\nPlacement du ".concat(ship.name, " (").concat(ship.size, " cases)"));
                        console.log("Armes: ".concat(ship.weapons.join(', ')));
                        console.log("Capitaine: ".concat(ship.crew.captain));
                        console.log("\u00C9quipage: ".concat(ship.crew.officers, " officiers et ").concat(ship.crew.sailors, " marins"));
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: 'input',
                                    name: 'direction',
                                    message: 'Choisissez la direction (H pour horizontal, V pour vertical):',
                                    validate: function (input) { return input.toUpperCase() === 'H' || input.toUpperCase() === 'V' || 'Entrez H ou V'; },
                                },
                                {
                                    type: 'input',
                                    name: 'startPos',
                                    message: 'Entrez la position de départ (ex: A1):',
                                    validate: function (input) {
                                        var regex = /^[A-H]([1-8])$/i;
                                        return regex.test(input) || 'Position invalide (ex: A1)';
                                    },
                                },
                            ])];
                    case 3:
                        _b = _c.sent(), direction = _b.direction, startPos = _b.startPos;
                        col = startPos[0].toUpperCase().charCodeAt(0) - 65;
                        row = parseInt(startPos.slice(1), 10) - 1;
                        isHorizontal = direction.toUpperCase() === 'H';
                        if (this.canPlaceShip(ship, row, col, isHorizontal)) {
                            this.placeShip(ship, row, col, isHorizontal);
                            placed = true;
                        }
                        else {
                            console.log('Position invalide, réessayez');
                        }
                        return [3 /*break*/, 2];
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Player.prototype.canPlaceShip = function (ship, row, col, isHorizontal) {
        if (isHorizontal) {
            if (col + ship.size > 8)
                return false;
            for (var i = 0; i < ship.size; i += 1) {
                // Vérifie la case du navire
                if (this.grid[row][col + i] !== ' ')
                    return false;
                // Vérifie la case au-dessus
                if (row > 0 && this.grid[row - 1][col + i] !== ' ')
                    return false;
                // Vérifie la case en-dessous
                if (row < 7 && this.grid[row + 1][col + i] !== ' ')
                    return false;
            }
            if (col > 0) {
                // Vérifie la case à gauche
                if (this.grid[row][col - 1] !== ' ')
                    return false;
                // Vérifie la case en haut à gauche
                if (row > 0 && this.grid[row - 1][col - 1] !== ' ')
                    return false;
                // Vérifie la case en bas à gauche
                if (row < 7 && this.grid[row + 1][col - 1] !== ' ')
                    return false;
            }
            if (col + ship.size < 8) {
                // Vérifie la case à droite
                if (this.grid[row][col + ship.size] !== ' ')
                    return false;
                // Vérifie la case en haut à droite
                if (row > 0 && this.grid[row - 1][col + ship.size] !== ' ')
                    return false;
                // Vérifie la case en bas à droite
                if (row < 7 && this.grid[row + 1][col + ship.size] !== ' ')
                    return false;
            }
        }
        else {
            if (row + ship.size > 8)
                return false;
            for (var i = 0; i < ship.size; i += 1) {
                // Vérifie la case du navire
                if (this.grid[row + i][col] !== ' ')
                    return false;
                // Vérifie la case à gauche
                if (col > 0 && this.grid[row + i][col - 1] !== ' ')
                    return false;
                // Vérifie la case à droite
                if (col < 7 && this.grid[row + i][col + 1] !== ' ')
                    return false;
            }
            if (row > 0) {
                // Vérifie la case en haut
                if (this.grid[row - 1][col] !== ' ')
                    return false;
                // Vérifie la case en haut à gauche
                if (col > 0 && this.grid[row - 1][col - 1] !== ' ')
                    return false;
                // Vérifie la case en haut à droite
                if (col < 7 && this.grid[row - 1][col + 1] !== ' ')
                    return false;
            }
            if (row + ship.size < 8) {
                // Vérifie la case en bas
                if (this.grid[row + ship.size][col] !== ' ')
                    return false;
                // Vérifie la case en bas à gauche
                if (col > 0 && this.grid[row + ship.size][col - 1] !== ' ')
                    return false;
                // Vérifie la case en bas à droite
                if (col < 7 && this.grid[row + ship.size][col + 1] !== ' ')
                    return false;
            }
        }
        return true;
    };
    Player.prototype.placeShip = function (ship, row, col, isHorizontal) {
        ship.positions = [];
        if (isHorizontal) {
            for (var i = 0; i < ship.size; i += 1) {
                this.grid[row][col + i] = 'S';
                ship.positions.push({ row: row, col: col + i });
            }
        }
        else {
            for (var i = 0; i < ship.size; i += 1) {
                this.grid[row + i][col] = 'S';
                ship.positions.push({ row: row + i, col: col });
            }
        }
    };
    Player.prototype.shoot = function (row, col) {
        if (this.grid[row][col] === 'S') {
            this.grid[row][col] = 'X';
            return true;
        }
        if (this.grid[row][col] === ' ') {
            this.grid[row][col] = 'O';
        }
        return false;
    };
    Player.prototype.isDefeated = function () {
        var _this = this;
        return this.ships.every(function (ship) { return ship.positions.every(function (pos) { return _this.grid[pos.row][pos.col] === 'X'; }); });
    };
    return Player;
}());
function playGame(mode, data, number) {
    return __awaiter(this, void 0, void 0, function () {
        var player1, player2, currentPlayer, opponent, target, col, row, hit;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    player1 = new Player('Joueur 1');
                    player2 = new Player('Joueur 2');
                    if (!(mode === 'simple' && number)) return [3 /*break*/, 1];
                    player1.generateSimpleShips(number);
                    player2.generateSimpleShips(number);
                    return [3 /*break*/, 5];
                case 1:
                    if (!(mode === 'normal' && data)) return [3 /*break*/, 4];
                    player1.loadShips(data);
                    player2.loadShips(data);
                    console.log('Phase de placement des bateaux');
                    return [4 /*yield*/, player1.placeShips()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, player2.placeShips()];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    console.error('Mode de jeu invalide ou paramètres manquants');
                    return [2 /*return*/];
                case 5:
                    currentPlayer = player1;
                    opponent = player2;
                    _b.label = 6;
                case 6:
                    if (!(!player1.isDefeated() && !player2.isDefeated())) return [3 /*break*/, 8];
                    console.log("\nTour de ".concat(currentPlayer.name));
                    opponent.displayGrid(true);
                    return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'input',
                                name: 'target',
                                message: 'Entrez la position à viser (ex: A1):',
                                validate: function (input) {
                                    var regex = /^[A-H]([1-8])$/i;
                                    return regex.test(input) || 'Position invalide (ex: A1)';
                                },
                            },
                        ])];
                case 7:
                    target = (_b.sent()).target;
                    col = target[0].toUpperCase().charCodeAt(0) - 65;
                    row = parseInt(target.slice(1), 10) - 1;
                    hit = opponent.shoot(row, col);
                    console.log(hit ? 'Touché !' : "À l'eau !");
                    if (opponent.isDefeated()) {
                        console.log("\n".concat(currentPlayer.name, " a gagn\u00E9 !"));
                        return [3 /*break*/, 8];
                    }
                    _a = [opponent, currentPlayer], currentPlayer = _a[0], opponent = _a[1];
                    return [3 /*break*/, 6];
                case 8: return [2 /*return*/];
            }
        });
    });
}
var program = new commander_1.Command();
program
    .option('--mode <mode>', 'Mode de jeu (simple ou normal)')
    .option('--number <number>', 'Nombre de bateaux en mode simple')
    .option('--data <data>', 'Fichier JSON des bateaux en mode normal')
    .parse(process.argv);
var options = program.opts();
if (!options.mode || (options.mode === 'simple' && !options.number) || (options.mode === 'normal' && !options.data)) {
    console.error('Paramètres invalides. Utilisation:');
    console.error('Mode simple: node main.js --mode simple --number <n>');
    console.error('Mode normal: node main.js --mode normal --data <json_file>');
    process.exit(1);
}
playGame(options.mode, options.data, options.number ? parseInt(options.number, 10) : undefined);
