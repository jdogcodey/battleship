function newShip(length, hits, sunk) {
  return {
    length: length,
    hits: hits,
    sunk: sunk,
  };
}

function hit(ship) {
  ship.hits += 1;
  return ship;
}

function isSunk(ship) {
  if (ship.hits === ship.length) return true;
  else return false;
}

export { newShip, hit, isSunk };
