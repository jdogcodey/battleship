import _ from "lodash";
import { testgame } from "./gameboard-factory.js";
import { testShip } from "./ship-factory.js";
import { newGameboard } from "./gameboard-factory.js";

const testGameboard = newGameboard();
testGameboard.addShip([0, 0], [1, 0]);
testGameboard.addShip([1, 1], [5, 1]);

console.log(testGameboard.ships);
