import { Cell } from "../../classes/cell";

class MineSweeperCellElement extends HTMLElement {
    onOpen: () => void = () => { };
    onToggleFlag: () => void = () => { };
    openAdjacentCells: () => void = () => { };

    private readonly rootDiv: HTMLDivElement;
    private readonly displayDiv: HTMLDivElement;

    static get observedAttributes() {
        return ['isopen', 'isflagged', 'isbomb', 'displayvalue'] as const;
    }

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        this.rootDiv = document.createElement('div');
        this.rootDiv.style.display = 'inline-block';
        this.rootDiv.style.width = '30px';
        this.rootDiv.style.height = '30px';
        this.rootDiv.style.backgroundColor = 'green';
        this.rootDiv.style.border = 'solid';
        this.rootDiv.style.borderWidth = '1px';
        this.rootDiv.style.borderColor = 'darkgreen';
        this.displayDiv = document.createElement('div');
        this.displayDiv.style.position = 'relative';
        this.displayDiv.style.width = '10px';
        this.displayDiv.style.height = '10px';
        this.displayDiv.style.textAlign = 'center';
        this.displayDiv.style.top = '10px';
        this.displayDiv.style.lineHeight = '10px';
        this.displayDiv.style.fontSize = '10px';
        this.displayDiv.style.margin = 'auto';
        this.displayDiv.innerHTML = '&nbsp;';
        this.rootDiv.appendChild(this.displayDiv);
        shadow.appendChild(this.rootDiv);

        this.addEventListener('click', _ => { this.onClick(); });
        this.addEventListener('contextmenu', event => { this.onRightClick(); event.preventDefault(); });
        this.addEventListener('dblclick', _ => { this.onDoubleClick(); });
    }

    private onClick() {
        this.onOpen();
    }

    private onRightClick() {
        this.onToggleFlag();
    }

    private onDoubleClick() {
        this.openAdjacentCells();
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        console.log('AttributeChanged', name, oldValue, newValue);
        this.updateCell();
    }

    private updateCell() {
        const isOpen = this.getAttribute('isopen') === '1';
        const isFlagged = this.getAttribute('isflagged') === '1';
        const isBomb = this.getAttribute('isbomb') === '1';
        const displayValue = this.getAttribute('displayvalue');

        console.log('Updating cell with ', isOpen, isFlagged, displayValue);

        if (isOpen) {
            if (isBomb) {
                this.rootDiv.style.backgroundColor = 'red';
                return;
            }
            this.rootDiv.style.backgroundColor = 'yellow';
            this.displayDiv.innerHTML = displayValue === '0' ? '&nbsp;' : displayValue;
            return;
        }

        if (isFlagged) {
            this.displayDiv.innerHTML = 'F';
        } else {
            this.displayDiv.innerHTML = '&nbsp;';
        }
    }

    markWronglyFlagged() {
        const isFlagged = this.getAttribute('isflagged') === '1';
        const isBomb = this.getAttribute('isbomb') === '1';

        if(isFlagged && !isBomb) {
            this.rootDiv.style.borderColor = 'red';
            this.rootDiv.style.color = 'red';
            this.rootDiv.style.fontWeight = 'bold';
        }
    }
}

export class MineSweeperCellComponent {
    readonly element: MineSweeperCellElement;
    constructor(private cell: Cell) {
        this.element = document.createElement('mine-sweeper-cell') as MineSweeperCellElement;
        this.element.setAttribute('isopen', '0');
        this.element.setAttribute('isflagged', '0');
        this.element.setAttribute('isbomb', this.cell.isBomb ? '1' : '0');
        this.element.setAttribute('displayvalue', `${this.cell.numberOfAdjacentBombs}`);
        this.element.onOpen = this.open.bind(this);
        this.element.onToggleFlag = this.toggleFlag.bind(this);
        this.element.openAdjacentCells = this.openAdjacentCells.bind(this);
        this.cell.isOpen$.subscribe({
            next: isOpen => {
                this.element.setAttribute('isopen', isOpen ? '1' : '0');
            }
        });
    }

    private open(): void {
        this.cell.open();
    }

    private toggleFlag(): void {
        this.cell.toggleFlag();
        this.element.setAttribute('isflagged', this.cell.isFlagged ? '1' : '0');
    }

    private openAdjacentCells(): void {
        this.cell.openAdjacentCells();
    }

    markWronglyFlagged(): void {
        if(this.cell.isWronglyFlagged) {
            this.element.markWronglyFlagged();
        }
    }
}

customElements.define('mine-sweeper-cell', MineSweeperCellElement);