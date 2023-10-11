export class Cell {
    readonly isBomb: boolean;
    private _isOpen = false;
    private _isFlagged = false;
    adjacentCells: Cell[] = [];

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
        if(this.isOpen || this.isFlagged) {
            // Don't open when flagged. Also do not continue when already open to prevent infinite loops when opening adjacent cells
            return;
        }
        this._isOpen = true;
        if(this.isBomb) {
            return;
        }
        this.adjacentCells.forEach(cell => { cell.open(); });
    }

    toggleFlag(): void {
        if(this.isOpen) {
            return;
        }
        this._isFlagged = !this.isFlagged;
    }
}