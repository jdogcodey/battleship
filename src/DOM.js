function buttonClicker() {
  const secondPlayer = document.getElementById("add-second-player");
  const inputSecondPlayer = document.getElementById("player2");
  secondPlayer.addEventListener("click", () => {
    event.preventDefault();
    console.log("clicked");
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
      singlePlayerPlacement();
    } else twoPlayerPlacement();
  });
}

function singlePlayerPlacement() {
  const playerPlacementScreen = document.getElementById("player1-placement");
  playerPlacementScreen.style.display = "grid";
}

export { buttonClicker };
