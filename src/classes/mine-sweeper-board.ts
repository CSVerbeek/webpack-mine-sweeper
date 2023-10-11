import { Cell } from "./cell";

export class MineSweeperBoard {
    cellGrid: CellGrid;

    constructor(boardSettings: BoardSettings) {
        const bombs = Array(boardSettings.nrOfBombs).fill(new Cell(true));
        const emptyCells = Array(boardSettings.cols * boardSettings.rows - boardSettings.nrOfBombs).fill(new Cell(false));
        const cells = [...bombs, ...emptyCells];
        const cellGrid = [];
        for (let rowIndex = 0; rowIndex < boardSettings.rows; rowIndex++) {
            const row = [];
            for (let colIndex = 0; colIndex < boardSettings.cols; colIndex++) {
                row.push(cells.pop());
            }
            cellGrid.push(row);
        }
        this.cellGrid = cellGrid;
    }
}

export type BoardSettings = {
        rows: number;
        cols: number;
        nrOfBombs: number;
    }

export type CellGrid = CellRow[];
export type CellRow = Cell[];