function MapTicker(map) {
    this.map = map;
    this.lastKeyName = 'N/A';

    this.init = function() {
        
    }

    this.tick = function(delta) {
        this.map.renderer.camera.tick(delta);
        this.map.entities.forEach(function(entity) {
            entity.tick(delta);
        })
    }
}