function MapTicker(map) {
    this.map = map;
    this.lastKeyName = 'N/A';

    this.tick = function(delta) {
        this.map.renderer.camera.tick(delta);
        this.map.renderer.player.tick(delta);
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
        if(e.key == ',')
            this.map.renderer.player.health -= this.map.renderer.player.health_max * 0.05;
        if(e.key == '.')
            this.map.renderer.player.health += this.map.renderer.player.health_max * 0.05;
        if(e.key == 'ArrowLeft' && e.ctrlKey)
            this.map.renderer.player.x -= 10;
        if(e.key == 'ArrowRight' && e.ctrlKey)
            this.map.renderer.player.x += 10;
        if(e.key == 'ArrowUp' && e.ctrlKey)
            this.map.renderer.player.y -= 10;
        if(e.key == 'ArrowDown' && e.ctrlKey)
            this.map.renderer.player.y += 10;

        if(this.map.renderer.camera.scale <= 0)
            this.map.renderer.camera.scale = 0.05;
    }
}