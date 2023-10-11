export class Cell {
    readonly isBomb: boolean;
    private _isOpen = false;
    private _isFlagged = false;
    adjacentCells: Cell[];

    constructor(isBomb: boolean) {
        this.isBomb = isBomb;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    get isFlagged(): boolean {
        return this._isFlagged;
    }

    get numberOfAdjacentBombs(): number {
        return this.adjacentCells.filter(cell => cell.isBomb).length;
    }

    open(): void {
        if(this.isFlagged) {
            return;
        }
        this._isOpen = true;
    }

    toggleFlag(): void {
        if(this.isOpen) {
            return;
        }
        this._isFlagged = !this.isFlagged;
    }
}