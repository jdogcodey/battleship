import {
  newGame,
  computerPlacement,
  generateRandom,
} from "./gameboard-factory";

// Function that sets up event listeners for the second player and start battle buttons
function buttonClicker() {
  secondPlayerButtonClick();
  startBattleButtonClick();
}

function secondPlayerButtonClick() {
  const secondPlayer = document.getElementById("add-second-player");
  const inputSecondPlayer = document.getElementById("player2");

  // If the add second player button is clicked, show the input field for the second player's name
  secondPlayer.addEventListener("click", (event) => {
    event.preventDefault();
    secondPlayer.style.display = "none";
    inputSecondPlayer.style.display = "inline-block";
  });
}

function startBattleButtonClick() {
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
async function singlePlayer(playerName) {
  const singleGame = newGame(); // Create a new game instance

  //Rename players for ease of use
  let playerOne = singleGame.player1;
  let playerTwo = singleGame.player2;

  // Computer place boats for playerTwo
  playerTwo = computerPlacement(playerTwo);

  // Name both players
  addNamesToGameboards(playerOne, playerName, playerTwo, "The Computer");

  // Run through the placement of ships
  const boatPlacement = await placeAllBoats(playerOne, `Battle!`);

  if (boatPlacement) {
    launchBattle();
    updateTitle(`Battle!`);
    while (!isGameWon(singleGame)) {
      await playRound(playerOne, playerTwo, singleGame, 1);
      removeAllEventListeners();
    }
    winner(singleGame);
  }
}

function placeAllBoats(player, buttonText) {
  return new Promise((resolve) => {
    // Open the placement screen and change title
    openPlacementScreen(`${player.playerName} - Place Your Ships!`);

    // Save the configurations of all different types of boat
    const boatConfig = boatConfigArray();

    //Update the boats in the table
    updateBoatNoInPage(boatConfig);

    // Start function to place the boats
    const placeBoats = boatPlacementScreen(boatConfig, player);

    // Complete Placement Button
    placeBoats.then(() => {
      const completePlacementScreen =
        document.getElementById("complete-placement");
      const completePlacementButton = document.getElementById(
        "complete-placement-button"
      );
      completePlacementScreen.style.display = "grid";
      completePlacementButton.innerHTML = buttonText;
      completePlacementButton.addEventListener("click", () => {
        resolve(true);
      });
    });
  });
}

function boatConfigArray() {
  return [
    { type: "Carrier", count: 1, length: 5 },
    { type: "Battleship", count: 2, length: 4 },
    { type: "Destroyer", count: 3, length: 3 },
    { type: "Submarine", count: 4, length: 3 },
    { type: "Patrol-Boat", count: 5, length: 2 },
  ];
}

function openPlacementScreen(text) {
  const playerPlacementScreen = document.getElementById("placement-screen");
  updateTitle(text);
  playerPlacementScreen.style.display = "grid";
}

function addNamesToGameboards(player1, player1Name, player2, player2Name) {
  player1.playerName = player1Name;
  player2.playerName = player2Name;
}

function isGameWon(game) {
  if (
    game.player1.allShipsSunk === true ||
    game.player2.allShipsSunk === true
  ) {
    return true;
  } else return false;
}

function playRound(playing, notPlaying, game, noOfPlayers) {
  return new Promise((resolve) => {
    fullDisplay(playing, notPlaying);

    function clickFunction(j, i) {
      console.log(notPlaying);
      notPlaying.receiveAttack([j - 10, i]);
      if (noOfPlayers === 1) {
        computerAttack(playing);
      }
      console.log(game);
      resolve(true);
    }

    for (let i = 0; i < 10; i++) {
      for (let j = 10; j < 20; j++) {
        let number = `${(j - 10) * 10 + i}`;
        if (!notPlaying.shipPositions[number][4]) {
          let squares = document.getElementsByClassName(`your-space ${j} ${i}`);
          Array.from(squares).forEach((square) => {
            square.addEventListener("click", () => {
              clickFunction(j, i);
            });
          });
        }
      }
    }
  });
}

function removeAllEventListeners() {
  console.log("remove event listeners");
  for (let i = 0; i < 10; i++) {
    for (let j = 10; j < 20; j++) {
      let number = `${(j - 10) * 10 + i}`;
      let squares = document.getElementsByClassName(`your-space ${j} ${i}`);
      Array.from(squares).forEach((square) => {
        let newSquare = square.cloneNode(true);
        square.parentNode.replaceChild(newSquare, square);
      });
    }
  }
}

async function twoPlayer(player1Name, player2Name) {
  const twoPlayerGame = newGame();

  //Rename players for ease of use
  let playerOne = twoPlayerGame.player1;
  let playerTwo = twoPlayerGame.player2;

  // Name both players
  addNamesToGameboards(playerOne, player1Name, playerTwo, player2Name);

  // Place ships for playerOne
  const boatPlacementOne = await placeAllBoats(playerOne, `Confirm Placement`);

  // Place ships for PlayerTwo
  if (boatPlacementOne) {
    clearDisplay();
    const completePlacementSection =
      document.getElementById("complete-placement");
    completePlacementSection.style.display = "none";
    const switchedPlacement = await switchScreen(
      `Hand over to ${player2Name}`,
      `${player2Name} ready`
    );
    if (switchedPlacement) {
      const boatPlacementTwo = await placeAllBoats(
        playerTwo,
        "Confirm Placement"
      );
      if (boatPlacementTwo) {
        let whoIsPlaying = playerOne;
        let whoIsNotPlaying = playerTwo;
        while (!isGameWon(twoPlayerGame)) {
          console.log("one while loop");
          await switchScreen(
            `Hand over to ${whoIsPlaying.playerName}`,
            `${whoIsPlaying.playerName} ready!`
          );
          launchBattle();
          updateTitle(`${whoIsPlaying.playerName} - Choose your attack!`);
          console.log(whoIsPlaying);
          console.log(whoIsNotPlaying);
          await playRound(whoIsPlaying, whoIsNotPlaying, twoPlayerGame, 2);
          [whoIsPlaying, whoIsNotPlaying] = [whoIsNotPlaying, whoIsPlaying];
          removeAllEventListeners();
        }
        winner(twoPlayerGame);
      }
    }
  }
}

function switchScreen(switchTitle, switchButton) {
  return new Promise((resolve) => {
    const placementScreen = document.getElementById("placement-screen");
    const playScreen = document.getElementById("play-screen");
    const switchTeamScreen = document.getElementById("switch-team-screen");
    const switchTeamTitle = document.getElementById("switch-team-title");
    const switchTeamButton = document.getElementById("switch-button");

    placementScreen.style.display = "none";
    playScreen.style.display = "none";
    switchTeamScreen.style.display = "grid";
    switchTeamTitle.innerHTML = switchTitle;
    switchTeamButton.innerHTML = switchButton;
    switchTeamButton.addEventListener("click", function switchClicked() {
      switchTeamButton.removeEventListener("click", switchClicked);
      switchTeamScreen.style.display = "none";
      resolve(true);
    });
  });
}

function updatePlayNumbers(playing, notPlaying) {
  let myCarrier = 0;
  let myBattleship = 0;
  let myDestroyer = 0;
  let mySubmarine = 0;
  let myPatrolBoat = 0;
  let yourCarrier = 0;
  let yourBattleship = 0;
  let yourDestroyer = 0;
  let yourSubmarine = 0;
  let yourPatrolBoat = 0;

  for (let i = 0; i < playing.ships.length; i++) {
    if (playing.ships[i].sunk === false) {
      if (playing.ships[i].type === "Carrier") {
        myCarrier++;
      } else if (playing.ships[i].type === "Battleship") {
        myBattleship++;
      } else if (playing.ships[i].type === "Destroyer") {
        myDestroyer++;
      } else if (playing.ships[i].type === "Submarine") {
        mySubmarine++;
      } else if (playing.ships[i].type === "Patrol-Boat") {
        myPatrolBoat++;
      }
    }
  }

  for (let i = 0; i < notPlaying.ships.length; i++) {
    if (notPlaying.ships[i].sunk === false) {
      if (notPlaying.ships[i].type === "Carrier") {
        yourCarrier++;
      } else if (notPlaying.ships[i].type === "Battleship") {
        yourBattleship++;
      } else if (notPlaying.ships[i].type === "Destroyer") {
        yourDestroyer++;
      } else if (notPlaying.ships[i].type === "Submarine") {
        yourSubmarine++;
      } else if (notPlaying.ships[i].type === "Patrol-Boat") {
        yourPatrolBoat++;
      }
    }
  }

  const playingCarrier = document.getElementsByClassName("Carrier-number-my");
  const playingBattleship = document.getElementsByClassName(
    "Battleship-number-my"
  );
  const playingDestroyer = document.getElementsByClassName(
    "Destroyer-number-my"
  );
  const playingSubmarine = document.getElementsByClassName(
    "Submarine-number-my"
  );
  const playingPatrolBoat = document.getElementsByClassName(
    "Patrol-Boat-number-my"
  );
  const notPlayingCarrier = document.getElementsByClassName(
    "Carrier-number-your"
  );
  const notPlayingBattleship = document.getElementsByClassName(
    "Battleship-number-your"
  );
  const notPlayingDestroyer = document.getElementsByClassName(
    "Destroyer-number-your"
  );
  const notPlayingSubmarine = document.getElementsByClassName(
    "Submarine-number-your"
  );
  const notPlayingPatrolBoat = document.getElementsByClassName(
    "Patrol-Boat-number-your"
  );

  Array.from(playingCarrier).forEach((carrier) => {
    carrier.innerHTML = myCarrier;
  });
  Array.from(playingBattleship).forEach((battleship) => {
    battleship.innerHTML = myBattleship;
  });
  Array.from(playingDestroyer).forEach((destroyer) => {
    destroyer.innerHTML = myDestroyer;
  });
  Array.from(playingSubmarine).forEach((submarine) => {
    submarine.innerHTML = mySubmarine;
  });
  Array.from(playingPatrolBoat).forEach((patrolBoat) => {
    patrolBoat.innerHTML = myPatrolBoat;
  });
  Array.from(notPlayingCarrier).forEach((carrier) => {
    carrier.innerHTML = yourCarrier;
  });
  Array.from(notPlayingBattleship).forEach((battleship) => {
    battleship.innerHTML = yourBattleship;
  });
  Array.from(notPlayingDestroyer).forEach((destroyer) => {
    destroyer.innerHTML = yourDestroyer;
  });
  Array.from(notPlayingSubmarine).forEach((submarine) => {
    submarine.innerHTML = yourSubmarine;
  });
  Array.from(notPlayingPatrolBoat).forEach((patrolBoat) => {
    patrolBoat.innerHTML = yourPatrolBoat;
  });
}

function launchBattle() {
  const placementScreen = document.getElementById("placement-screen");
  placementScreen.style.display = "none";
  const switchTeamScreen = document.getElementById("switch-team-screen");
  switchTeamScreen.style.display = "none";
  const playScreen = document.getElementById("play-screen");
  playScreen.style.display = "grid";
}

function updateTitle(text) {
  const title = document.getElementsByClassName("screen-title");
  Array.from(title).forEach((box) => {
    box.innerHTML = text;
  });
}

// Function to update the UI with the number of remaining boats
function updateBoatNoInPage(boatConfig) {
  boatConfig.forEach((config) => {
    const boatVisual = document.getElementsByClassName(`${config.type}-number`);
    Array.from(boatVisual).forEach((boat) => {
      boat.innerText = config.count;
    });
  });
}

// Function to handle the placement and updating of boats
function boatPlacementScreen(boatConfig, player) {
  return new Promise((resolve) => {
    boatConfig.forEach((config) => {
      const boatElements = document.getElementsByClassName(config.type);
      Array.from(boatElements).forEach((boat) => {
        const clickHandler = () => {
          if (config.count > 0) {
            boat.style.backgroundColor = "#D90429";
            // If there are still boats left
            placeIndividualBoat(config.length, player, config.type, () => {
              config.count--;
              updateBoatNoInPage(boatConfig);
              removeBoatPlaceBackground(boatConfig);
              if (checkAllBoatsPlaced(boatConfig)) {
                resolve(true);
              }
            });
          }
        };
        boat.removeEventListener("click", clickHandler);
        boat.addEventListener("click", clickHandler, false);
      });
    });
  });
}

function removeBoatPlaceBackground(boatConfig) {
  boatConfig.forEach((config) => {
    const boatElements = document.getElementsByClassName(config.type);
    Array.from(boatElements).forEach((boat) => {
      boat.style.backgroundColor = "#8D99AE";
    });
  });
}

// Function to check if all boats have been placed
function checkAllBoatsPlaced(boatConfigurations) {
  return boatConfigurations.every((config) => config.count === 0);
}

// Function to handle the placement of a boat on the board
function placeIndividualBoat(length, player, type, updateBoatNumber) {
  let initialSelection;
  let secondSelection;

  // Store references to the event listeners
  const eventListeners = {};

  function clickBox(i, j, event) {
    event.preventDefault();

    // Remove all click listeners
    for (let m = 0; m < 10; m++) {
      for (let n = 10; n < 20; n++) {
        const squareToRemove = document.getElementsByClassName(
          `blank-space ${n} ${m}`
        );
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
            !player.shipPositions.some(
              (pos) => pos[0] === x && pos[1] === y && pos[3]
            )
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
        `blank-space ${coord[0] + 10} ${coord[1]}`
      );
      Array.from(squareToRead).forEach((square) => {
        square.style.backgroundColor = "#8D99AE"; // Highlight valid end positions
        const selectEnd = function (event) {
          event.preventDefault();
          secondSelection = [coord[0], coord[1]];
          const success = player.addShip(
            initialSelection,
            secondSelection,
            type
          );
          if (success) {
            clearDisplay();
            shipPositionDisplay(player.shipPositions, `blank-space`);
            // generateBoatVisual(player.shipPositions); // Visualize the placed boats
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
      const square = document.getElementsByClassName(`blank-space ${j} ${i}`);
      Array.from(square).forEach((square) => {
        const listener = (event) => clickBox(i, j, event);
        eventListeners[`${j}-${i}`] = listener;
        square.addEventListener("click", listener, false);
      });
    }
  }
}

// Function for the computer to randomly attack
function computerAttack(computerPlayer) {
  let attackSuccess = false;
  while (attackSuccess === false) {
    let tryCoords = [generateRandom(10), generateRandom(10)];
    let [a, b] = tryCoords;
    let tryTotal = a * 10 + b;
    if (computerPlayer.shipPositions[tryTotal][4] !== true) {
      computerPlayer.receiveAttack(tryCoords);
      attackSuccess = true;
    }
  }
}

// Function to display the position of all ships for one player
function shipPositionDisplay(playerShipPositions, gameboard) {
  for (let i = 0; i < playerShipPositions.length; i++) {
    if (playerShipPositions[i][3] === true) {
      const [a, b] = playerShipPositions[i];
      const newA = a + 10;
      const square = document.getElementsByClassName(
        `${gameboard} ${newA} ${b}`
      );
      Array.from(square).forEach((square) => {
        square.style.backgroundColor = `#2B2D42`;
      });
    }
  }
}

// Function to clear the background for all squares on the screen
function clearDisplay() {
  const spaces = ["my-space", "your-space", "blank-space"];

  spaces.forEach((space) => {
    for (let i = 0; i < 10; i++) {
      for (let j = 10; j < 20; j++) {
        const squares = document.getElementsByClassName(`${space} ${j} ${i}`);
        Array.from(squares).forEach((square) => {
          square.style.background = "#EDF2F4";
          square.style.border = "1px solid #8D99AE";
        });
      }
    }
  });
}

function entireShipDisplay(playing, notPlaying) {
  let playerSunkShips = [];
  let notPlayingSunkShips = [];

  for (let i = 0; i < playing.ships.length; i++) {
    if (playing.ships[i].sunk === true) {
      playerSunkShips.push(i);
    }
  }

  for (let i = 0; i < notPlaying.ships.length; i++) {
    if (notPlaying.ships[i].sunk === true) {
      notPlayingSunkShips.push(i);
    }
  }

  for (let i = 0; i < 100; i++) {
    const a = playing.shipPositions[i][0];
    const b = playing.shipPositions[i][1];

    const mySquare = document.getElementsByClassName(`my-space ${a + 10} ${b}`);
    const yourSquare = document.getElementsByClassName(
      `your-space ${a + 10} ${b}`
    );

    let imSunk = false;
    let yourSunk = false;

    for (let j = 0; j < playerSunkShips.length; j++) {
      if (playerSunkShips[j] === playing.shipPositions[i][2]) {
        imSunk = true;
      }
    }

    for (let j = 0; j < notPlayingSunkShips.length; j++) {
      if (notPlayingSunkShips[j] === notPlaying.shipPositions[i][2]) {
        yourSunk = true;
      }
    }

    if (imSunk) {
      Array.from(mySquare).forEach((square) => {
        square.style.backgroundColor = "#000000";
      });
    } else if (
      playing.shipPositions[i][3] === true &&
      playing.shipPositions[i][4] === true
    ) {
      Array.from(mySquare).forEach((square) => {
        square.style.backgroundColor = "#D90429";
      });
    } else if (
      playing.shipPositions[i][3] === true &&
      playing.shipPositions[i][4] !== true
    ) {
      Array.from(mySquare).forEach((square) => {
        square.style.backgroundColor = "#2B2D42";
      });
    } else if (
      playing.shipPositions[i][3] !== true &&
      playing.shipPositions[i][4] === true
    ) {
      Array.from(mySquare).forEach((square) => {
        square.style.border = `1px solid #EF233C`;
        square.style.backgroundColor = `#8D99AE`;
      });
    }

    if (yourSunk) {
      Array.from(yourSquare).forEach((square) => {
        square.style.backgroundColor = "#000000";
      });
    } else if (
      notPlaying.shipPositions[i][3] === true &&
      notPlaying.shipPositions[i][4]
    ) {
      Array.from(yourSquare).forEach((square) => {
        square.style.backgroundColor = "#D90429";
      });
    } else if (
      notPlaying.shipPositions[i][3] !== true &&
      notPlaying.shipPositions[i][4]
    ) {
      Array.from(yourSquare).forEach((square) => {
        square.style.border = `1px solid #EF233C`;
        square.style.backgroundColor = `#8D99AE`;
      });
    }
  }
}

function fullDisplay(playing, notPlaying) {
  clearDisplay();
  updatePlayNumbers(playing, notPlaying);
  entireShipDisplay(playing, notPlaying);
}

function winner(game) {
  const playScreen = document.getElementById("play-screen");
  const winScreen = document.getElementById("winner");
  const winTitle = document.getElementById("who-won");

  playScreen.style.display = "none";
  winScreen.style.display = "inline-block";
  if (game.player1.allShipsSunk === true) {
    winTitle.innerHTML = `${game.player2.playerName} won!`;
  } else {
    winTitle.innerHTML = `${game.player1.playerName} won!`;
  }
}

export { buttonClicker };
