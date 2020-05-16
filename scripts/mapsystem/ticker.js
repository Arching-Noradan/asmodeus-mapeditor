function MapTicker(map) {
    this.map = map;
    this.lastKeyName = 'N/A';

    this.init = function() {
        
    }

    this.tick = function(delta) {
        this.map.renderer.camera.tick(delta);
        for(let k in this.map.entities) {
            this.map.entities[k].tick(delta);
        }
    }
}