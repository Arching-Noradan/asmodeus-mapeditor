function Camera(renderer) {
    this.x = 0;
    this.y = 0;
    this.end_x = 0;
    this.end_y = 0;
    this.renderer = renderer;
    this.scale = 1;

    this.init = function() {
        this.canvas = this.renderer.canvas;
    }

    this.worldCoordToScreen = function(wp) {
        return {
            x: (wp.x - this.x) * this.scale,
            y: (wp.y - this.y) * this.scale,
        }
    }

    this.screenCoordToWorld = function(sp) {
        return {
            x: (sp.x / this.scale) + this.x,
            y: (sp.y / this.scale) + this.y,
        }
    }

    this.zoomAround = function(pos, factor) {
        let oldWorldMouse = this.screenCoordToWorld(pos);
        this.scale *= (1 + factor);
        let newWorldMouse = this.screenCoordToWorld(pos);
        this.x += (oldWorldMouse.x - newWorldMouse.x);
        this.y += (oldWorldMouse.y - newWorldMouse.y);
    }

    this.tick = function(delta) {

    }
}

function MapRenderer(map) {
    this.map = map;
    this.canvas = null;
    this.context = null;
    this.camera = new Camera(this);

    this.init = function() {
        this.canvas = this.map.canvas;
        this.context = this.map.context;
        this.camera.init();
    }

    this.render = function() {
        if(!this.map.renderRequired)
            return;
        this.clear();
        this.drawViewPort();
        for(let k in this.map.entities) {
            this.map.entities[k].render();
        }

        this.context.beginPath();
        this.context.fillStyle = '#787878';
        this.context.textBaseline = 'top';
        this.context.textAlign = 'left';
        this.context.font = '16px monospace';
        let cameraInfo = this.camera.x + ':' + this.camera.y + ':' + this.camera.scale;
        this.context.fillText(cameraInfo, 0, 0);
        this.context.fillText(this.map.ticker.lastKeyName, 0, 20);
        this.context.closePath();

    }

    this.clear = function() {
        this.context.beginPath();
        let w = this.context.canvas.width;
        let h = this.context.canvas.height;
        this.context.clearRect(0, 0, w, h);
        this.context.closePath();
    }

    this.drawViewPort = function() {
        if(!this.map.background || !this.map.background.ready)
            return false;
        let start = this.camera.worldCoordToScreen({x: 0, y: 0});
        let end = this.camera.worldCoordToScreen({
            x: this.map.background.image.width,
            y: this.map.background.image.height,
        });
        let width = end.x - start.x;
        let height = end.y - start.y;
        this.context.beginPath();
        this.context.drawImage(this.map.background.image, start.x, start.y, width, height);
        this.context.strokeStyle = 'black';
        this.context.strokeRect(start.x, start.y, width, height);
        this.context.closePath();
    }
} 