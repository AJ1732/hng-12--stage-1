import { gameSounds } from "./sound.js";
console.log("Hello, World!");

class ColourGuess {
  constructor() {
    this.score = 0;
    this.highScore = 0;
    this.colors = [];
    this.targetColor = "";
    this.setupElements();
    this.setupEventListeners();
    this.loadScores(); 
    this.startNewGame();
  }

  setupElements() {
    this.colorBox = document.querySelector('[data-testid="colorBox"]');
    this.optionsContainer = document.querySelector(".game__options-container");
    this.scoreElement = document.querySelector('[data-testid="score"]');
    this.highScoreElement = document.querySelector(".game__highscore");
    this.statusElement = document.querySelector('[data-testid="gameStatus"]');
    this.newGameButton = document.querySelector(
      '[data-testid="newGameButton"]'
    );

    this.updateScoreDisplay();
    this.updateHighScoreDisplay();
  }

  loadScores() {
    // Load HIGH SCORE
    const savedHighScore = localStorage.getItem("colourGuessHighScore");
    this.highScore = savedHighScore ? parseInt(savedHighScore) : 0;
    
    // Load CURRENT SCORE
    const savedScore = localStorage.getItem("colourGuessScore");
    this.score = savedScore ? parseInt(savedScore) : 0;
    
    this.updateScoreDisplay();
    this.updateHighScoreDisplay();
  }

  saveScores() {
    localStorage.setItem("colourGuessHighScore", this.highScore.toString());
    localStorage.setItem("colourGuessScore", this.score.toString());
  }

  updateScoreDisplay() {
    this.scoreElement.textContent = `${this.score}`;
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
      this.saveScores(); // Save both scores before unloading
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

      const innerSpan = document.createElement("span");
      innerSpan.classList.add("game__option__inner");
      innerSpan.style.backgroundColor = color;

      button.appendChild(innerSpan);
      button.addEventListener("click", (e) => {
        this.handleGuess(e, color, innerSpan);
      });
      this.optionsContainer.appendChild(button);
    });
  }

  startNewGame(e) {
    if (e) e.preventDefault();

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
      this.newGameButton.classList.add("game__start");
      // PLAY SOUND
      gameSounds.playNewGame(e);
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
    this.updateScoreDisplay();
    this.saveScores(); 
    this.statusElement.textContent = "Ready Set Go!";
    this.statusElement.className = "game__status";
  }

  handleGuess(e, guessedColor, innerSpan) {
    if (guessedColor === this.targetColor) {
      this.score++;
      this.updateScoreDisplay();
      this.updateHighScore();
      this.saveScores(); 
      this.statusElement.textContent = "Correct!";
      this.statusElement.className = "game__status--correct";

      // PLAY SOUND
      gameSounds.playCorrectGuess(e);
      setTimeout(() => this.startNewGame(), 1000);
    } else {
      // PLAY SOUND
      gameSounds.playWrongGuess(e);

      // REMOVE any previous wrong animation from all inner spans
      this.optionsContainer
        .querySelectorAll('[data-testid="colorOption"] .game__option__inner')
        .forEach((span) => {
          span.classList.remove("game__option__inner--wrong");
        });

      this.resetGame();

      // Make sure element is ready for animation
      void innerSpan.offsetWidth;
      // Start the animation
      innerSpan.classList.add("game__option__inner--wrong");

      // AFTER ANIMATION ENDS
      innerSpan.addEventListener(
        "animationend",
        () => {
          // HIDE the parent button element from the options container.
          if (innerSpan.parentElement) {
            // innerSpan.parentElement.remove();
            innerSpan.parentElement.classList.add("game__option--hidden");
          }
        },
        { once: true }
      );

      this.statusElement.textContent = "Wrong! Try again";
      this.statusElement.className =
        "game__status--wrong game__status--wrong-anim";
    }
  }

  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveScores();
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