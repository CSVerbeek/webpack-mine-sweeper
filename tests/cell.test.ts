import { Cell } from "../src/classes/cell";

describe('Mine sweeper cell', () => {
    test('can be created without a bomb', () => {
        expect(new Cell().isBomb).toEqual(false);
    });
});