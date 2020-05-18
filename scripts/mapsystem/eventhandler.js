function MapEventHandler(map) {
    this.map = map;
    this.mousePos = {x: null, y: null}

    this.onMouseMove = function(ev) {
        this.mousePos.x = ev.x;
        this.mousePos.y = ev.y;
        let pos = this.map.renderer.camera.screenCoordToWorld(this.mousePos);
    }
    this.onMouseDown = function(ev) {

    }
    this.onMouseUp = function(ev) {

    }
    this.onKeyDown = function(ev) {
        if(ev.key == 'ArrowLeft' && !ev.ctrlKey)
            this.map.renderer.camera.x -= 10;
        if(ev.key == 'ArrowRight' && !ev.ctrlKey)
            this.map.renderer.camera.x += 10;
        if(ev.key == 'ArrowUp' && !ev.ctrlKey)
            this.map.renderer.camera.y -= 10;
        if(ev.key == 'ArrowDown' && !ev.ctrlKey)
            this.map.renderer.camera.y += 10;
        if(ev.key == '-')
            this.map.renderer.camera.scale -= 0.05;
        if(ev.key == '=')
            this.map.renderer.camera.scale += 0.05;
        if(this.map.renderer.camera.scale <= 0)
            this.map.renderer.camera.scale = 0.05;
    }
    this.onKeyUp = function(ev) {

    }
    this.onDragStart = function(ev) {

    }
    this.onDrag = function(ev) {

    }
    this.onDrop = function(ev) {

    }
}