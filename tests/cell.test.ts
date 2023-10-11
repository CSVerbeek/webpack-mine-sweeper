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
});