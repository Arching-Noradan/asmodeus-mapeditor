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

    this.assetLoaders = {};
    this.contextMenu = null;
    this.partialRefresh = {};

    this.init = function() {
        this.canvas = this.map.canvas;
        this.context = this.map.context;
        this.camera.init();
    }

    this.render = function(delta) {
        if(this.map.renderRequired) {
            this.clear();
            this.drawViewPort();
            for(let k in this.map.entities) {
                this.map.entities[k].render();
            }

            this.renderAssetLoaders();
        }

        if(this.contextMenu && (this.partialRefresh.contextMenu || this.map.renderRequired))
            this.contextMenu.render(this.context, delta);

        this.map.renderRequired = false;
    }

    this.clear = function() {
        this.context.beginPath();
        let w = this.context.canvas.width;
        let h = this.context.canvas.height;
        this.context.clearRect(0, 0, w, h);
        this.context.closePath();
    }

    this.drawViewPort = function() {
        if(!this.map.assets.background || !this.map.assets.background.ready)
            return false;
        let start = this.camera.worldCoordToScreen({x: 0, y: 0});
        let end = this.camera.worldCoordToScreen({
            x: this.map.assets.background.image.width,
            y: this.map.assets.background.image.height,
        });
        let width = end.x - start.x;
        let height = end.y - start.y;
        this.context.beginPath();
        this.context.drawImage(this.map.assets.background.image, start.x, start.y, width, height);
        this.context.strokeStyle = 'black';
        this.context.strokeRect(start.x, start.y, width, height);
        this.context.closePath();
    }

    this.renderAssetLoaders = function() {
        let y = 0;
        for(let k in this.assetLoaders) {
            let bar = this.assetLoaders[k];
            bar.x = 0;
            bar.y = y;
            bar.render(this.context);
            y += bar.h + 1;
        }
    }

    this.updateAssetLoader = function() {
        for(let k in this.map.assets) {
            let asset = this.map.assets[k];
            if(!asset || asset.ready)
                delete this.assetLoaders[k];
            else if(this.assetLoaders[k] != null)
                this.assetLoaders[k].update(asset.loaded / 1024, asset.imageSize / 1024);
            else
                this.assetLoaders[k] = new UIProgressBar({
                    x: 0, y: 0, w: 250, h: 20,
                    format: k + ': %(done)dk/%(total)dk (%(percents)7.3f%%)',
                    done: asset.loaded / 1024, total: asset.imageSize / 1024,
                    font: '10px monospace'
                });
        }
        this.map.renderRequired = true;
    }
}
