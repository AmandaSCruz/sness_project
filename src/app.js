const games = {
  mario: {
    id: 1,
    code: "mario81982374",
    name: "Super Mario World",
    url: "roms/Super Mario World (U) [!].zip",
  },
  zelda: {
    id: 2,
    code: "zelda26363236",
    name: "The Legend of Zelda: A Link to the Past",
    url: "roms/Legend of Zelda, The_ A Link to the Past.zip",
  },
  bomberman: {
    id: 3,
    code: "bomberman01921029192",
    name: "Super Bomberman 5 Gold Cartridge",
    url: "roms/Super Bomberman 5 Gold Cartridge (J) [!].zip",
  },
};

const params = new URLSearchParams(window.location.search);
const requestedGame = params.get("game")?.toLowerCase();
const gameKey =
  Object.keys(games).find((key) => key === requestedGame || games[key].code === requestedGame) ??
  "mario";
const game = games[gameKey];
const status = document.getElementById("status");
const fullscreenButton = document.getElementById("fullscreen");

document.title = game.name;

window.EJS_player = "#game";
window.EJS_core = "snes";
window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
window.EJS_pathToData = "https://cdn.emulatorjs.org/stable/data/";
window.EJS_gameUrl = encodeURI(game.url);
window.EJS_gameName = game.name;
window.EJS_gameID = game.id;
window.EJS_startOnLoaded = true;
window.EJS_fullscreenOnLoaded = true;
window.EJS_mouse = false;
window.EJS_multitap = true;
window.EJS_language = "pt-BR";
window.EJS_color = "#14f195";
window.EJS_backgroundColor = "#000";
window.EJS_alignStartButton = "center";
window.EJS_startButtonName = "Iniciar";
window.EJS_AdUrl = "";
window.EJS_AdTimer = -1;
window.EJS_AdMode = 0;
window.EJS_AdSize = ["0", "0"];
window.EJS_askBeforeExit = false;

status.textContent = `Carregando ${game.name}...`;

window.EJS_ready = () => {
  status.textContent = "";
};

window.EJS_onGameStart = () => {
  status.textContent = "";
  preventVirtualGamepadOverlay();
};

function preventVirtualGamepadOverlay() {
  const selectors = [
    ".ejs_virtualGamepad_left",
    ".ejs_virtualGamepad_right",
    ".ejs_virtualGamepad_top",
    ".ejs_virtualGamepad_bottom",
  ];

  document.querySelectorAll(selectors.join(",")).forEach((element) => {
    if (element.dataset.snessTouchGuard === "true") {
      return;
    }

    element.dataset.snessTouchGuard = "true";
    element.addEventListener(
      "touchstart",
      (event) => {
        if (event.target === element) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
      { passive: false }
    );
  });
}

const observer = new MutationObserver(preventVirtualGamepadOverlay);
observer.observe(document.getElementById("game"), { childList: true, subtree: true });

fullscreenButton.addEventListener(
  "click",
  async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      status.textContent = "";
    } finally {
      fullscreenButton.remove();
    }
  },
  { once: true }
);
