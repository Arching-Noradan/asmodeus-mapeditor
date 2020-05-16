var map = new MapSystem('#map-canvas');
window.addEventListener('load', function() {
    map.initCanvas();
    map.startTimers();
    map.setBackground('assets/testing/background.png');
});