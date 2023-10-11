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

    test('opens adjacent cells when there are no adjacent bombs', () => {
        const cellWithNoAdjacentBombs = createCellWithNoAdjacentBombs(false);
        expect(cellWithNoAdjacentBombs.adjacentCells.some(cell => cell.isOpen)).toBe(false);
        cellWithNoAdjacentBombs.open();
        expect(cellWithNoAdjacentBombs.isOpen).toBe(true);
        expect(cellWithNoAdjacentBombs.adjacentCells.every(cell => cell.isOpen)).toBe(true);
    });

    test('does not open adjacent cells when cell without adjacent bombs is a bomb', () => {
        const bombWithNoAdjacentBombs = createCellWithNoAdjacentBombs(true);
        expect(bombWithNoAdjacentBombs.adjacentCells.some(cell => cell.isOpen)).toBe(false);
        bombWithNoAdjacentBombs.open();
        expect(bombWithNoAdjacentBombs.isOpen).toBe(true);
        expect(bombWithNoAdjacentBombs.adjacentCells.some(cell => cell.isOpen)).toBe(false);
    });

    test('chains opening the cells without adjacent bombs', () => {
        const adjacentCellWithNoAdjacentBombs = createCellWithNoAdjacentBombs(false);
        const cellWithNoAdjacentBombs = ((): Cell => {
            const result: Cell = new Cell(false);
            result.adjacentCells = [adjacentCellWithNoAdjacentBombs, new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false)];
            return result;
        })();
        expect(cellWithNoAdjacentBombs.adjacentCells.some(cell => cell.isOpen)).toBe(false);
        expect(adjacentCellWithNoAdjacentBombs.adjacentCells.some(cell => cell.isOpen)).toBe(false);
        cellWithNoAdjacentBombs.open();
        expect(cellWithNoAdjacentBombs.isOpen).toBe(true);
        expect(cellWithNoAdjacentBombs.adjacentCells.every(cell => cell.isOpen)).toBe(true);
        expect(adjacentCellWithNoAdjacentBombs.adjacentCells.every(cell => cell.isOpen)).toBe(true);
    });

    test('can listen to open changed', () => {
        const cell = new Cell(false);
        const testFn = jest.fn();
        cell.isOpen$.subscribe({next: isOpen => {
            testFn(isOpen);
        }});
        expect(testFn).not.toBeCalledWith(true);
        cell.open();
        expect(testFn).toBeCalledWith(true);
    });
});

function createCellWithNoAdjacentBombs(isBomb: boolean): Cell {
    const result: Cell = new Cell(isBomb);
    result.adjacentCells = [new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false), new Cell(false)];
    return result;
}