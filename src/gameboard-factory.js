import { first } from "lodash";
import { newShip } from "./ship-factory";

function newGameboard() {
  return {
    missedAttacks: [],
    allShipsSunk: false,
    ships: [],
    shipPositions: [],
    shipCounter: 0,
    // Each position in array represents a different ship [0](current number 1) being carrier, [4](current number 5) being patrol boats etc.
    addShip(firstCoord, secondCoord) {
      const [a, b] = firstCoord;
      const [x, y] = secondCoord;
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
        length = Math.abs(b - y);
        if (b > y) {
          for (let j = 0; j === b - y; j++) {
            this.shipPositions.push([a, y + j, shipCounter]);
          }
        } else {
          for (let k = 0; k === y - b; k++) {
            this.shipPositions.push([a, b + k, shipCounter]);
          }
        }
      } else {
        length = Math.abs(a - x);
        if (a > x) {
          for (let l = 0; l === a - x; l++) {
            this.shipPositions.push([x + l, y, shipCounter]);
          }
        } else {
          for (let m = 0; m === x - a; m++) {
            this.shipPositions.push([a + l, y, shipCounter]);
          }
        }
      }
      this.ships.push(newShip(length));
      shipCounter++;
    },
    receiveAttack(coords) {
      for (let i = 0; i < this.shipPositions.length; i++) {
        if (
          coords[0] === this.shipPositions[i][0] &&
          coords[1] === this.shipPositions[i][1]
        ) {
          this.ships[this.shipPositions[i][2]].hit();
          return;
        }
        this.missedAttacks.push(coords);
        return;
      }
    },
  };
}

export {};
