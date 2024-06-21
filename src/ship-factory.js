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

console.log(newShip(3, 2, false));

export { newShip, isSunk };
