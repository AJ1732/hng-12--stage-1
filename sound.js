class GameSounds {
  constructor() {
    this.allowSound = true;
    this.sounds = {
      "coin-recieved": null,
      "energy-drink-effect": null,
      "ethereal-ambient-music": null,
      "game-start": null,
    };
  }

  setupElements() {
    // CREDIT PLAY BUTTONS
    this.playButtons = document.querySelectorAll("button[data-file]");
    this.playButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.playSound(e));
    });

    // GUESS BUTTONS
    document.querySelectorAll("button[data-guess]").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const guessType = button.getAttribute("data-guess");
        switch (guessType) {
          case "correct":
            this.playCorrectGuess(e);
            break;
          case "wrong":
            this.playWrongGuess(e);
            break;
          case "new-game":
            this.playNewGame(e);
            break;
          default:
            console.log("No matching guess type");
        }
      });
    });
  }

  stopSound() {
    this.allowSound = false;
  }

  playSound(e) {
    e.preventDefault();
    const target = e.currentTarget;

    // GET THE SOUND NAME
    const soundName = target.getAttribute("data-file");
    const soundSrc = "./sounds/" + soundName + ".mp3";

    // STOP REPEAT OF SAME AUDIO
    if (this.sounds[soundName]) {
      this.sounds[soundName].pause();
      this.sounds[soundName] = null;
    }

    console.log(soundSrc);

    // CREATE AUDIO ELEMENT
    let audio = document.createElement("audio");
    audio.removeAttribute("controls");
    document.body.appendChild(audio);
    audio.src = soundSrc;

    // REDUCE THE VOLUME
    if (soundName !== "game-start") {
      audio.volume = 0.2;
    }

    // ONLY PLAY SOUNDS IF ALLOWED
    if (this.allowSound) {
      this.sounds[soundName] = audio;
      audio.setAttribute("data-file", soundName);
      audio.play();
    }

    // MEDIA EVENTS
    // audio.addEventListener("playing", (e) => this.goAudio(e));
    audio.addEventListener("ended", (e) => this.doneAudio(e));
  }

  // goAudio(e) {
  //   console.log(e.target.src, "has started playing");
  // }

  doneAudio(e) {
    // console.log(e.target.src, "has finished playing");
    const soundName = e.target.getAttribute("data-file");
    this.sounds[soundName] = null;
  }

  playCorrectGuess(e) {
    e.preventDefault();
    const target = e.currentTarget;
    target.setAttribute("data-file", "coin-recieved");
    this.playSound(e);
  }

  playWrongGuess(e) {
    e.preventDefault();
    const target = e.currentTarget;
    target.setAttribute("data-file", "energy-drink-effect");
    this.playSound(e);
  }

  playNewGame(e) {
    if (e && e.currentTarget) {
      e.preventDefault();
      const target = e.currentTarget;
      target.setAttribute("data-file", "game-start");
      this.playSound(e);
    } else {
      // NO EVENT PASSED, so create a dummy target element
      const dummyTarget = document.createElement("button");
      dummyTarget.setAttribute("data-file", "game-start");
      // CREATE a fake event object
      const fakeEvent = {
        preventDefault: () => {},
        currentTarget: dummyTarget,
      };
      this.playSound(fakeEvent);
    }
  }
}

export const gameSounds = new GameSounds();
gameSounds.setupElements();
