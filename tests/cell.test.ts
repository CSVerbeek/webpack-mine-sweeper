import { Cell } from "../src/classes/cell";

describe('Mine sweeper cell', () => {
    test('can be created without a bomb', () => {
        expect(new Cell(false).isBomb).toEqual(false);
    });

    test('can be created with a bomb', () => {
        expect(new Cell(true).isBomb).toEqual(true);
    });

    test('has a closed state after creation', () => {
        expect(new Cell(false).isOpen).toEqual(false);
    });
});