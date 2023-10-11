export class Cell {
    readonly isBomb: boolean;
    private _isOpen = false;
    private _isFlagged = false;

    constructor(isBomb: boolean) {
        this.isBomb = isBomb;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    get isFlagged(): boolean {
        return this._isFlagged;
    }

    open(): void {
        if(this.isFlagged) {
            return;
        }
        this._isOpen = true;
    }

    toggleFlag(): void {
        this._isFlagged = !this.isFlagged;
    }
}