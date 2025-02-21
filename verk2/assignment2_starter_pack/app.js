
// document.addEventListener("DOMContentLoaded", () => {
//   const pads = {
//       Q: document.getElementById("pad-red"),
//       W: document.getElementById("pad-yellow"),
//       A: document.getElementById("pad-green"),
//       S: document.getElementById("pad-blue"),
//   };

//   const originalcolors = {
//       Q: pads.Q.style.backgroundColor,
//       W: pads.W.style.backgroundColor,
//       A: pads.A.style.backgroundColor,
//       S: pads.S.style.backgroundColor,
//   };

//   const clickcolor = {
//       Q: "#72261d",
//       W: "#776107",
//       A: "#166637",
//       S: "#194b6c",
//   };

//   const soundMap = {
//       Q: "eih",
//       W: "eih",
//       A: "eih",
//       S: "eih",
//   };

//   function playSound(key) {
//       const audio = new Audio(soundMap[key]);
//       audio.play();
//   }

//   function flashPad(key) {
//       const pad = pads[key];
//       if (pad) {
//           pad.style.backgroundColor = clickcolor[key];
//           setTimeout(() => pad.style.backgroundColor = originalcolors[key], 150);
//       }
//   }

//   function handleUserInput(key) {
//       if (!pads[key]) return;
//       playSound(key);
//       flashPad(key);
//   }

//   document.addEventListener("keydown", (e) => {
//       const key = e.key.toUpperCase();
//       handleUserInput(key);
//   });
//   Object.keys(pads).forEach((key) => {
//       pads[key].addEventListener("click", () => handleUserInput(key));
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  let order = [];
  let playerOrder = [];
  let flash;
  let turn;
  let good;
  let compTurn;
  let intervalId;
  let strict = false;
  let noise = true;
  let on = false;
  let win;
  let restart = document.querySelector("#restart-btn");
  
  const levelCounter = document.querySelector("#level-indicator");
  const startButton = document.querySelector("#start-btn");
  const soundselect = document.querySelector("#sound-select");

  const synth = new Tone.Synth().toDestination();

  const playTune = () => {
    //initialise a timer to decide when to play individual notes
    const now = Tone.now();

    //Play a C4 as an 8th note
    synth.triggerAttackRelease("c4", "8n", now);

    //Play a F#4 as a 4th note, after half a second
    synth.triggerAttackRelease("f#4", "4n", now + 0.5);

    //Play a D#4 as a half note after 1 second
    synth.triggerAttackRelease("d#4", "2n", now + 1);

  };

  const pads = {
    Q: document.getElementById("pad-red"),
    W: document.getElementById("pad-yellow"),
    A: document.getElementById("pad-green"),
    S: document.getElementById("pad-blue"),
  };

  const originalcolors = {
    Q: pads.Q.style.backgroundColor,
    W: pads.W.style.backgroundColor,
    A: pads.A.style.backgroundColor,
    S: pads.S.style.backgroundColor,
  };

  const clickcolor = {
    Q: "#72261d",
    W: "#776107",
    A: "#166637",
    S: "#194b6c",
  };

  startButton.addEventListener("click", (event) => {
    play();
  });

  function play() {
    win = false;
    order = [];
    playerOrder = [];
    flash = 0;
    intervalId = 0;
    turn = 1;
    levelCounter.innerHTML = 1;
    good = true;
    for (let i = 0; i < 20; i++) {
      order.push(Math.floor(Math.random() * 4) + 1);
    }
    compTurn = true;
    intervalId = setInterval(gameTurn, 800);
  }

  function gameTurn() {
    on = false;

    if (flash == turn) {
      clearInterval(intervalId);
      compTurn = false;
      clearColor();
      on = true; // Allow player to interact now
    }

    if (compTurn) {
      clearColor();
      setTimeout(() => {
        if (order[flash] == 1) one();
        if (order[flash] == 2) two();
        if (order[flash] == 3) three();
        if (order[flash] == 4) four();
        flash++;
      }, 200);
    }
  }

  function one() {
    try {
      let audio = document.getElementById("sound1");
      if (audio) {
        audio.play();
      }
    } catch (e) {
      // Ignore the error if the audio element is not found or cannot be played
    }
    pads.A.style.backgroundColor = "#166637";
  }

  function two() {
    try {
      let audio = document.getElementById("sound2");
      if (audio) {
        audio.play();
      }
    } catch (e) {
      // Ignore the error if the audio element is not found or cannot be played
    }
    pads.Q.style.backgroundColor = "#72261d";
  }

  function three() {
    try {
      let audio = document.getElementById("sound3");
      if (audio) {
        audio.play();
      }
    } catch (e) {
      // Ignore the error if the audio element is not found or cannot be played
    }
    pads.W.style.backgroundColor = "#776107";
  }

  function four() {
    try {
      let audio = document.getElementById("sound4");
      if (audio) {
        audio.play();
      }
    } catch (e) {
      // Ignore the error if the audio element is not found or cannot be played
    }
    pads.S.style.backgroundColor = "#194b6c";
  }

  function clearColor() {
    pads.A.style.backgroundColor = originalcolors.A;
    pads.Q.style.backgroundColor = originalcolors.Q;
    pads.W.style.backgroundColor = originalcolors.W;
    pads.S.style.backgroundColor = originalcolors.S;
  }


  function check() {
    if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1]) {
      good = false;
    }

    if (playerOrder.length == 20 && good) {
      winGame();
    }

    if (good == false) {
      flashColor();
      levelCounter.innerHTML = "NO!";
      setTimeout(() => {
        levelCounter.innerHTML = turn;
        clearColor();

        if (strict) {
          play();
        } else {
          compTurn = true;
          flash = 0;
          playerOrder = [];
          good = true;
          intervalId = setInterval(gameTurn, 800);
        }
      }, 800);
    }

    if (turn == playerOrder.length && good && !win) {
      turn++;
      playerOrder = [];
      compTurn = true;
      flash = 0;
      levelCounter.innerHTML = turn;
      intervalId = setInterval(gameTurn, 800);
    }
  }

  // Handle pad click
  pads.Q.addEventListener("click", (event) => {
    if (on) {
      playerOrder.push(1);
      check();
      one();
      if (!win) {
        setTimeout(() => {
          clearColor();
        }, 300);
      }
    }
  });

  pads.W.addEventListener("click", (event) => {
    if (on) {
      playerOrder.push(2);
      check();
      two();
      if (!win) {
        setTimeout(() => {
          clearColor();
        }, 300);
      }
    }
  });

  pads.A.addEventListener("click", (event) => {
    if (on) {
      playerOrder.push(3);
      check();
      three();
      if (!win) {
        setTimeout(() => {
          clearColor();
        }, 300);
      }
    }
  });

  pads.S.addEventListener("click", (event) => {
    if (on) {
      playerOrder.push(4);
      check();
      four();
      if (!win) {
        setTimeout(() => {
          clearColor();
        }, 300);
      }
    }
  });

});
  
