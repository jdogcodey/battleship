import _ from "lodash";
import { testgame } from "./gameboard-factory.js";
import { testShip } from "./ship-factory.js";

function component() {
  const element = document.createElement("div");

  // Lodash, now imported by this script
  element.innerHTML = _.join(["Hello", "webpack"], " ");

  return element;
}

document.body.appendChild(component());

testgame();
testShip();
