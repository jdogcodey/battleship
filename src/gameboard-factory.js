import { first } from "lodash";
import { newShip } from "./ship-factory";

function newGameboard() {
  return {
    playerName: null,
    allShipsSunk: false,
    ships: [],
    shipPositions: createSquares(),
    shipCounter: 0,
    addShip(firstCoord, secondCoord, type) {
      const [a, b] = firstCoord;
      const [x, y] = secondCoord;
      let shipCoordinates = [];

      // Boundary check
      if (
        a > 9 ||
        b > 9 ||
        x > 9 ||
        y > 9 ||
        a < 0 ||
        b < 0 ||
        x < 0 ||
        y < 0
      ) {
        return;
      }

      if (a === x) {
        // horizontal ship
        for (let i = Math.min(b, y); i <= Math.max(b, y); i++) {
          shipCoordinates.push([a, i]);
        }
      } else if (b === y) {
        // vertical ship
        for (let i = Math.min(a, x); i <= Math.max(a, x); i++) {
          shipCoordinates.push([i, b]);
        }
      } else {
        return; // Invalid ship placement
      }

      // Check for overlapping ships
      for (let i = 0; i < shipCoordinates.length; i++) {
        const noTotal = shipCoordinates[i][0] * 10 + shipCoordinates[i][1];
        if (
          this.shipPositions[noTotal][0] === shipCoordinates[i][0] &&
          this.shipPositions[noTotal][1] === shipCoordinates[i][1] &&
          this.shipPositions[noTotal][3]
        ) {
          return; // Overlapping so return without adding ship
        }
      }

      for (let i = 0; i < shipCoordinates.length; i++) {
        const noTotal = shipCoordinates[i][0] * 10 + shipCoordinates[i][1];
        this.shipPositions[noTotal][0] = shipCoordinates[i][0];
        this.shipPositions[noTotal][1] = shipCoordinates[i][1];
        this.shipPositions[noTotal][2] = this.shipCounter;
        this.shipPositions[noTotal][3] = true;
      }

      this.ships.push(newShip(shipCoordinates.length, type)); // Use shipCoordinates.length as ship length
      this.shipCounter++;
      return true;
    },
    createCoords(array, firstVal, secondVal) {
      array.push([firstVal, secondVal, this.shipCounter]);
    },
    receiveAttack(coords) {
      const noTotal = coords[0] * 10 + coords[1];
      for (let i = 0; i < this.shipPositions.length; i++) {
        if (
          coords[0] === this.shipPositions[noTotal][0] &&
          coords[1] === this.shipPositions[noTotal][1]
        ) {
          // this.attacks.push(coords);
          this.shipPositions[noTotal][4] = true;
          const shipIndex = this.shipPositions[noTotal][2];
          if (shipIndex !== false) {
            this.ships[shipIndex].hit();
          }

          this.allShipsSunk = this.ships.every((ship) => ship.sunk);
          return;
        }
      }
    },
  };
}

function createSquares() {
  const squareArray = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      squareArray.push([
        i,
        j,
        false, // Number within the ship array of this ship
        false, // Boat placed on this square
        false, // Hit on this square
        false, // Is this square sunk?
      ]);
    }
  }
  return squareArray;
}

function newGame() {
  return {
    player1: newGameboard(),
    player2: newGameboard(),
  };
}

function generateRandom(max) {
  return Math.floor(Math.random() * max);
}

function computerPlacement(computerGB) {
  function createLowerCoords() {
    return [generateRandom(10), generateRandom(10)];
  }

  function createShipCoords(length, type) {
    let shipAdded = false;
    while (!shipAdded) {
      const direction = generateRandom(2);
      const [a, b] = createLowerCoords();
      let aOnTheGrid, bOnTheGrid;

      if (direction === 0) {
        // horizontal
        aOnTheGrid = a;
        bOnTheGrid = b + length - 1;
        if (bOnTheGrid > 9) {
          bOnTheGrid = b - length + 1;
        }
      } else {
        // vertical
        aOnTheGrid = a + length - 1;
        bOnTheGrid = b;
        if (aOnTheGrid > 9) {
          aOnTheGrid = a - length + 1;
        }
      }

      const initialShipCount = computerGB.shipCounter;
      if (direction === 0) {
        computerGB.addShip([a, b], [a, bOnTheGrid], type);
      } else {
        computerGB.addShip([a, b], [aOnTheGrid, b], type);
      }

      // Check if the ship was successfully added
      if (computerGB.shipCounter > initialShipCount) {
        shipAdded = true;
      }
    }
  }

  // Ship lengths as required
  const shipLengths = [
    [5, "Carrier"],
    [4, "Battleship"],
    [4, "Battleship"],
    [3, "Destroyer"],
    [3, "Destroyer"],
    [3, "Destroyer"],
    [3, "Submarine"],
    [3, "Submarine"],
    [3, "Submarine"],
    [2, "Patrol-Boat"],
    [2, "Patrol-Boat"],
    [2, "Patrol-Boat"],
    [2, "Patrol-Boat"],
    [2, "Patrol-Boat"],
  ];
  shipLengths.forEach(([length, type]) => createShipCoords(length, type));

  return computerGB;
}

export { newGameboard, newGame, computerPlacement, generateRandom };
