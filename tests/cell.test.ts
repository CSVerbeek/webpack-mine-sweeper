import { Cell } from "../src/classes/cell";

describe('Mine sweeper cell', () => {
    test('can be created without a bomb', () => {
        expect(new Cell(false).isBomb).toEqual(false);
    });

    test('can be created with a bomb', () => {
        expect(new Cell(true).isBomb).toEqual(true);
    });

    test('has a closed state after creation', () => {
        expect(new Cell(false).isOpen).toEqual(false);
    });

    test('can be opened', () => {
        const cell = new Cell(false);
        cell.open();
        expect(cell.isOpen).toEqual(true);
    });

    test('is not flagged after creation', () => {
        const cell = new Cell(false);
        expect(cell.isFlagged).toBe(false);
    });

    test('can be flagged', () => {
        const cell = new Cell(false);
        cell.toggleFlag();
        expect(cell.isFlagged).toBe(true);
    });

    test('can be unflagged', () => {
        const cell = new Cell(false);
        cell.toggleFlag();
        cell.toggleFlag();
        expect(cell.isFlagged).toBe(false);
    });

    test('cannot open a flagged cell', () => {
        const cell = new Cell(false);
        cell.toggleFlag();
        cell.open();
        expect(cell.isOpen).toBe(false);
    });

    test('cannot flag an open cell', () => {
        const cell = new Cell(false);
        cell.open();
        cell.toggleFlag();
        expect(cell.isFlagged).toBe(false);
    });

    test('can set adjacent cells', () => {
        const cell = new Cell(false);
        const adjacentCells: Cell[] = [new Cell(false), new Cell(false), new Cell(false)];
        cell.adjacentCells = adjacentCells;
        expect(cell.adjacentCells.length).toBe(adjacentCells.length);
        expect(cell.adjacentCells.every(cell => adjacentCells.includes(cell))).toBe(true);
    });

    test('can get number of adjacent bombs', () => {
        const cell = new Cell(false);
        const adjacentCellsSet: Cell[][] = [
            [new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false)],
            [new Cell(false), new Cell(false), new Cell(true), new Cell(false), new Cell(false), new Cell(true), new Cell(false), new Cell(false)],
            [new Cell(false), new Cell(true), new Cell(false), new Cell(true), new Cell(false), new Cell(true), new Cell(false), new Cell(false)],
            [new Cell(true), new Cell(true), new Cell(true), new Cell(true), new Cell(true), new Cell(true), new Cell(true), new Cell(true)]
        ];
        adjacentCellsSet.forEach(adjacentCells => {
            cell.adjacentCells = adjacentCells;
            expect(cell.numberOfAdjacentBombs).toBe(adjacentCells.filter(cell => cell.isBomb).length);
        });
    });
});