import { MineSweeperBoard } from "../classes/mine-sweeper-board";

export interface IMineSweeperBoardService {
    createBoard(): MineSweeperBoard;
}