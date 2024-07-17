import { first } from "lodash";
import { newShip } from "./ship-factory";

function newGameboard() {
  return {
    allShipsSunk: false,
    ships: [],
    shipPositions: createSquares(),
    shipCounter: 0,
    addShip(firstCoord, secondCoord) {
      console.log("Adding ship");
      console.log(firstCoord);
      console.log(secondCoord);
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
          console.log("horizontal ship");
          shipCoordinates.push([a, i]);
        }
      } else if (b === y) {
        // vertical ship
        for (let i = Math.min(a, x); i <= Math.max(a, x); i++) {
          console.log("vertical ship");
          shipCoordinates.push([i, b]);
        }
      } else {
        console.log("invalid ship placement");
        return; // Invalid ship placement
      }

      console.log(shipCoordinates[0]);

      // Check for overlapping ships
      for (let i = 0; i < shipCoordinates.length; i++) {
        console.log("checking for overlapping ship");
        const noTotal = shipCoordinates[i][0] * 10 + shipCoordinates[i][1];
        if (
          this.shipPositions[noTotal][0] === shipCoordinates[i][0] &&
          this.shipPositions[noTotal][1] === shipCoordinates[i][1] &&
          this.shipPositions[noTotal][3]
        ) {
          console.log("overlapping");
          return; // Overlapping so return without adding ship
        }
      }

      // // Check for overlapping ships
      // for (let i = 0; i < shipCoordinates.length; i++) {
      //   for (let j = 0; j < this.shipPositions.length; j++) {
      //     if (
      //       shipCoordinates[i][0] === this.shipPositions[j][0] &&
      //       shipCoordinates[i][1] === this.shipPositions[j][1]
      //     ) {
      //       return; // Overlapping, so return without adding ship
      //     }
      //   }
      // }

      for (let i = 0; i < shipCoordinates.length; i++) {
        const noTotal = shipCoordinates[i][0] * 10 + shipCoordinates[i][1];
        this.shipPositions[noTotal][0] = shipCoordinates[i][0];
        this.shipPositions[noTotal][1] = shipCoordinates[i][1];
        this.shipPositions[noTotal][2] = this.shipCounter;
        this.shipPositions[noTotal][3] = true;
      }

      // // Add ship coordinates
      // this.shipPositions.push(
      //   ...shipCoordinates.map((coords) => [
      //     coords[0],
      //     coords[1],
      //     this.shipCounter,
      //   ])
      // );

      this.ships.push(newShip(shipCoordinates.length)); // Use shipCoordinates.length as ship length
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
          coords[1] === this.shipPositions[noTotal][1] &&
          this.shipPositions[noTotal]
        ) {
          this.attacks.push(coords);
          this.shipPositions[noTotal][4] = true;
          this.ships[this.shipPositions[i][2]].hit();
          this.allShipsSunk = this.ships.every((ship) => ship.sunk);
          return;
        }
      }

      //     for (let i = 0; i < this.shipPositions.length; i++) {
      //       if (
      //         coords[0] === this.shipPositions[i][0] &&
      //         coords[1] === this.shipPositions[i][1]
      //       ) {
      //         this.ships[this.shipPositions[i][2]].hit();
      //         this.shipPositions.splice(i, 1);
      //         this.allShipsSunk = this.ships.every((ship) => ship.sunk);
      //         return;
      //       }
      //     }
      //     this.attacks.push(coords);
    },
  };
}

function createSquares() {
  const squareArray = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      squareArray.push([i, j, false, false, false]);
    }
  }
  return squareArray;
}

function newGame() {
  return {
    player1: newGameboard(),
    player2: newGameboard(),
    winner: null,
    gameOver() {
      if (this.player1.allShipsSunk) {
        this.winner = player2;
      } else if (this.player2.allShipsSunk) {
        this.winner = this.player1;
      }
    },
  };
}

function generateRandom(max) {
  return Math.floor(Math.random() * max);
}

function computerPlacement(computerGB) {
  function createLowerCoords() {
    return [generateRandom(10), generateRandom(10)];
  }

  function createShipCoords(length) {
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
        computerGB.addShip([a, b], [a, bOnTheGrid]);
      } else {
        computerGB.addShip([a, b], [aOnTheGrid, b]);
      }

      // Check if the ship was successfully added
      if (computerGB.shipCounter > initialShipCount) {
        shipAdded = true;
      }
    }
  }

  // Ship lengths as required
  const shipLengths = [5, 4, 4, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2];
  shipLengths.forEach((length) => createShipCoords(length));

  return computerGB;
}

export { newGameboard, newGame, computerPlacement, generateRandom };
