import _ from "lodash";
import { testgame } from "./gameboard-factory.js";
import { testShip } from "./ship-factory.js";
import { newGameboard } from "./gameboard-factory.js";

const testGameboard = newGameboard();
testGameboard.addShip([0, 0], [1, 0]);
testGameboard.addShip([1, 1], [5, 1]);
testGameboard.receiveAttack([1, 1]);
testGameboard.receiveAttack([2, 1]);
testGameboard.receiveAttack([3, 1]);
testGameboard.receiveAttack([4, 1]);
testGameboard.receiveAttack([5, 1]);
testGameboard.receiveAttack([4, 6]);
console.log(testGameboard.shipPositions);

console.log(testGameboard.ships);
console.log(testGameboard.shipPositions);
console.log(testGameboard.missedAttacks);
