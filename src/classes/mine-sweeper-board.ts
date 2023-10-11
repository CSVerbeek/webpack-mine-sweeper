import { Cell } from "./cell";

export class MineSweeperBoard {
    readonly cellGrid: CellGrid;
    private _isDetonated = false;
    private _isCompleted = false;

    constructor(boardSettings: BoardSettings) {
        this.cellGrid = this.createCellGrid(boardSettings);
        this.addListenersForDetonation();
    }

    get isDetonated(): boolean {
        return this._isDetonated;
    }

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    private createCellGrid(boardSettings: BoardSettings): CellGrid {
        const bombs = Array(boardSettings.nrOfBombs).fill(null).map(() => new Cell(true));
        const emptyCells = Array(boardSettings.cols * boardSettings.rows - boardSettings.nrOfBombs).fill(null).map(() => new Cell(false));
        const cells = this.shuffleCells([...bombs, ...emptyCells]);
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

    private shuffleCells(cells: Cell[]): Cell[] {
        let currentIndex = cells.length - 1;
        while (currentIndex > 0) {
            const randomCellIndex = Math.floor(Math.random() * (currentIndex + 1));
            if (randomCellIndex !== currentIndex) {
                [cells[currentIndex], cells[randomCellIndex]] = [cells[randomCellIndex], cells[currentIndex]];
            }
            currentIndex--;
        }
        return cells;
    }

    private addListenersForDetonation(): void {
        const cells = this.cellGrid.flat();
        const bombs = cells.filter(cell => cell.isBomb);
        const notBombs = cells.filter(cell => !cell.isBomb);
        bombs.forEach(cell => {
            cell.isOpen$.subscribe({
                next: isOpen => {
                    this._isDetonated = isOpen;
                }
            });
        });
        notBombs.forEach(cell => {
            cell.isOpen$.subscribe({
                next: _ => this.updateIsCompleted()
            });
        });
    }

    private updateIsCompleted() {
        this._isCompleted = this.cellGrid.flat().filter(cell => !cell.isBomb).every(cell => cell.isOpen);
    }
}

export type BoardSettings = {
    rows: number;
    cols: number;
    nrOfBombs: number;
}

export type CellGrid = CellRow[];
export type CellRow = Cell[];