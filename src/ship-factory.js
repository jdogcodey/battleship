function newShip(length) {
  return {
    length: length,
    hits: 0,
    sunk: false,
    isSunk() {
      if (this.hits === this.length) {
        this.sunk = true;
      }
    },
    hit() {
      this.hits += 1;
      this.isSunk();
      return this;
    },
  };
}

export { newShip };
