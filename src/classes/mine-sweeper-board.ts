import { Cell } from "./cell";

export class MineSweeperBoard {
    readonly cellGrid: CellGrid;

    constructor(boardSettings: BoardSettings) {
        this.cellGrid = this.createCellGrid(boardSettings);
    }

    private createCellGrid(boardSettings: BoardSettings): CellGrid {
        const bombs = Array(boardSettings.nrOfBombs).fill(null).map(() => new Cell(true));
        const emptyCells = Array(boardSettings.cols * boardSettings.rows - boardSettings.nrOfBombs).fill(null).map(() => new Cell(false));
        const cells = [...bombs, ...emptyCells];
        const result = [];

        for (let rowIndex = 0; rowIndex < boardSettings.rows; rowIndex++) {
            const row = [];
            for (let colIndex = 0; colIndex < boardSettings.cols; colIndex++) {
                row.push(cells.pop());
            }
            result.push(row);
        }

        return result;
    }
}

export type BoardSettings = {
    rows: number;
    cols: number;
    nrOfBombs: number;
}

export type CellGrid = CellRow[];
export type CellRow = Cell[];