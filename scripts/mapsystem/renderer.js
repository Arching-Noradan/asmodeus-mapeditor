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
        let half_w = this.canvas.width / 2,
            half_h = this.canvas.height / 2
        return {
            x: (wp.x - this.x) * this.scale,
            y: (wp.y - this.y) * this.scale,
        }
    }

    this.tick = function(delta) {

    }
}

function MapRenderer(map) {
    this.map = map;
    this.canvas = null;
    this.context = null;
    this.camera = new Camera(this);
    this.bg = new ImageAsset('assets/testing/background.png');

    this.init = function() {
        this.canvas = this.map.canvas;
        this.context = this.map.context;
        this.camera.init();
    }

    this.render = function() {
        this.clear();
        this.drawViewPort();
        this.map.entities.forEach(function(entity) {
            entity.render();
        });

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
        if(!this.bg.ready)
            return false;
        let start = this.camera.worldCoordToScreen({x: 0, y: 0});
        let end = this.camera.worldCoordToScreen({
            x: this.bg.image.width,
            y: this.bg.image.height,
        });
        let width = end.x - start.x;
        let height = end.y - start.y;
        this.context.beginPath();
        this.context.drawImage(this.bg.image, start.x, start.y, width, height);
        this.context.strokeStyle = 'black';
        this.context.strokeRect(start.x, start.y, width, height);
        this.context.closePath();
    }
} 