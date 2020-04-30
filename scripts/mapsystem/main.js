function MapSystem(canv_sel) {
    this._cs = canv_sel;
    this.canvas = null;
    this.context = null;
    this.last_frame = null;
    this.last_tick = null;
    this.timer_frame = null;
    this.timer_tick = null;
    this.tps = 60;

    this.renderer = new MapRenderer(this);
    this.ticker = new MapTicker(this);

    this.entities = [
        new Player({
            avatar: 'assets/testing/ava.jpg',
            map: this,
            health: 50,
            name: 'Hat Kid'
        })
    ];

    this.init_canvas = function() {
        let self = this;
        this.canvas = document.querySelector(this._cs);
        this.context = this.canvas.getContext('2d');
        window.addEventListener('resize', function(e) {
            self.resizeCanvas(e);
        });
        window.addEventListener('keydown', function(e) {
            self.onKeyDown(e);
        });
        this.resizeCanvas();

        this.renderer.init();
        this.ticker.init();

        this.canvas.dataset.loaded = true;
    }

    this.start_timers = function() {
        if(!this.timer_frame && !this.timer_tick) {
            this.clk_frame();
            this.clk_tick();
        }
    }

    this.onKeyDown = function(e) {
        this.ticker.onKeyDown(e);
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

    this.clk_frame = function() {
        let delta, self = this;
        if(this.last_frame)
            delta = new Date().getTime() - this.last_frame;
        else
            delta = 0;
        this.frame(delta / 1000);
        this.last_frame = new Date().getTime();
        this.timer_frame = window.requestAnimationFrame(function() {
            self.clk_frame();
        });
    }

    this.clk_tick = function() {
        let delta, self = this;
        if(this.last_tick)
            delta = new Date().getTime() - this.last_tick;
        else
            delta = 0;
        this.tick(delta / 1000);
        this.last_tick = new Date().getTime();
        this.timer_tick = window.setTimeout(function() {
            self.clk_tick();
        }, 1000 / this.tps);
    }
}