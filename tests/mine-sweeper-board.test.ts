import { Cell } from "../src/classes/cell";
import { BoardSettings, MineSweeperBoard } from "../src/classes/mine-sweeper-board";

describe('Mine sweeper board', () => {

    test('contains a cell grid matching settings', () => {
        const boardSettings: BoardSettings = { rows: 10, cols: 20, nrOfBombs: 25 };
        const board = new MineSweeperBoard(boardSettings);
        const cells: Cell[] = board.cellGrid.flat();

        expect(board.cellGrid.length).toBe(boardSettings.rows);
        expect(board.cellGrid.every(cellRow => cellRow.length === boardSettings.cols)).toBe(true);
        expect(cells.length).toBe(boardSettings.rows * boardSettings.cols);
        expect(cells.filter(cell => cell.isBomb).length).toBe(boardSettings.nrOfBombs);
    });

    test('contains a cell grid with unique cells', () => {
        const board = new MineSweeperBoard({ rows: 10, cols: 10, nrOfBombs: 10 });
        const cells: Cell[] = board.cellGrid.flat();

        const firstFoundDuplicateCell = cells.find((cell, index) => cells.indexOf(cell) !== index);
        expect(firstFoundDuplicateCell).toBeUndefined();
    });

    test('has the bombs placed randomly', () => {
        const nrOfBoards = 1000;
        const boardSettings = { rows: 10, cols: 10, nrOfBombs: 20 };
        const nrOfCells = boardSettings.rows * boardSettings.cols;
        const boards = new Array(nrOfBoards).fill(null)
            .map(_ => new MineSweeperBoard(boardSettings));
        const bombAtIndexCounts: number[] = boards
            .map(board => board.cellGrid.flat().map(cell => cell.isBomb ? 1 : 0))
            .reduce((prev: number[], curr: number[]) => prev.map((prevCount, index) => prevCount + curr[index]), new Array(nrOfCells).fill(0));
        const chanceOfCellBeingBomb = boardSettings.nrOfBombs / (nrOfCells);
        const expectedCount = chanceOfCellBeingBomb * nrOfBoards;
        const allowedDeviation = 0.06 * nrOfBoards;
        bombAtIndexCounts.forEach(count => {
            expect(count).toBeGreaterThanOrEqual(expectedCount - allowedDeviation);
            expect(count).toBeLessThanOrEqual(expectedCount + allowedDeviation);
        });
    });

    test('is not detonated on creation', () => {
        const board = new MineSweeperBoard({ rows: 10, cols: 10, nrOfBombs: 20 });
        expect(board.isDetonated).toBe(false);
    });

    test('detonated on opening a cell with a bomb', () => {
        const board = new MineSweeperBoard({ rows: 10, cols: 10, nrOfBombs: 20 });
        board.cellGrid.flat().find(cell => cell.isBomb).open();
        expect(board.isDetonated).toBe(true);
    });

    test('is complete on opening all non bomb cells', () => {
        const board = new MineSweeperBoard({ rows: 10, cols: 10, nrOfBombs: 20 });
        let closedNonBomb: Cell;
        while (closedNonBomb = board.cellGrid.flat().find(cell => !cell.isOpen && !cell.isBomb)) {
            closedNonBomb.open();
        }
        expect(board.isCompleted).toBe(true);
    });

    test('opens all not flagged other bomb cells when a bomb cell is opened', () => {
        const board = new MineSweeperBoard({ rows: 10, cols: 10, nrOfBombs: 20 });
        const cells = board.cellGrid.flat();
        const flaggedBomb = cells.find(cell => cell.isBomb);
        flaggedBomb.toggleFlag();
        const bombCell = cells.find(cell => !cell.isFlagged && cell.isBomb);
        bombCell.open();
        expect(cells.filter(cell => !cell.isFlagged && cell.isBomb).every(cell => cell.isOpen)).toBe(true);
        expect(flaggedBomb.isOpen).toBe(false);
    });

    test('has correct adjacent cells for each cell', () => {
        const board = new MineSweeperBoard({ rows: 10, cols: 10, nrOfBombs: 20 });
        for(let row = 0; row < board.cellGrid.length; row++) {
            const cellRow = board.cellGrid[row];
            for(let col = 0; col < cellRow.length; col++) {
                const cell = cellRow[col];
                const adjacentCellsFromBoard = getAdjacentCellsFromBoard(board, {row, col});
                expect(cell.adjacentCells.length).toEqual(adjacentCellsFromBoard.length);
                expect(cell.adjacentCells.every((cell, index) => cell.adjacentCells.indexOf(cell) === index));
                expect(cell.adjacentCells.every(cell => adjacentCellsFromBoard.includes(cell)));
            }
        }
    });

    test('can listen to detonation', () => {
        const board = new MineSweeperBoard({ rows: 10, cols: 10, nrOfBombs: 20 });
        const testFn = jest.fn();
        board.isDetonated$.subscribe({
            next: isDetonated => {
                testFn(isDetonated)
            }
        });
        expect(testFn).not.toBeCalledWith(true);
        board.cellGrid.flat().find(cell => cell.isBomb).open();
        expect(testFn).toBeCalledWith(true);
    });
});

function getAdjacentCellsFromBoard(board: MineSweeperBoard, coordinates: {row: number, col: number}): Cell[] {
    const grid = board.cellGrid;
    const result: Cell[] = [];
    for (let row = coordinates.row - 1; row <= coordinates.row + 1; row++) {
        const gridRow = grid[row];
        if (!gridRow) {
            continue;
        }
        for (let col = coordinates.col - 1; col <= coordinates.col + 1; col++) {
            if (gridRow[col] && (row !== coordinates.row || col !== coordinates.col)) {
                result.push(gridRow[col]);
            }
        }
    }
    return result;
}