import { newShip } from "./src/ship-factory.js";

test("ship factory function", () => {
  expect(newShip(3)).toMatchObject({
    length: 3,
    hits: 0,
    sunk: false,
  });
});

test("ship factory function - 2", () => {
  expect(newShip(2)).toMatchObject({
    length: 2,
    hits: 0,
    sunk: false,
  });
});

test("ship factory function - 3", () => {
  expect(newShip(1)).toMatchObject({
    length: 1,
    hits: 0,
    sunk: false,
  });
});

test("hit boat - 1", () => {
  expect(newShip(3).hit()).toMatchObject({
    length: 3,
    hits: 1,
    sunk: false,
  });
});

test("hit boat -2", () => {
  expect(newShip(4).hit().hit().hit()).toMatchObject({
    length: 4,
    hits: 3,
    sunk: false,
  });
});

test("Sunk - 1", () => {
  expect(newShip(4).hit().hit().hit().hit()).toMatchObject({
    length: 4,
    hits: 4,
    sunk: true,
  });
});

test("Sunk - 2", () => {
  expect(newShip(1).hit()).toMatchObject({
    length: 1,
    hits: 1,
    sunk: true,
  });
});

test("Sunk - 3", () => {
  expect(newShip(3).hit()).toMatchObject({
    length: 3,
    hits: 1,
    sunk: false,
  });
});

// test('Creating player gameboard - empty', () => {
//     expect(newGameboard())
// })
