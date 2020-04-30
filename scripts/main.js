var map = new MapSystem('#map-canvas');
window.addEventListener('load', function() {
    map.initCanvas();
    map.startTimers();
});