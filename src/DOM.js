import { newGame, computerPlacement } from "./gameboard-factory";

// Function that checks if the second player and start battle buttons have been pressed
function buttonClicker() {
  const secondPlayer = document.getElementById("add-second-player");
  const inputSecondPlayer = document.getElementById("player2");
  // If the add second player has been added then show the box to input a second player name
  secondPlayer.addEventListener("click", () => {
    event.preventDefault();
    secondPlayer.style.display = "none";
    inputSecondPlayer.style.display = "inline-block";
  });
  const startBattle = document.getElementById("submit");
  const launchScreen = document.getElementById("launch-screen");
  const player2Name = document.getElementById("player2");
  const player1Name = document.getElementById("player1");
  // When start battle has been pressed - if no name input then alert that a name is needed
  startBattle.addEventListener("click", () => {
    event.preventDefault();
    if (player1Name.value.trim() === "") {
      alert("Please input a name to battle!");
    } else {
      launchScreen.style.display = "none";
      if (player2Name.value.trim() === "") {
        singlePlayer(player1Name.value);
      } else twoPlayerPlacement(player1Name.value, player2Name.value);
    }
  });
}

function singlePlayer(playerName) {
  const singleGame = newGame();
  const playerOne = singleGame.player1;
  singleGame.player2 = computerPlacement(singleGame.player2);
  boatPlacement(playerOne, playerName);
}

function boatPlacement(player, playerName) {
  const playerPlacementScreen = document.getElementById("placement-screen");
  const title = document.getElementById("screen-title");
  title.innerHTML = `${playerName} - Place Your Ships!`;
  playerPlacementScreen.style.display = "grid";
  const boatConfigurations = [
    { type: "carrier", count: 1, length: 5 },
    { type: "battleship", count: 2, length: 4 },
    { type: "destroyer", count: 3, length: 3 },
    { type: "submarine", count: 4, length: 3 },
    { type: "patrol-boat", count: 5, length: 2 },
  ];
  placementSelector(player, boatConfigurations);
}

function placementSelector(player, boatConfigurations) {
  boatConfigurations.forEach((config) => {
    const boatElements = document.getElementsByClassName(config.type);
    const boatVisual = document.getElementsByClassName(`${config.type}-number`);

    updateBoatNoInPage(boatVisual, config.count);
    placeAndUpdateBoat(
      boatElements,
      config,
      config.length,
      boatVisual,
      player,
      boatConfigurations
    );
  });
}

function placeAndUpdateBoat(
  boatElements,
  boatNumber,
  boatLength,
  boatVisual,
  player,
  boatConfigurations
) {
  Array.from(boatElements).forEach((boat) => {
    const clickHandler = () => {
      if (boatNumber.count > 0) {
        console.log(
          `Placing boat of length ${boatLength}. Current count: ${boatNumber.count}`
        );
        placeBoat(boatLength, player, () => {
          boatNumber.count--;
          console.log(`Boat placed. New count: ${boatNumber.count}`);
          updateBoatNoInPage(boatVisual, boatNumber.count);
          checkAllBoatsPlaced(boatConfigurations);
        });
      }
    };
    boat.removeEventListener("click", clickHandler); // Ensure no duplicate listeners
    boat.addEventListener("click", clickHandler);
  });
}

function checkAllBoatsPlaced(boatConfigurations) {
  console.log(boatConfigurations);
  const allPlaced = boatConfigurations.every((config) => config.count === 0);
  if (allPlaced) {
    const completePlacementScreen =
      document.getElementById("complete-placement");
    const completePlacementButton = document.getElementById(
      "complete-placement-button"
    );
    console.log("test");
    completePlacementScreen.style.display = "flex";
    completePlacementButton.innerHTML = "Battle!";
    completePlacementButton.addEventListener("click", () => {});
  }
}

function updateBoatNoInPage(boatVisual, boatNumber) {
  Array.from(boatVisual).forEach((boat) => {
    boat.innerText = boatNumber;
    console.log(`Updated boat number display to: ${boatNumber}`);
  });
}

function placeBoat(length, player, updateBoatNumber) {
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
      [newj + length - 1, i],
      [newj - length + 1, i],
      [newj, i + length - 1],
      [newj, i - length + 1],
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
            const success = player.addShip(initialSelection, secondSelection);
            if (success) {
              generateBoatVisual(player.shipPositions);
              // Remove event listeners from possible end squares
              square.removeEventListener("click", selectEnd);
              updateBoatNumber();
            }
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
