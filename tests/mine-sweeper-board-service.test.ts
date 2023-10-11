import { BoardSettings } from "../src/classes/mine-sweeper-board";
import { IMineSweeperBoardService } from "../src/services/i-mine-sweeper-board.service";
import { IUserSettingsService } from "../src/services/i-user-settings.service";
import { MineSweeperBoardService } from "../src/services/mine-sweeper-board.service";

describe('Mine swepper board service', () => {
    let userSettingsService: IUserSettingsService;
    let mineSweeperBoardService: IMineSweeperBoardService;

    beforeEach(() => {
        userSettingsService = {
            getBoardSettings(): BoardSettings {
                return { rows: 10, cols: 20, nrOfBombs: 40 };
            }
        };

        mineSweeperBoardService = new MineSweeperBoardService(userSettingsService);
    });

    test('should create board based on user settings', () => {
        const spyFn = jest.spyOn(userSettingsService, 'getBoardSettings');
        mineSweeperBoardService.createBoard();
        expect(spyFn).toBeCalledTimes(1);
    });
});