import { first } from "lodash";
import { newShip } from "./ship-factory";

function newGameboard() {
  return {
    missedAttacks: [],
    allShipsSunk: false,
    ships: [],
    shipPositions: [],
    shipCounter: 0,
    addShip(firstCoord, secondCoord) {
      const [a, b] = firstCoord;
      const [x, y] = secondCoord;
      const shipCoordinates = [];
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
      let length;
      if (a === x) {
        length = Math.abs(b - y) + 1;
        if (b > y) {
          for (let j = 0; j <= b - y; j++) {
            this.createCoords(shipCoordinates, a, y + j);
          }
        } else {
          for (let k = 0; k <= y - b; k++) {
            this.createCoords(shipCoordinates, a, b + k);
          }
        }
      } else {
        length = Math.abs(a - x) + 1;
        if (a > x) {
          for (let l = 0; l <= a - x; l++) {
            this.createCoords(shipCoordinates, x + l, y);
          }
        } else {
          for (let m = 0; m <= x - a; m++) {
            this.createCoords(shipCoordinates, a + m, y);
          }
        }
      }
      for (let o = 0; o < shipCoordinates.length; o++) {
        for (let p = 0; p < this.shipPositions.length; p++) {
          if (
            shipCoordinates[o][0] === this.shipPositions[p][0] &&
            shipCoordinates[o][1] === this.shipPositions[p][1]
          ) {
            return;
          }
        }
      }
      for (let q = 0; q < shipCoordinates.length; q++) {
        const thisShipCoords = shipCoordinates[q];
        this.shipPositions.push([
          thisShipCoords[0],
          thisShipCoords[1],
          this.shipCounter,
        ]);
      }
      this.ships.push(newShip(length));
      this.shipCounter++;
    },
    createCoords(array, firstVal, secondVal) {
      array.push([firstVal, secondVal, this.shipCounter]);
    },
    receiveAttack(coords) {
      for (let i = 0; i < this.shipPositions.length; i++) {
        if (
          coords[0] === this.shipPositions[i][0] &&
          coords[1] === this.shipPositions[i][1]
        ) {
          this.ships[this.shipPositions[i][2]].hit();
          this.shipPositions.splice(i, 1);
          for (let n = 0; n < this.ships.length; n++) {
            if (this.ships[n].sunk === false) return;
            else {
              this.allShipsSunk = true;
            }
          }
          return;
        }
      }
      this.missedAttacks.push(coords);
    },
  };
}

function newGame(player1, player2) {
  return {
    [player1]: newGameboard(),
    [player2]: newGameboard(),
    winner: null,
    gameOver() {
      if (this.player1.allShipsSunk) {
        this.winner = this.player2;
      } else if (this.player2.allShipsSunk) {
        this.winner = this.player1;
      }
    },
  };
}

function computerPlacement(computerGB) {
  function generateRandom(max) {
    return Math.floor(Math.random() * max);
  }
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
        computerGB.addShip([a, b], [aOnTheGrid, b]);
      } else {
        computerGB.addShip([a, b], [a, bOnTheGrid]);
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
}

export { newGameboard, newGame, computerPlacement };
