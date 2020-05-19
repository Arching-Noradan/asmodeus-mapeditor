function MapSystem(canv_sel) {
    this._cs = canv_sel;
    this.canvas = null;
    this.context = null;
    this.lastFrame = null;
    this.lastTick = null;
    this.timerFrame = null;
    this.timerTick = null;
    this.tps = 20;
    this.renderRequired = true;

    this.eventHandler = new MapEventHandler(this);
    this.renderer = new MapRenderer(this);
    this.ticker = new MapTicker(this);
    this.api = new EditorAPI({
        'api_url': 'https://nevermind.some.host/api',
        'token': localStorage.getItem('asmodeus-api-token'),
    });

    this.entities = {};
    this.assets = {background: null};
    this.eventsLog = [];
    this.debugString = 'Lmao';

    this.setBackground = function(url) {
        this.assets.background = new ImageAsset(url, () => {
            let rgb = this.assets.background.avgColor,
                color = Sprintf.sprintf('rgb(%d, %d, %d)', rgb.r, rgb.g, rgb.b);
            this.canvas.style.backgroundColor = color;
            this.renderer.updateAssetLoader();
        }, (s, e, p) => {
            this.renderer.updateAssetLoader();
        });
    }

    this.initCanvas = function() {
        let self = this;
        this.canvas = document.querySelector(this._cs);
        this.context = this.canvas.getContext('2d');
        window.addEventListener('resize', function(e) { self.resizeCanvas(e); });
        window.addEventListener('keydown', function(e) { self.eventHandler.onKeyDown(e); });
        window.addEventListener('keyup', function(e) { self.eventHandler.onKeyUp(e); });
        window.addEventListener('mousedown', function(e) { self.eventHandler.onMouseDown(e); });
        window.addEventListener('mousemove', function(e) { self.eventHandler.onMouseMove(e); });
        window.addEventListener('mouseup', function(e) { self.eventHandler.onMouseUp(e); });
        window.addEventListener('wheel', function(e) { self.eventHandler.onWheel(e); });
        window.addEventListener('contextmenu', function(e) { self.eventHandler.onContextMenu(e); });

        this.resizeCanvas();
        this.renderer.init();
        this.ticker.init();

        this.canvas.dataset.loaded = true;
    }

    this.startTimers = function() {
        if(!this.timerFrame && !this.timerTick) {
            this.clockFrame();
            this.clockTick();
        }
    }

    this.resizeCanvas = function() {
        if(this.canvas) {
            this.canvas.width = Math.floor(this.canvas.offsetWidth);
            this.canvas.height = Math.floor(this.canvas.offsetHeight);
        }
        this.renderRequired = true;
    }

    this.frame = function(delta) {
        this.renderer.render(delta);
    }

    this.tick = function(delta) {
        this.ticker.tick(delta);
    }

    this.clockFrame = function() {
        let delta, self = this;
        if(this.lastFrame)
            delta = new Date().getTime() - this.lastFrame;
        else
            delta = 0;
        this.frame(delta / 1000);
        this.lastFrame = new Date().getTime();
        this.timerFrame = window.requestAnimationFrame(function() {
            self.clockFrame();
        });
    }

    this.clockTick = function() {
        let delta, self = this;
        if(this.lastTick)
            delta = new Date().getTime() - this.lastTick;
        else
            delta = 0;
        this.tick(delta / 1000);
        this.lastTick = new Date().getTime();
        this.timerTick = window.setTimeout(function() {
            self.clockTick();
        }, 1000 / this.tps);
    }
}