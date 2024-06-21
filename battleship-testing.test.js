import { newShip, isSunk } from "./src/ship-factory.js";

test("ship factory function", () => {
  expect(newShip(3, 0, false)).toStrictEqual({
    length: 3,
    hits: 0,
    sunk: false,
  });
});

test("ship factory function - 2", () => {
  expect(newShip(2, 1, false)).toStrictEqual({
    length: 2,
    hits: 1,
    sunk: false,
  });
});

test("ship factory function - 3", () => {
  expect(newShip(1, 1, true)).toStrictEqual({
    length: 1,
    hits: 1,
    sunk: true,
  });
});

test("hit boat - 1", () => {
  expect(hit(newShip(3, 1, false))).toStrictEqual({
    length: 3,
    hits: 2,
    sunk: false,
  });
});

test("hit boat -2", () => {
  expect(hit(hit(hit(newShip(4, 0, false))))).toStrictEqual({
    length: 4,
    hits: 3,
    sunk: false,
  });
});

test("Sunk - 1", () => {
  expect(isSunk(newShip(4, 4, false))).toBe(true);
});

test("Sunk - 2", () => {
  expect(isSunk(newShip(1, 1, false))).toBe(true);
});

test("Sunk - 3", () => {
  expect(isSunk(newShip(3, 1, false))).toBe(false);
});

// test('Creating player gameboard - empty', () => {
//     expect(newGameboard())
// })
