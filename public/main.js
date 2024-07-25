import Grid from "./Grid.js";
import Play from "./Play.js";
import Tile from "./Tile.js";

const $board = document.getElementById('game-board');
const GRID = new Grid($board);

GRID.randomEmptyCell().tile = new Tile($board);
GRID.randomEmptyCell().tile = new Tile($board);

const PLAY = new Play($board, GRID);
PLAY.setupInput();
