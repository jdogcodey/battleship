function buttonClicker() {
  const secondPlayer = document.getElementById("add-second-player");
  const inputSecondPlayer = document.getElementById("player2");
  secondPlayer.addEventListener("click", () => {
    event.preventDefault();
    console.log("clicked");
    secondPlayer.style.display = "none";
    inputSecondPlayer.style.display = "inline-block";
  });
}

export { buttonClicker };
