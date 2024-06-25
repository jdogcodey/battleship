import _ from "lodash";
import { testgame } from "./gameboard-factory.js";
import { testShip } from "./ship-factory.js";
import {
  newGameboard,
  newGame,
  computerPlacement,
} from "./gameboard-factory.js";
import { buttonClicker } from "./DOM.js";

buttonClicker();

const testGame = newGame("player1", "player2");
computerPlacement(testGame.player1);
console.log(testGame);

// const testGameboard = newGameboard();
// testGameboard.addShip([0, 0], [1, 0]);
// testGameboard.addShip([5, 3], [5, 7]);
// testGameboard.receiveAttack([1, 1]);
// testGameboard.receiveAttack([2, 1]);
// testGameboard.receiveAttack([3, 1]);
// testGameboard.receiveAttack([4, 1]);
// testGameboard.receiveAttack([5, 1]);
// testGameboard.receiveAttack([0, 0]);
// testGameboard.receiveAttack([1, 0]);
// testGameboard.receiveAttack([4, 6]);
// testGameboard.addShip([4, 7], [8, 7]);
// console.log(testGameboard.shipCounter);

// console.log(testGameboard.ships);
// console.log(testGameboard.shipPositions);
// console.log(testGameboard.missedAttacks);
// console.log(testGameboard);

// const testGame = newGame("Player1test", "Player2test");
// console.log(testGame);
