import { first } from "lodash";
import { newShip } from "./ship-factory";

function newGameboard() {
  return {
    missedAttacks: [],
    allShipsSunk: false,
    ships: [],
    // Each position in array represents a different ship [0](current number 1) being carrier, [4](current number 5) being patrol boats etc.
    addShip(firstCoord, secondCoord) {
      const [a, b] = firstCoord;
      const [x, y] = secondCoord;
      let length;
      if (a === x) {
        length = Math.abs(b - y);
      } else {
        length = Math.abs(a - x);
      }
      this.ships.push(newShip(length));
    },
    receiveAttack(coords) {
      for (let i = 0; i < this.shipPositions.length; i++) {
        if (
          coords[0] === this.shipPositions[0] &&
          coords[1] === this.shipPositions[1]
        ) {
          return true;
        } else return false;
      }
    },
  };
}

export {};
