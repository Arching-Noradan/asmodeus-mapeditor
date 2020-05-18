let map = null;
let logger = document.querySelector("pre.logger");

let loader = new Loader([
    ["lib_sprintf", "scripts/lib/sprintf.js"],
    ["lib_uilib", "scripts/lib/uilib.js"],
    ["utils", "scripts/utils.js"],
    ["api", "scripts/api.js"],
    ["map_player", "scripts/mapsystem/player.js"],
    ["map_event", "scripts/mapsystem/eventhandler.js"],
    ["map_renderer", "scripts/mapsystem/renderer.js"],
    ["map_ticker", "scripts/mapsystem/ticker.js"],
    ["map_main", "scripts/mapsystem/main.js"],
], (msg) => {
    console.log(msg);
    logger.innerText += msg + "\n";
});

loader.addLoadHook("__all__", function() {
    map = new MapSystem('#map-canvas');
    map.initCanvas();
    map.startTimers();
    map.setBackground('assets/testing/background.png');
    logger.style.display = "none";
});