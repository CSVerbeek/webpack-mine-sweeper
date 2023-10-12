import { IMineSweeperBoardService } from "../../services/i-mine-sweeper-board.service";
import { MineSweeperBoardComponent } from "../mine-sweeper-board/mine-sweeper-board.component";
import { MineSweeperCellComponent } from "../mine-sweeper-cell/mine-sweeper-cell.component";

export class AppComponent {
    readonly startButton: HTMLButtonElement;

    constructor(private boardService: IMineSweeperBoardService) {
        this.startButton = document.getElementById('start-button') as HTMLButtonElement;
        this.startButton.addEventListener('click', _ => {
            this.startGame();
        });
    }

    private startGame() {
        const board = this.boardService.createBoard();
        const boardWrapper = document.getElementById('board-wrapper');
        const boardComponent = new MineSweeperBoardComponent(board);
        boardWrapper.innerHTML = '';
        boardWrapper.appendChild(boardComponent.element);
    }
}