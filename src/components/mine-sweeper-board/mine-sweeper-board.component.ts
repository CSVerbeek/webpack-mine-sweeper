import { MineSweeperBoard } from "../../classes/mine-sweeper-board";
import { MineSweeperCellComponent } from "../mine-sweeper-cell/mine-sweeper-cell.component";

class MineSweeperBoardElement extends HTMLElement {
    onDetonate: () => void = () => { };

    private readonly rootDiv: HTMLDivElement;

    static attributes = {
        isDetonated: 'isdetonated',
        isCompleted: 'iscompleted'
    } as const;

    static get observedAttributes() {
        return Object.values(MineSweeperBoardElement.attributes);
    }

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        this.rootDiv = document.createElement('div');
        this.rootDiv.style.display = 'inline-block';
        this.rootDiv.style.borderWidth = '5px';
        this.rootDiv.style.borderColor = 'transparent';
        this.rootDiv.style.borderStyle = 'solid';
        shadow.appendChild(this.rootDiv);

    }

    attributeChangedCallback(_name: string, _oldValue: any, _newValue: any) {
        this.updateBoard();
    }

    private updateBoard() {
        const isDetonated = this.getAttribute(MineSweeperBoardElement.attributes.isDetonated) === '1';
        const isCompleted = this.getAttribute(MineSweeperBoardElement.attributes.isCompleted) === '1';

        if (isDetonated || isCompleted) {
            const noClickOverlay = document.createElement('div');
            noClickOverlay.style.width = '100%';
            noClickOverlay.style.height = '100%';
            noClickOverlay.style.position = 'absolute';
            noClickOverlay.style.top = '0';
            noClickOverlay.style.left = '0';
            this.rootDiv.style.borderColor = isDetonated ? 'red' : 'green';
            this.rootDiv.append(noClickOverlay);
        }
    }

    public addCells(cellComponentsRows: HTMLElement[][]) {
        cellComponentsRows.forEach(cellRow => {
            const cellRowDiv = document.createElement('div');
            this.rootDiv.appendChild(cellRowDiv);
            cellRow.forEach(cellElement => {
                cellRowDiv.appendChild(cellElement);
            });
        });
    }
}

export class MineSweeperBoardComponent {
    readonly element: MineSweeperBoardElement;
    readonly cellComponentsGrid: MineSweeperCellComponent[][];

    constructor(private board: MineSweeperBoard) {
        this.element = document.createElement('mine-sweeper-board') as MineSweeperBoardElement;
        this.element.setAttribute('isdetonated', '0');
        this.element.setAttribute('iscompleted', '0');
        this.cellComponentsGrid = this.board.cellGrid.map(cellRow => cellRow.map(cell => new MineSweeperCellComponent(cell)));
        this.element.addCells(this.cellComponentsGrid.map(cellRow => cellRow.map(cell => cell.element)));
        this.board.isDetonated$.subscribe({
            next: isDetonated => {
                this.element.setAttribute('isdetonated', isDetonated ? '1' : '0');
                if (isDetonated) {
                    this.markWronglyFlaggedCells();
                }
            }
        });
        this.board.isCompleted$.subscribe({
            next: isCompleted => {
                this.element.setAttribute('iscompleted', isCompleted ? '1' : '0');
            }
        });
    }

    private markWronglyFlaggedCells() {
        debugger;
        this.cellComponentsGrid.flat().forEach(cell => cell.markWronglyFlagged());
    }
}

customElements.define('mine-sweeper-board', MineSweeperBoardElement);