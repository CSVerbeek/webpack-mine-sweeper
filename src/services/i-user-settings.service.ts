import { BoardSettings } from "../classes/mine-sweeper-board";

export interface IUserSettingsService {
    getBoardSettings(): BoardSettings;
}