function MapEventHandler(map) {
    this.map = map;
    this.mousePos = {x: null, y: null}
    this.mouseDelta = {x: 0, y: 0}
    this.mouseHeld = false;
    this.mouseDragging = null;

    this.onMouseMove = function(ev) {
        this.mouseDelta.x = ev.x - this.mousePos.x;
        this.mouseDelta.y = ev.y - this.mousePos.y;
        this.mousePos.x = ev.x;
        this.mousePos.y = ev.y;

        let pos = this.map.renderer.camera.screenCoordToWorld(this.mousePos);
        if(this.mouseHeld) {
            if(this.mouseDragging === null) {
                this.onDragStart(ev);
                this.mouseDragging = ev.buttons;
            } else {
                this.onDrag(ev);
            }
        }
    }
    this.onContextMenu = function(ev) {
        ev.preventDefault();
    }
    this.onMouseDown = function(ev) {
        ev.preventDefault();
        this.mouseHeld = true;
    }
    this.onMouseUp = function(ev) {

        this.mouseHeld = false;
        if(this.mouseDragging !== null) {
            this.mouseDragging = null;
            this.onDrop(ev);
        }
    }
    this.onKeyDown = function(ev) {

    }
    this.onKeyUp = function(ev) {

    }
    this.onDragStart = function(ev) {

    }
    this.onDrag = function(ev) {
        if(this.mouseDragging == 4) {
            this.map.renderer.camera.x -= this.mouseDelta.x;
            this.map.renderer.camera.y -= this.mouseDelta.y;
        }
        this.map.renderRequired = true;
    }
    this.onDrop = function(ev) {

    }
    this.onWheel = function(ev) {
        if(ev.deltaY < 0)
            this.map.renderer.camera.zoomAround(this.mousePos, 0.1);
        if(ev.deltaY > 0)
            this.map.renderer.camera.zoomAround(this.mousePos, -0.1);
        this.map.renderRequired = true;
    }
}