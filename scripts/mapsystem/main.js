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
    this.eventsLog = [];

    this.background = null;

    this.setBackground = function(url) {
        this.background = new ImageAsset(url, () => {
            this.renderRequired = true;
        });
    }

    this.initCanvas = function() {
        let self = this;
        this.canvas = document.querySelector(this._cs);
        this.context = this.canvas.getContext('2d');
        window.addEventListener('resize', function(e) { self.resizeCanvas(e); });
        window.addEventListener('keydown', function(e) { self.eventHandler.onKeyDown(e); });
        window.addEventListener('keyup', function(e) { self.eventHandler.onKeyUp(e); });
        window.addEventListener('mousemove', function(e) { self.eventHandler.onMouseMove(e); });

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