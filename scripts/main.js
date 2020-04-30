var map = new MapSystem('#map-canvas');
window.addEventListener('load', function() {
    map.init_canvas();
    map.start_timers();
});