class GameSounds {
  constructor() {
    this.allowSound = false;
    this.sounds = {
      "coin-recieved": null,
      "energy-drink-effect": null,
      "ethereal-ambient-music": null,
      "game-start": null,
    };

    // SET STATE TO OFF
    if (!localStorage.getItem("backgroundSound")) {
      localStorage.setItem("backgroundSound", "off");
    }
  }

  setupElements() {
    // CREDIT PLAY BUTTONS (using data-file)
    this.playButtons = document.querySelectorAll("button[data-file]");
    this.playButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.playSound(e));
    });

    // GUESS BUTTONS (using data-guess)
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

    // BACKGROUND MUSIC CONTROL (volume icon)
    const bgToggle = document.querySelector('[data-guess="background"]');
    if (bgToggle) {
      // SET stored state to be "off"
      localStorage.setItem("backgroundSound", "off");
      bgToggle.classList.remove("fa-volume-high");
      bgToggle.classList.add("fa-volume-xmark");

      // Make sure allowSound remains false.
      this.allowSound = false;

      // TOGGLE the background sound.
      bgToggle.addEventListener("click", (e) => this.toggleBackgroundSound(e));
    }

    // AUTO PLAY background music
    this.playBackgroundMusic();
  }

  stopSound() {
    this.allowSound = false;
    localStorage.setItem("backgroundSound", "off");
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

    // console.log(soundSrc);

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

  // BACKGROUND MUSIC METHOD
  playBackgroundMusic() {
    const soundName = "ethereal-ambient-music";
    const soundSrc = "./sounds/" + soundName + ".mp3";

    // CREATE or GET the audio element
    let audio = this.sounds[soundName];
    if (!audio) {
      audio = document.createElement("audio");
      audio.src = soundSrc;
      audio.loop = true;

      // START with fade-in effect
      audio.volume = 0;
      audio.setAttribute("data-file", soundName);
      document.body.appendChild(audio);
      this.sounds[soundName] = audio;
    }
    // Play and fade in IF ALLOWED
    if (this.allowSound) {
      audio.play();
      this.fadeInAudio(audio, 0.2, 0.2);
    }
  }

  // GRADUALLY INCREASE VOLUME TO TARGET VOLUME
  fadeInAudio(audio, targetVolume, intervalTime) {
    const fadeInInterval = setInterval(() => {
      if (audio.volume < targetVolume) {
        audio.volume = Math.min(audio.volume + 0.02, targetVolume);
      } else {
        clearInterval(fadeInInterval);
      }
    }, intervalTime);
  }

  // GRADUALLY DESCREASE VOLUME TO TARGET VOLUME
  fadeOutAudio(audio, intervalTime, callback) {
    const fadeOutInterval = setInterval(() => {
      if (audio.volume > 0.02) {
        audio.volume = Math.max(audio.volume - 0.02, 0);
      } else {
        clearInterval(fadeOutInterval);
        audio.pause();
        if (callback) callback();
      }
    }, intervalTime);
  }

  // TOGGLE BACKGROUND MUSIC METHOD
  toggleBackgroundSound(e) {
    e.preventDefault();
    const icon = e.currentTarget;
    const soundName = "ethereal-ambient-music";
    const audio = this.sounds[soundName];

    if (audio && !audio.paused) {
      this.fadeOutAudio(audio, 100);

      // CHANGE ICON
      icon.classList.remove("fa-volume-high");
      icon.classList.add("fa-volume-xmark");

      // UPDATE allowSound flag and local storage
      this.allowSound = false;
      localStorage.setItem("backgroundSound", "off");
    } else {
      this.allowSound = true;

      // If audio already exists, RESUME - otherwise create it.
      if (audio) {
        audio.play();
        this.fadeInAudio(audio, 0.2, 0.2);
      } else {
        this.playBackgroundMusic();
      }

      // CHANGE ICON
      icon.classList.remove("fa-volume-xmark");
      icon.classList.add("fa-volume-high");

      // UPDATE local storage
      localStorage.setItem("backgroundSound", "on");
    }
  }
}

export const gameSounds = new GameSounds();
gameSounds.setupElements();
