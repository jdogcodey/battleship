import { newShip } from "./src/ship-factory.js";
import { newGameboard } from "./src/gameboard-factory.js";

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

const testGameboard = newGameboard();
testGameboard.addShip([0, 0], [1, 0]);
testGameboard.addShip([1, 1], [5, 1]);
testGameboard.addShip([4, 1], [1, 1]);

test("Creating player gameboard - one ship", () => {
  expect(testGameboard.ships[0].length).toBe(2);
});

test("Creating player gameboard - bigger ship", () => {
  expect(testGameboard.ships[1].length).toBe(5);
});

test("Creating player gameboard - reverse ship", () => {
  expect(testGameboard.ships[2].length).toBe(4);
});
