console.log("Hello, World!");

class ColourGuess {
  constructor() {
    this.score = 0;
    this.highScore = 0;
    this.colors = [];
    this.targetColor = "";
    this.setupElements();
    this.setupEventListeners();
    this.loadHighScore();
    this.startNewGame();
  }

  setupElements() {
    this.colorBox = document.querySelector('[data-testid="colorBox"]');
    this.optionsContainer = document.querySelector(".game__options__container");
    this.scoreElement = document.querySelector('[data-testid="score"]');
    this.highScoreElement = document.querySelector(".game__highscore");
    this.statusElement = document.querySelector('[data-testid="gameStatus"]');
    this.newGameButton = document.querySelector(
      '[data-testid="newGameButton"]'
    );

    this.updateHighScoreDisplay();
  }

  loadHighScore() {
    const savedScore = localStorage.getItem("colourGuessHighScore");
    this.highScore = savedScore ? parseInt(savedScore) : 0;
    this.updateHighScoreDisplay();
  }

  saveHighScore() {
    localStorage.setItem("colourGuessHighScore", this.highScore.toString());
  }

  updateHighScoreDisplay() {
    this.highScoreElement.textContent = `${this.highScore}`;
  }

  setupEventListeners() {
    this.newGameButton.addEventListener("click", () => {
      this.resetGame();
      this.startNewGame();
    });

    window.addEventListener("beforeunload", () => {
      this.saveHighScore();
    });
  }

  rgbToString(color) {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b };
  }

  generateSimilarColor(baseColor, difficulty = 25) {
    const variation = () => Math.floor((Math.random() - 0.5) * difficulty * 2);

    let r = baseColor.r + variation();
    let g = baseColor.g + variation();
    let b = baseColor.b + variation();

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return { r, g, b };
  }

  renderColorOptions() {
    this.optionsContainer.innerHTML = "";
    this.colors.forEach((color) => {
      const button = document.createElement("button");
      button.setAttribute("data-testid", "colorOption");
      button.style.backgroundColor = color;
      button.addEventListener("click", () => {
        this.handleGuess(color);
      });
      this.optionsContainer.appendChild(button);
    });
  }

  startNewGame() {
    this.colors = [];
    this.statusElement.textContent = "Ready Set Go!";
    this.statusElement.className = "game__status";

    const tColor = this.generateRandomColor();
    this.targetColor = this.rgbToString(tColor);
    this.colors.push(this.targetColor);

    while (this.colors.length < 6) {
      const bColor = this.generateRandomColor();
      const newColor = this.rgbToString(bColor);
      if (!this.colors.includes(newColor)) {
        this.colors.push(newColor);
      }
    }

    if (this.score === 0) {
      console.log("Invisible");
      this.newGameButton.classList.add("game__start");
    } else {
      this.newGameButton.classList.remove("game__start");
    }

    this.colors.sort(() => Math.random() - 0.5);

    // DIFFICULTY LEVEL HARD CODE
    // const baseColor = this.generateRandomColor();
    // this.targetColor = this.rgbToString(baseColor);

    // while (this.colors.length < 6) {
    //   const similarColor = this.generateSimilarColor(baseColor);
    //   const colorString = this.rgbToString(similarColor);

    //   if (!this.colors.includes(colorString)) {
    //     this.colors.push(colorString);
    //   }
    // }

    // const randomIndex = Math.floor(Math.random() * 6);
    // this.colors[randomIndex] = this.targetColor;

    this.colorBox.style.backgroundColor = this.targetColor;
    this.renderColorOptions();
  }

  resetGame() {
    this.score = 0;
    this.scoreElement.textContent = `${this.score}`;
    this.statusElement.textContent = "Ready Set Go!";
    this.statusElement.className = "game__status";
  }

  handleGuess(guessedColor) {
    if (guessedColor === this.targetColor) {
      this.score++;
      this.scoreElement.textContent = `${this.score}`;
      this.updateHighScore();
      this.statusElement.textContent = "Correct!";
      this.statusElement.className = "status--correct";
      setTimeout(() => this.startNewGame(), 1000);
    } else {
      this.optionsContainer
        .querySelectorAll('[data-testid="colorOption"]')
        .forEach((button) => {
          button.classList.remove("status--wrong__anim");
        });

      this.resetGame();
      const wrongButton = Array.from(this.optionsContainer.children).find(
        (button) => button.style.backgroundColor === guessedColor
      );

      if (wrongButton) {
        void wrongButton.offsetWidth;
        wrongButton.classList.add("guess--wrong");
        this.statusElement.className = "status--wrong status--wrong__anim";
      }

      this.statusElement.textContent = "Wrong! Try again";
    }
  }

  updateHighScore() {
    this.highScoreElement.textContent = this.highScore;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
      this.updateHighScoreDisplay();
    }
  }
}

new ColourGuess();

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });

        setTimeout(() => {
          history.replaceState(null, null, " ");
        }, 500);
      }
    });
  });
});
