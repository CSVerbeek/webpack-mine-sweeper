export class Cell {
    readonly isBomb: boolean;
    private _isOpen = false;

    constructor(isBomb: boolean) {
        this.isBomb = isBomb;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }
}