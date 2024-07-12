import { newGame, computerPlacement } from "./gameboard-factory";

// Function that sets up event listeners for the second player and start battle buttons
function buttonClicker() {
  const secondPlayer = document.getElementById("add-second-player");
  const inputSecondPlayer = document.getElementById("player2");

  // If the add second player button is clicked, show the input field for the second player's name
  secondPlayer.addEventListener("click", (event) => {
    event.preventDefault();
    secondPlayer.style.display = "none";
    inputSecondPlayer.style.display = "inline-block";
  });

  const startBattle = document.getElementById("submit");
  const launchScreen = document.getElementById("launch-screen");
  const player2Name = document.getElementById("player2");
  const player1Name = document.getElementById("player1");

  // When the start battle button is clicked, check if the player names are provided and proceed accordingly
  startBattle.addEventListener("click", (event) => {
    event.preventDefault();
    if (player1Name.value.trim() === "") {
      alert("Please input a name to battle!");
    } else {
      launchScreen.style.display = "none";
      if (player2Name.value.trim() === "") {
        singlePlayer(player1Name.value);
      } else {
        twoPlayer(player1Name.value, player2Name.value);
      }
    }
  });
}

// Function to start a single-player game
function singlePlayer(playerName) {
  const singleGame = newGame(); // Create a new game instance
  const playerOne = singleGame.player1;
  singleGame.player2 = computerPlacement(singleGame.player2); // Set up computer as the second player
  boatPlacement(playerOne, playerName, () => {
    // Start the boat placement phase
    const completePlacementScreen =
      document.getElementById("complete-placement");
    const completePlacementButton = document.getElementById(
      "complete-placement-button"
    );
    completePlacementScreen.style.display = "grid";
    completePlacementButton.innerHTML = "Battle!";
    completePlacementButton.addEventListener("click", () => {});
  });
}

// Function to start a two-player game
function twoPlayer(player1Name, player2Name) {
  const twoPlayerGame = newGame();
  const playerOne = twoPlayerGame.player1;
  const playerTwo = twoPlayerGame.player2;
  boatPlacement(playerOne, player1Name, () => {
    const squares = document.getElementsByClassName("blank-space");
    Array.from(squares).forEach((square) => {
      square.style.backgroundColor = "#EDF2F4";
    });
    switchPlayer(
      "placement-screen",
      `Pass to ${player2Name} to place Ships!`,
      `${player2Name} ready`,
      () => {
        const placementScreen = document.getElementById("placement-screen");
        const switchTeamScreen = document.getElementById("switch-team-screen");
        placementScreen.style.display = "grid";
        switchTeamScreen.style.display = "none";
        boatPlacement(playerTwo, player2Name, () => {
          switchPlayer(
            "placement-screen",
            `Pass to ${player1Name} to Battle!`,
            `${player1Name} ready`
          );
        });
      }
    );
  });
}

// Function for the switch player screen
function switchPlayer(previousScreen, switchTitle, switchMessage, buttonFunc) {
  const prevScreen = document.getElementById(previousScreen);
  prevScreen.style.display = "none";
  const switchTeamScreen = document.getElementById("switch-team-screen");
  switchTeamScreen.style.display = "grid";
  const switchTeamTitle = document.getElementById("switch-team-title");
  switchTeamTitle.innerHTML = switchTitle;
  const switchTeamButton = document.getElementById("switch-button");
  switchTeamButton.innerHTML = switchMessage;
  switchTeamButton.addEventListener("click", buttonFunc);
}

// Function to handle the boat placement phase for a player
function boatPlacement(player, playerName, callback) {
  const playerPlacementScreen = document.getElementById("placement-screen");
  const title = document.getElementById("screen-title");
  title.innerHTML = `${playerName} - Place Your Ships!`;
  playerPlacementScreen.style.display = "grid";

  // Define the configurations for each type of boat
  const boatConfigurations = [
    { type: "carrier", count: 1, length: 5 },
    { type: "battleship", count: 2, length: 4 },
    { type: "destroyer", count: 3, length: 3 },
    { type: "submarine", count: 4, length: 3 },
    { type: "patrol-boat", count: 5, length: 2 },
  ];

  placementSelector(player, boatConfigurations, callback); // Start the placement selector
}

// Function to initialize the placement selector for each type of boat
function placementSelector(player, boatConfigurations, callback) {
  boatConfigurations.forEach((config) => {
    const boatElements = document.getElementsByClassName(config.type);
    const boatVisual = document.getElementsByClassName(`${config.type}-number`);

    updateBoatNoInPage(boatVisual, config.count); // Update the UI with the number of boats
    placeAndUpdateBoat(
      boatElements,
      config,
      config.length,
      boatVisual,
      player,
      boatConfigurations,
      callback
    ); // Set up the event listeners for boat placement
  });
}

// Function to handle the placement and updating of boats
function placeAndUpdateBoat(
  boatElements,
  boatNumber,
  boatLength,
  boatVisual,
  player,
  boatConfigurations,
  callback
) {
  Array.from(boatElements).forEach((boat) => {
    const clickHandler = () => {
      if (boatNumber.count > 0) {
        placeBoat(boatLength, player, () => {
          boatNumber.count--;
          updateBoatNoInPage(boatVisual, boatNumber.count); // Update the UI with the new count
          if (checkAllBoatsPlaced(boatConfigurations)) callback(); // Call the callback if all boats have been placed
        });
      }
    };
    boat.removeEventListener("click", clickHandler); // Ensure no duplicate listeners
    boat.addEventListener("click", clickHandler, false); // Add click listener for placing boats
  });
}

// Function to check if all boats have been placed
function checkAllBoatsPlaced(boatConfigurations) {
  return boatConfigurations.every((config) => config.count === 0);
}

// Function to update the UI with the number of remaining boats
function updateBoatNoInPage(boatVisual, boatNumber) {
  Array.from(boatVisual).forEach((boat) => {
    boat.innerText = boatNumber;
  });
}

// Function to handle the placement of a boat on the board
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

    // Remove invalid end positions that overlap existing ships
    const validEnds = possibleEnd.filter((coord) => {
      const xRange = [
        ...Array(Math.abs(coord[0] - initialSelection[0]) + 1).keys(),
      ].map((x) => Math.min(coord[0], initialSelection[0]) + x);
      const yRange = [
        ...Array(Math.abs(coord[1] - initialSelection[1]) + 1).keys(),
      ].map((y) => Math.min(coord[1], initialSelection[1]) + y);

      const isValid = xRange.every((x) =>
        yRange.every(
          (y) =>
            x >= 0 &&
            x < 10 &&
            y >= 0 &&
            y < 10 &&
            !player.shipPositions.some((pos) => pos[0] === x && pos[1] === y)
        )
      );

      return isValid;
    });

    if (validEnds.length === 0) {
      alert(
        "No valid placement from this starting point. Please select a different starting point."
      );
      event.target.style.backgroundColor = ""; // Reset the initial selection color
      return; // Exit without decrementing boat count or updating UI
    }

    validEnds.forEach((coord) => {
      const squareToRead = document.getElementsByClassName(
        `${coord[0] + 10} ${coord[1]}`
      );
      Array.from(squareToRead).forEach((square) => {
        square.style.backgroundColor = "#8D99AE"; // Highlight valid end positions
        const selectEnd = function (event) {
          event.preventDefault();
          secondSelection = [coord[0], coord[1]];
          const success = player.addShip(initialSelection, secondSelection);
          if (success) {
            generateBoatVisual(player.shipPositions); // Visualize the placed boats
            square.removeEventListener("click", selectEnd);
            updateBoatNumber(); // Update the number of remaining boats
          }
        };
        square.addEventListener("click", selectEnd); // Add click listener for selecting end position
      });
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

// Function to visualize the placed boats on the board
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
