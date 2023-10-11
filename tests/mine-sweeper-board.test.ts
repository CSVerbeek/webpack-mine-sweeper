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
});