
/* =========================================
   MUSU — A BIRTHDAY STORY
   Complete Main JavaScript
   Updated birthday experience
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // =======================================
  // ELEMENTS AND VARIABLES
  // =======================================

  const music = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicLabel = document.getElementById("musicLabel");
  const particleContainer = document.getElementById("particles");

  let musicPlaying = false;
  let letterStarted = false;
  let letterTimer = null;
  let countdownTimer = null;


  // =======================================
  // 1. CHANGE THE STORY ORDER
  // =======================================

  // Birthday reveal goes to funny surprise
  const birthdayNext = document.querySelector(
    '#scene3 [data-next="scene5"]'
  );

  // Memories go directly to the letter
  const memoriesNext = document.querySelector(
    '#scene4 [data-next="scene7"]'
  );

  if (memoriesNext) {
    memoriesNext.textContent = "Continue to your letter ♡ →";
  }

  // Cake button opens memories after candle is blown
  const cakeContinue = document.getElementById("cakeContinue");

  if (cakeContinue) {
    cakeContinue.classList.add("hidden");
  }



  // =======================================
  // 2. SCENE NAVIGATION
  // =======================================

  function showScene(sceneId) {

    const nextScene = document.getElementById(sceneId);

    if (!nextScene) return;

    document.querySelectorAll(".scene").forEach(scene => {
      scene.classList.remove("active");
    });

    nextScene.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  // Register navigation AFTER changing the routes above

  document.querySelectorAll("[data-next]").forEach(button => {

    button.addEventListener("click", () => {

      const nextScene = button.getAttribute("data-next");

      showScene(nextScene);

    });

  });


  // =======================================
  // 3. BACKGROUND MUSIC
  // =======================================

  if (music && musicToggle && musicLabel) {

    musicToggle.addEventListener("click", async () => {

      if (!musicPlaying) {

        try {

          await music.play();

          musicPlaying = true;
          musicLabel.textContent = "Music on";
          musicToggle.classList.add("playing");

        } catch (error) {

          musicLabel.textContent = "Tap to play";

          console.log("Music could not play:", error);

        }

      } else {

        music.pause();

        musicPlaying = false;
        musicLabel.textContent = "Music off";
        musicToggle.classList.remove("playing");

      }

    });

    music.addEventListener("error", () => {
      musicLabel.textContent = "Music unavailable";
    });

  }


  // =======================================
  // 4. BIRTHDAY COUNTDOWN
  // =======================================

  const birthdayDate = new Date(2026, 10, 26, 0, 0, 0);

  function updateCountdown() {

    const countdown = document.getElementById("countdown");
    const status = document.getElementById("birthdayStatus");

    if (!countdown) return;

    const now = new Date();
    const difference = birthdayDate.getTime() - now.getTime();

    if (difference <= 0) {

      countdown.innerHTML = `
        <div class="birthday-complete">
          <strong>♡</strong>
          <span>It's your day!</span>
        </div>
      `;

      if (status) {
        status.textContent = "Today is all about you, Musu!";
      }

      return;

    }

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
      (difference / 1000) % 60
    );

    const elements = {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };

    Object.entries(elements).forEach(([id, value]) => {

      const element = document.getElementById(id);

      if (element) {
        element.textContent = String(value).padStart(2, "0");
      }

    });

    if (status) {
      status.textContent = "A special day is getting closer...";
    }

  }

  updateCountdown();

  countdownTimer = setInterval(updateCountdown, 1000);


  // =======================================
  // 5. STACKED PHOTO MEMORIES
  // =======================================

  const photoGallery = document.getElementById("photoGallery");
  const nextPhotoButton = document.getElementById("nextPhotoButton");
  const previousPhotoButton = document.getElementById("previousPhoto");
  const photoCounter = document.getElementById("photoCounter");

  let photoCards = [];
  let currentPhoto = 0;
  let isAnimating = false;

  const rotations = [
    -2, 3, -5, 6, -7,
    8, -9, 10, -11, 12
  ];

  const offsets = [
    0, 5, 10, 15, 20,
    25, 30, 35, 40, 45
  ];


  // Update the counter and arrange the stack

  function arrangePhotoStack() {

    if (!photoGallery) return;

    photoCards.forEach((card, index) => {

      card.style.display = "block";
      card.style.opacity = "1";

      card.style.zIndex = String(photoCards.length - index);

      const rotation = rotations[index % rotations.length];
      const offset = offsets[index % offsets.length];

      const horizontalOffset = index % 2 === 0 ? -5 : 5;

      if (index === 0) {

        card.style.transform = "rotate(-2deg)";

      } else {

        card.style.transform =
          `rotate(${rotation}deg) translate(${horizontalOffset}px, ${offset}px)`;

      }

    });

    if (photoCounter) {

      const total = String(photoCards.length).padStart(2, "0");

      const current = photoCards.length
        ? String(currentPhoto + 1).padStart(2, "0")
        : "00";

      photoCounter.textContent = `${current} / ${total}`;

    }

    if (nextPhotoButton) {

      nextPhotoButton.textContent =
        currentPhoto === photoCards.length - 1
          ? "Replay memories ↺"
          : "Next memory →";

      nextPhotoButton.disabled = photoCards.length < 2;

    }

    if (previousPhotoButton) {
      previousPhotoButton.disabled = photoCards.length < 2;
    }

  }


  // Next memory

  function moveToNextPhoto() {

    if (isAnimating || photoCards.length < 2) return;

    isAnimating = true;

    const firstCard = photoCards[0];

    firstCard.classList.add("leaving");

    setTimeout(() => {

      firstCard.classList.remove("leaving");

      photoCards.push(photoCards.shift());

      currentPhoto = (currentPhoto + 1) % photoCards.length;

      arrangePhotoStack();

      isAnimating = false;

    }, 650);

  }


  // Previous memory

  function moveToPreviousPhoto() {

    if (isAnimating || photoCards.length < 2) return;

    isAnimating = true;

    const lastCard = photoCards.pop();

    photoCards.unshift(lastCard);

    currentPhoto =
      (currentPhoto - 1 + photoCards.length) % photoCards.length;

    lastCard.style.opacity = "0";

    arrangePhotoStack();

    requestAnimationFrame(() => {

      lastCard.style.transition = "opacity .45s ease";
      lastCard.style.opacity = "1";

    });

    setTimeout(() => {

      isAnimating = false;

    }, 450);

  }


  // Initialize gallery

  function initializeGallery() {

    if (!photoGallery) return;

    photoCards = Array.from(
      photoGallery.querySelectorAll(".photo-card")
    );

    photoCards.forEach(card => {

      const image = card.querySelector("img");

      if (!image) return;

      image.addEventListener("error", () => {

        if (!card.isConnected) return;

        photoCards = photoCards.filter(item => item !== card);

        card.remove();

        currentPhoto = photoCards.length
          ? currentPhoto % photoCards.length
          : 0;

        if (photoCards.length === 0) {

          photoGallery.innerHTML = `
            <p class="subtext">
              Add your photos to see your memories here. ♡
            </p>
          `;

        }

        arrangePhotoStack();

      });

      // Catch images that failed before the error listener was attached
      if (image.complete && image.naturalWidth === 0) {
        image.dispatchEvent(new Event("error"));
      }

    });

    if (nextPhotoButton) {
      nextPhotoButton.addEventListener("click", moveToNextPhoto);
    }

    if (previousPhotoButton) {
      previousPhotoButton.addEventListener("click", moveToPreviousPhoto);
    }

    arrangePhotoStack();

  }

  initializeGallery();


  // =======================================
  // 6. FUNNY SURPRISES
  // =======================================

  const jokes = [

    " sambavam ijj oru mointh anelum aa ahangaram ank iy kaniknilla 🙂‍↔️",

    "ariyathe kitiyath anelum iyy oru gem anu💎 ( for me) 😌",

    " Aaa chiri eppoyum moth ndayikkanam...kettallo 😌",

    " onnum parayanda  inn kore photos edk verthe ayakanam . 🌝",

    " njan paraynnath okke kanditt angt kombath keran nikanda 🙂‍↔️",

    " ♡",

    "Today's schedule: Smile, eat cake, smile again. Repeat. 😂"

  ];

  let lastJoke = -1;

  const jokeText = document.getElementById("jokeText");
  const jokeButton = document.getElementById("jokeButton");


  function showRandomJoke() {

    if (!jokeText) return;

    let newIndex;

    do {

      newIndex = Math.floor(Math.random() * jokes.length);

    } while (newIndex === lastJoke && jokes.length > 1);

    lastJoke = newIndex;

    jokeText.textContent = jokes[newIndex];

  }

  showRandomJoke();

  if (jokeButton) {
    jokeButton.addEventListener("click", showRandomJoke);
  }


  // =======================================
  // 7. CAKE AND CANDLE
  // =======================================

  const blowButton = document.getElementById("blowButton");
  const relightButton = document.getElementById("relightButton");
  const flame = document.getElementById("flame");
  const wishMessage = document.getElementById("wishMessage");

  let candleBlown = false;


  function resetCake() {

    candleBlown = false;

    if (flame) {
      flame.style.display = "block";
    }

    if (wishMessage) {
      wishMessage.textContent = "Your wish is waiting...";
    }

    if (blowButton) {
      blowButton.classList.remove("hidden");
    }

    if (relightButton) {
      relightButton.classList.add("hidden");
    }

    if (cakeContinue) {
      cakeContinue.classList.add("hidden");
    }

  }


  if (blowButton && flame && wishMessage) {

    blowButton.addEventListener("click", () => {

      if (candleBlown) return;

      candleBlown = true;

      // Extinguish candle
      flame.style.display = "none";

      // Show wish message
      wishMessage.textContent =
        "May every beautiful wish find its way to you. ♡";

      blowButton.classList.add("hidden");

      if (relightButton) {
        relightButton.classList.remove("hidden");
      }

      // Reveal memories button after the wish
      if (cakeContinue) {

        setTimeout(() => {
          cakeContinue.classList.remove("hidden");
        }, 900);

      }

      createConfetti();

    });

  }


  if (relightButton) {

    relightButton.addEventListener("click", () => {

      resetCake();

    });

  }


  // =======================================
  // 8. CONFETTI
  // =======================================

  function createConfetti() {

    const colors = [
      "#d8b878",
      "#f1ddb0",
      "#9b5364",
      "#ffffff",
      "#e7a66b",
      "#c78a9b"
    ];

    const shapes = ["square", "circle", "ribbon"];

    for (let i = 0; i < 100; i++) {

      const piece = document.createElement("div");

      const shape = shapes[
        Math.floor(Math.random() * shapes.length)
      ];

      const size = 5 + Math.random() * 7;
      const duration = 2.8 + Math.random() * 3.5;
      const drift = (Math.random() - 0.5) * 260;
      const rotation = Math.random() * 1000 + 360;

      piece.className = "confetti-piece";

      piece.style.left = Math.random() * 100 + "vw";
      piece.style.top = (-20 - Math.random() * 100) + "px";
      piece.style.width = size + "px";

      piece.style.height =
        (shape === "ribbon" ? size * 2.2 : size) + "px";

      piece.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      piece.style.borderRadius =
        shape === "circle" ? "50%" : "2px";

      piece.style.setProperty("--drift", drift + "px");
      piece.style.setProperty("--rotation", rotation + "deg");

      piece.style.animationDuration = duration + "s";
      piece.style.animationDelay = Math.random() * 0.8 + "s";

      document.body.appendChild(piece);

      piece.addEventListener("animationend", () => {
        piece.remove();
      }, { once: true });

    }

  }


  // =======================================
  // 9. HEARTFELT LETTER
  // =======================================

  const letter = `I don't know if words can ever describe how special a person can be.

But today, I just want to wish you something more than a happy birthday.

May you always have reasons to smile, courage when life gets difficult, and people who genuinely care about you.

Keep being your lovely, unique self. Never let the little things take away your beautiful smile.

And please remember to enjoy your birthday properly. Eat cake, laugh loudly, take lots of pictures and be a little dramatic. You have permission today. 😂

I hope this new chapter brings you beautiful memories, unexpected happiness and everything your heart quietly wishes for.

You deserve all the good things life has to offer.

Happy Birthday, Musu.

Stay happy. Stay wonderful. Always. ♡`;


  const letterText = document.getElementById("letterText");
  const letterButton = document.getElementById("letterButton");
  const letterNext = document.getElementById("letterNext");
  const cursor = document.querySelector(".letter-cursor");


  function startLetter() {

    if (letterStarted || !letterText) return;

    letterStarted = true;

    if (letterButton) {
      letterButton.disabled = true;
      letterButton.textContent = "A little message for you...";
    }

    let index = 0;
    const speed = 35;

    function typeLetter() {

      if (index < letter.length) {

        letterText.textContent += letter.charAt(index);

        index++;

        letterTimer = setTimeout(typeLetter, speed);

      } else {

        letterTimer = null;

        if (cursor) {
          cursor.style.display = "none";
        }

        if (letterButton) {
          letterButton.classList.add("hidden");
        }

        if (letterNext) {
          letterNext.classList.remove("hidden");
        }

      }

    }

    typeLetter();

  }


  if (letterButton) {
    letterButton.addEventListener("click", startLetter);
  }


  // =======================================
  // 10. REPLAY THE ENTIRE EXPERIENCE
  // =======================================

  const replayButton = document.getElementById("replayButton");


  if (replayButton) {

    replayButton.addEventListener("click", () => {

      // Stop any typing already in progress
      if (letterTimer) {
        clearTimeout(letterTimer);
        letterTimer = null;
      }

      letterStarted = false;

      // Reset letter
      if (letterText) {
        letterText.textContent = "";
      }

      if (cursor) {
        cursor.style.display = "inline";
      }

      if (letterButton) {
        letterButton.disabled = false;
        letterButton.textContent = "Open your letter ♡";
        letterButton.classList.remove("hidden");
      }

      if (letterNext) {
        letterNext.classList.add("hidden");
      }

      // Reset cake
      resetCake();

      // Reset gallery
      if (photoGallery) {

        photoCards = Array.from(
          photoGallery.querySelectorAll(".photo-card")
        );

        currentPhoto = 0;
        isAnimating = false;

        photoCards.forEach(card => {
          card.classList.remove("leaving");
        });

        arrangePhotoStack();

      }

      // Reset jokes
      lastJoke = -1;
      showRandomJoke();

      // Return to beginning
      showScene("scene1");

    });

  }


  // =======================================
  // 11. FLOATING GOLD PARTICLES
  // =======================================

  if (particleContainer) {

    for (let i = 0; i < 28; i++) {

      const particle = document.createElement("span");

      particle.className = "particle";

      particle.style.left = Math.random() * 100 + "%";

      particle.style.animationDuration =
        (7 + Math.random() * 12) + "s";

      particle.style.animationDelay =
        Math.random() * 12 + "s";

      particle.style.transform =
        `scale(${0.5 + Math.random()})`;

      particleContainer.appendChild(particle);

    }

  }


  // =======================================
  // WEBSITE READY
  // =======================================

  console.log("Musu Birthday Website Loaded ♡");

});
