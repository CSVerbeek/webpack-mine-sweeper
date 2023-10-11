import { BehaviorSubject, Observable, distinctUntilChanged } from "rxjs";

export class Cell {
    readonly isBomb: boolean;
    private _isOpen = false;
    private _isFlagged = false;
    adjacentCells: Cell[] = [];
    private readonly _isOpen$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    readonly isOpen$: Observable<boolean> = this._isOpen$.asObservable();

    constructor(isBomb: boolean) {
        this.isBomb = isBomb;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    // closing an open cell is not possible, can only be set to true
    private set isOpen(_isOpen: true) {
        this._isOpen = true;
        this._isOpen$.next(true);
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
        this.isOpen = true;
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