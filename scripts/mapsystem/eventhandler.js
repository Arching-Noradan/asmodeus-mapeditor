function MapEventHandler(map) {
    this.map = map;
    this.mousePos = {x: null, y: null}
    this.mouseDelta = {x: 0, y: 0}
    this.mouseHeld = false;
    this.mouseDragging = null;

    this.setContext = function(x, y, items) {
        this.map.renderer.contextMenu = new ContextMenu({
            items: items,
            x: x, y: y,
            font: '16px monospace',
            padding: 10,
            fancy: [1, 0.3, 0, 0.3]
        });
        this.map.renderRequired = true;
    }

    this.onMouseMove = function(ev) {
        this.mouseDelta.x = ev.x - this.mousePos.x;
        this.mouseDelta.y = ev.y - this.mousePos.y;
        this.mousePos.x = ev.x;
        this.mousePos.y = ev.y;

        if(this.map.renderer.contextMenu) {
            if(this.map.renderer.contextMenu.checkMouse(this.mousePos)) {
                const ndx = this.map.renderer.contextMenu.posToIndex(this.mousePos);
                this.map.renderer.contextMenu.activeIndex = ndx;
                this.map.renderRequired = true;
            }
        } else if(this.mouseHeld) {
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
        this.setContext(ev.x, ev.y, [
            'What',
            'The',
            'Peck'
        ]);
    }

    this.onMouseDown = function(ev) {
        ev.preventDefault();
        this.mouseHeld = true;
        if(this.map.renderer.contextMenu) {
            if(!this.map.renderer.contextMenu.checkMouse({x: ev.x, y: ev.y})) {
                this.map.renderer.contextMenu = null;
                this.map.renderRequired = true;
            }
        }
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