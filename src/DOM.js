import { newGame, computerPlacement } from "./gameboard-factory";

function buttonClicker() {
  const secondPlayer = document.getElementById("add-second-player");
  const inputSecondPlayer = document.getElementById("player2");
  secondPlayer.addEventListener("click", () => {
    event.preventDefault();
    secondPlayer.style.display = "none";
    inputSecondPlayer.style.display = "inline-block";
  });
  const startBattle = document.getElementById("submit");
  const launchScreen = document.getElementById("launch-screen");
  const player2Name = document.getElementById("player2");
  startBattle.addEventListener("click", () => {
    event.preventDefault();
    launchScreen.style.display = "none";
    if (player2Name.value !== null) {
      singlePlayer();
    } else twoPlayerPlacement();
  });
}

function singlePlayer() {
  const playerPlacementScreen = document.getElementById("player1-placement");
  playerPlacementScreen.style.display = "grid";
  const singleGame = newGame();
  const playerOne = singleGame.player1;
  singleGame.player2 = computerPlacement(singleGame.player2);
  placementSelector(playerOne);
}

function placementSelector(player) {
  const carrierElements = document.getElementsByClassName("carrier");
  const battleshipElements = document.getElementsByClassName("battleship");
  const destroyerElements = document.getElementsByClassName("destroyer");
  const submarineElements = document.getElementsByClassName("submarine");
  const patrolBoatElements = document.getElementsByClassName("patrol-boat");
  const carrierVisual = document.getElementsByClassName("carrier-number");
  const battleshipVisual = document.getElementsByClassName("battleship-number");
  const destroyerVisual = document.getElementsByClassName("destroyer-number");
  const submarineVisual = document.getElementsByClassName("submarine-number");
  const patrolBoatVisual =
    document.getElementsByClassName("patrol-boat-number");
  let carrierNumber = 1;
  let battleshipNumber = 2;
  let destroyerNumber = 3;
  let submarineNumber = 4;
  let patrolBoatNumber = 5;
  updateBoatNoInPage(carrierVisual, carrierNumber);
  updateBoatNoInPage(battleshipVisual, battleshipNumber);
  updateBoatNoInPage(destroyerVisual, destroyerNumber);
  updateBoatNoInPage(submarineVisual, submarineNumber);
  updateBoatNoInPage(patrolBoatVisual, patrolBoatNumber);
  Array.from(carrierElements).forEach((carrier) => {
    carrier.addEventListener("click", () => {
      if (carrierNumber > 0) {
        carrierNumber = placeBoat(carrierNumber, 5, player);
      }
    });
  });
  Array.from(battleshipElements).forEach((battleship) => {
    battleship.addEventListener("click", () => {
      if (battleshipNumber > 0) {
        battleshipNumber = placeBoat(battleshipNumber, 4, player);
      }
    });
  });
  Array.from(destroyerElements).forEach((destroyer) => {
    destroyer.addEventListener("click", () => {
      if (destroyerNumber > 0) {
        destroyerNumber = placeBoat(destroyerNumber, 3, player);
      }
    });
  });
  Array.from(submarineElements).forEach((submarine) => {
    submarine.addEventListener("click", () => {
      if (submarineNumber > 0) {
        submarineNumber = placeBoat(submarineNumber, 3, player);
      }
    });
  });
  Array.from(patrolBoatElements).forEach((patrolBoat) => {
    patrolBoat.addEventListener("click", () => {
      if (patrolBoatNumber > 0) {
        patrolBoatNumber = placeBoat(patrolBoatNumber, 2, player);
      }
    });
  });
}

function updateBoatNoInPage(boatVisual, boatNumber) {
  Array.from(boatVisual).forEach((boat) => {
    boat.innerText = boatNumber;
  });
}

function placeBoat(noOfBoats, length, player) {
  let initialSelection;
  let secondSelection;

  // Store references to the event listeners
  const eventListeners = {};

  function clickBox(i, j, event) {
    event.preventDefault();

    // Remove all click listeners
    for (let m = 0; m < 10; m++) {
      for (let n = 10; n < 20; n++) {
        const squareToRemove = document.getElementsByClassName(`${n} ${m}`);
        Array.from(squareToRemove).forEach((square) => {
          const listener = eventListeners[`${n}-${m}`];
          if (listener) {
            square.removeEventListener("click", listener);
          }
        });
      }
    }

    const newj = j - 10;
    initialSelection = [newj, i];
    event.target.style.backgroundColor = "#EF233C";

    const possibleEnd = [
      [newj + length, i],
      [newj - length, i],
      [newj, i + length],
      [newj, i - length],
    ];

    possibleEnd.forEach((coord) => {
      if (
        coord[0] >= 0 &&
        coord[0] < 10 &&
        coord[1] >= 0 &&
        coord[1] < 10 &&
        !player.shipPositions.some(
          (pos) => pos[0] === coord[0] && pos[1] === coord[1]
        )
      ) {
        const squareToRead = document.getElementsByClassName(
          `${coord[0] + 10} ${coord[1]}`
        );
        Array.from(squareToRead).forEach((square) => {
          square.style.backgroundColor = "#8D99AE";
          const selectEnd = function (event) {
            event.preventDefault();
            secondSelection = [coord[0], coord[1]];
            player.addShip(initialSelection, secondSelection);
            generateBoatVisual(player.shipPositions);
            // Remove event listeners from possible end squares
            square.removeEventListener("click", selectEnd);
            return noOfBoats--;
          };
          square.addEventListener("click", selectEnd);
        });
      }
    });
  }

  for (let i = 0; i < 10; i++) {
    for (let j = 10; j < 20; j++) {
      const square = document.getElementsByClassName(`${j} ${i}`);
      Array.from(square).forEach((square) => {
        const listener = (event) => clickBox(i, j, event);
        eventListeners[`${j}-${i}`] = listener;
        square.addEventListener("click", listener, false);
      });
    }
  }
}

function generateBoatVisual(shipPositions) {
  for (let i = 0; i < 10; i++) {
    for (let j = 10; j < 20; j++) {
      const squareToClearBackground = document.getElementsByClassName(
        `${j} ${i}`
      );
      Array.from(squareToClearBackground).forEach((squareToClearBackground) => {
        squareToClearBackground.style.backgroundColor = "#EDF2F4";
      });
    }
  }
  shipPositions.forEach(([a, b]) => {
    const squareToColour = document.getElementsByClassName(`${a + 10} ${b}`);
    Array.from(squareToColour).forEach((squareToColour) => {
      squareToColour.style.backgroundColor = "#2B2D42";
    });
  });
}

export { buttonClicker };
