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

    test('detonated on opening a cell with a bomb', () => {
        const board = new MineSweeperBoard({ rows: 10, cols: 10, nrOfBombs: 20 });
        board.cellGrid.flat().find(cell => cell.isBomb).open();
        expect(board.isDetonated).toBe(true);
    });
});