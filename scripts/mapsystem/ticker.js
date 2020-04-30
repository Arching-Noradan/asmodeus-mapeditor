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

    this.onKeyDown = function(e) {
        console.log(e);
        this.lastKeyName = e.key;
        if(e.key == 'ArrowLeft' && !e.ctrlKey)
            this.map.renderer.camera.x -= 10;
        if(e.key == 'ArrowRight' && !e.ctrlKey)
            this.map.renderer.camera.x += 10;
        if(e.key == 'ArrowUp' && !e.ctrlKey)
            this.map.renderer.camera.y -= 10;
        if(e.key == 'ArrowDown' && !e.ctrlKey)
            this.map.renderer.camera.y += 10;
        if(e.key == '-')
            this.map.renderer.camera.scale -= 0.05;
        if(e.key == '=')
            this.map.renderer.camera.scale += 0.05;
        if(this.map.renderer.camera.scale <= 0)
            this.map.renderer.camera.scale = 0.05;
    }
}