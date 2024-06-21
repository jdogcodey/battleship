function newShip(length, hits, sunk) {
  return {
    length: length,
    hits: hits,
    sunk: sunk,
    hit() {
      this.hits += 1;
    },
  };
}

function isSunk(ship) {
  if (ship.hits === ship.length) return true;
  else return false;
}

export { newShip, isSunk };
