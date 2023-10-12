import { Cell } from "./classes/cell";
import { BoardSettings } from "./classes/mine-sweeper-board";
import { AppComponent } from "./components/app/app.component";
import { MineSweeperCellComponent } from "./components/mine-sweeper-cell/mine-sweeper-cell.component";
import { IMineSweeperBoardService } from "./services/i-mine-sweeper-board.service";
import { IUserSettingsService } from "./services/i-user-settings.service";
import { MineSweeperBoardService } from "./services/mine-sweeper-board.service";

export default class CompositionRoot {
    composeApplication(): AppComponent {
        const userSettingsService: IUserSettingsService = {
            getBoardSettings: function (): BoardSettings {
                return { rows: 10, cols: 20, nrOfBombs: 50 };
            }
        }
        const mineSweeperBoardService: IMineSweeperBoardService = new MineSweeperBoardService(userSettingsService);
        return new AppComponent(mineSweeperBoardService);
    }

    addWebComponents() {
        const cellComponent = new MineSweeperCellComponent(new Cell(false));
        document.getElementById('board-wrapper').appendChild(cellComponent.element);
        const cellComponent2 = new MineSweeperCellComponent(new Cell(false));
        document.getElementById('board-wrapper').appendChild(cellComponent2.element);
    }
}