function newGameboard() {
  return {
    missedAttacks: [],
    allShipsSunk: false,
    ships: [],
    // Each position in array represents a different ship [0] being carrier, [5] being patrol boats etc.
    shipsToPlace: [1, 2, 3, 4, 5],
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
