import { MineSweeperBoard } from "../classes/mine-sweeper-board";
import { IMineSweeperBoardService } from "./i-mine-sweeper-board.service";
import { IUserSettingsService } from "./i-user-settings.service";

export class MineSweeperBoardService implements IMineSweeperBoardService {

    constructor(private userSettingsService: IUserSettingsService) {

    }

    createBoard(): MineSweeperBoard {
        return new MineSweeperBoard(this.userSettingsService.getBoardSettings());
    }
}