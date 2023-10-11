import { BehaviorSubject, Observable, distinctUntilChanged } from "rxjs";
import { Cell } from "./cell";

export class MineSweeperBoard {
    readonly cellGrid: CellGrid;
    private _isDetonated = false;
    private readonly _isDetonated$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    readonly isDetonated$: Observable<boolean> = this._isDetonated$.pipe(distinctUntilChanged());
    private _isCompleted = false;

    constructor(boardSettings: BoardSettings) {
        this.cellGrid = this.createCellGrid(boardSettings);
        this.addListenersForDetonation();
    }

    get isDetonated(): boolean {
        return this._isDetonated;
    }

    // undetonating is not possible, can only be set to true
    private set isDetonated(_isDetonated: true) {
        this._isDetonated = true;
        this._isDetonated$.next(true);
    }

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    private createCellGrid(boardSettings: BoardSettings): CellGrid {
        const bombs = Array(boardSettings.nrOfBombs).fill(null).map(() => new Cell(true));
        const emptyCells = Array(boardSettings.cols * boardSettings.rows - boardSettings.nrOfBombs).fill(null).map(() => new Cell(false));
        const cells = this.shuffleCells([...bombs, ...emptyCells]);
        const result: CellGrid = [];

        for (let rowIndex = 0; rowIndex < boardSettings.rows; rowIndex++) {
            const row = [];
            for (let colIndex = 0; colIndex < boardSettings.cols; colIndex++) {
                row.push(cells.pop());
            }
            result.push(row);
        }

        result.flat().forEach(cell => {
            cell.adjacentCells = this.getAdjacentCells(result, cell);
        });

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
                    if (isOpen) {
                        this.isDetonated = true;
                        this.openAllBombs();
                    }
                }
            });
        });
        notBombs.forEach(cell => {
            cell.isOpen$.subscribe({
                next: _ => this.updateIsCompleted()
            });
        });
    }

    private updateIsCompleted(): void {
        this._isCompleted = this.cellGrid.flat().filter(cell => !cell.isBomb).every(cell => cell.isOpen);
    }

    private openAllBombs(): void {
        this.cellGrid.flat().filter(cell => cell.isBomb).forEach(bomb => {
            bomb.open();
        });
    }

    private getAdjacentCells(grid: CellGrid, cell: Cell): Cell[] {
        const row = grid.find(cellRow => cellRow.includes(cell));
        const rowIndex = grid.indexOf(row);
        const colIndex = row.indexOf(cell);

        const result = [];
        for(let adjacentRowIndex = rowIndex - 1; adjacentRowIndex <= rowIndex + 1; adjacentRowIndex++) {
            const cellRow = grid[adjacentRowIndex];
            if(!cellRow) {
                continue;
            }
            for(let adjacentColIndex = colIndex - 1; adjacentColIndex <= colIndex + 1; adjacentColIndex++) {
                const adjacentCell = cellRow[adjacentColIndex];
                if(!adjacentCell || adjacentCell === cell) {
                    continue;
                }
                result.push(adjacentCell);
            }
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