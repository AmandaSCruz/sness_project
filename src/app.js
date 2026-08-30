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
const gameContainer = document.getElementById("game");

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
window.EJS_browserMode = "mobile";
window.EJS_controlScheme = "snes";
window.EJS_VirtualGamepadSettings = [
  { type: "button", text: "X", id: "x", location: "right", left: 40, bold: true, input_value: 9 },
  { type: "button", text: "Y", id: "y", location: "right", top: 40, bold: true, input_value: 1 },
  { type: "button", text: "A", id: "a", location: "right", left: 81, top: 40, bold: true, input_value: 8 },
  { type: "button", text: "B", id: "b", location: "right", left: 40, top: 80, bold: true, input_value: 0 },
  { type: "dpad", id: "dpad", location: "left", left: "50%", top: "50%", joystickInput: false, inputValues: [4, 5, 6, 7] },
  { type: "button", text: "Start", id: "start", location: "center", left: 60, fontSize: 15, block: true, input_value: 3 },
  { type: "button", text: "Select", id: "select", location: "center", left: -5, fontSize: 15, block: true, input_value: 2 },
  { type: "button", text: "L", id: "l", location: "left", left: 3, top: -100, bold: true, block: true, input_value: 10 },
  { type: "button", text: "R", id: "r", location: "right", right: 3, top: -100, bold: true, block: true, input_value: 11 },
];
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

installEmulatorOverrides();

window.EJS_ready = () => {
  status.textContent = "";
  runOverlayGuards();
};

window.EJS_onGameStart = () => {
  status.textContent = "";
  closeEmulatorOverlay();
  runOverlayGuards();
};

function installEmulatorOverrides() {
  const style = document.createElement("style");
  style.id = "sness-emulator-overrides";
  style.textContent = `
    #game .ejs_ad_iframe,
    #game .ejs_popup_container,
    #game .ejs_context_menu,
    #game .ejs_menu_bar,
    #game .ejs_control_menu,
    #game .ejs_settings,
    #game .ejs_settings_menu,
    #game .ejs_virtualGamepad_open {
      display: none !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    #game .ejs_virtualGamepad_parent {
      z-index: 2147483647 !important;
      pointer-events: none !important;
    }

    #game .ejs_virtualGamepad_left,
    #game .ejs_virtualGamepad_right,
    #game .ejs_virtualGamepad_top,
    #game .ejs_virtualGamepad_bottom {
      z-index: 2147483647 !important;
      background: transparent !important;
      box-shadow: none !important;
      pointer-events: none !important;
    }

    #game .ejs_virtualGamepad_button,
    #game .ejs_dpad_main,
    #game .ejs_dpad_main * {
      pointer-events: auto !important;
      z-index: 2147483647 !important;
    }
  `;
  document.head.appendChild(style);
}

function neutralizeEmulatorOverlay() {
  document
    .querySelectorAll(
      "#game .ejs_ad_iframe, #game .ejs_popup_container, #game .ejs_context_menu, #game .ejs_menu_bar, #game .ejs_control_menu, #game .ejs_settings, #game .ejs_settings_menu, #game .ejs_virtualGamepad_open"
    )
    .forEach((element) => {
      element.style.setProperty("display", "none", "important");
      element.style.setProperty("opacity", "0", "important");
      element.style.setProperty("pointer-events", "none", "important");
    });

  document
    .querySelectorAll(
      "#game .ejs_virtualGamepad_left, #game .ejs_virtualGamepad_right, #game .ejs_virtualGamepad_top, #game .ejs_virtualGamepad_bottom"
    )
    .forEach((element) => {
      element.style.setProperty("z-index", "2147483647", "important");
      element.style.setProperty("background", "transparent", "important");
      element.style.setProperty("box-shadow", "none", "important");
      element.style.setProperty("pointer-events", "none", "important");
    });

  document
    .querySelectorAll("#game .ejs_virtualGamepad_parent")
    .forEach((element) => {
      element.style.setProperty("z-index", "2147483647", "important");
      element.style.setProperty("pointer-events", "none", "important");
    });

  document
    .querySelectorAll("#game .ejs_virtualGamepad_button, #game .ejs_dpad_main, #game .ejs_dpad_main *")
    .forEach((element) => {
      element.style.setProperty("z-index", "2147483647", "important");
      element.style.setProperty("pointer-events", "auto", "important");
    });
}

function closeEmulatorOverlay() {
  const close = () => {
    window.EJS_emulator?.menu?.close?.();
    window.EJS_emulator?.closePopup?.();
  };

  close();
  setTimeout(close, 100);
  setTimeout(close, 500);
  setTimeout(close, 1000);
}

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

function runOverlayGuards() {
  neutralizeEmulatorOverlay();
  preventVirtualGamepadOverlay();
}

[250, 750, 1500, 3000].forEach((delay) => {
  setTimeout(runOverlayGuards, delay);
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    runOverlayGuards();
  }
});

fullscreenButton.addEventListener(
  "pointerdown",
  async () => {
    fullscreenButton.style.pointerEvents = "none";
    fullscreenButton.remove();

    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      status.textContent = "";
    }
  },
  { once: true }
);
