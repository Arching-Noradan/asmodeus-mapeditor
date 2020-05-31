function UIProgressBar(opts) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.w = opts.w || 100;
    this.h = opts.h || 20;
    this.border = opts.border || "#777777";
    this.background = opts.background || opts.bg || "#ffffff";
    this.fill = opts.fill || "#78fa78";
    this.textColor = opts.foreground || "#000000";
    this.font = opts.font || "8px monospace";
    this.format = opts.format || "Loading %(done)f/%(total)f (%(percents)7.3f%%)";
    this.done = opts.done;
    this.total = opts.total;
    this.tempCanvas = document.createElement('canvas');
    this.tempContext = this.tempCanvas.getContext('2d');

    this.update = function(done, total) {
        this.done = done;
        this.total = total || this.total;
    }

    this.render = function(ctx) {
        if(this.tempCanvas.width != this.w || this.tempCanvas.height != this.h) {
            this.tempCanvas.width = this.w;
            this.tempCanvas.height = this.h;
        }

        let params = {done: this.done, total: this.total, percents: 0}
        if('number' != typeof this.done || isNaN(this.done))
            params.done = -1;
        if('number' != typeof this.total || isNaN(this.total))
            params.total = -1;
        if(params.done == params.total && params.done == -1)
            params.percents = -1;
        else
            params.percents = this.done * 100 / this.total;
        let text = Sprintf.vsprintf(this.format, params);

        // Background
        this.tempContext.beginPath();
        this.tempContext.fillStyle = this.background;
        this.tempContext.rect(0, 0, this.w, this.h);
        this.tempContext.fill();
        this.tempContext.closePath();

        // Bar
        this.tempContext.beginPath();
        this.tempContext.fillStyle = this.fill;
        this.tempContext.rect(0, 0, this.w * params.percents / 100, this.h);
        this.tempContext.fill();
        this.tempContext.closePath();

        // Text
        this.tempContext.beginPath();
        this.tempContext.fillStyle = this.textColor;
        this.tempContext.font = this.font;
        this.tempContext.textBaseline = 'middle';
        this.tempContext.textAlign = 'left';
        this.tempContext.fillText(text, 1, this.h / 2);
        this.tempContext.closePath();

        // Border
        this.tempContext.beginPath();
        this.tempContext.strokeStyle = this.border;
        this.tempContext.rect(0, 0, this.w, this.h);
        this.tempContext.stroke()
        this.tempContext.closePath();

        ctx.drawImage(this.tempCanvas, this.x, this.y);
    }
}

function ContextMenu(opts) {
    this.items = opts.items || ["Oh crap"];
    this.background = opts.background || '#efefef';
    this.activebackground = opts.activebackground || opts.background || '#ccccff';
    this.foreground = opts.foreground || '#131313';
    this.activeforeground = opts.activeforeground || opts.foreground || '#131313';
    this.border = opts.border || '#000000';
    this.font = opts.font || '10px monospace';
    this.padding = opts.padding || 4;
    this.x = opts.x || 0;
    this.y = opts.y || 0;

    this.tempCanvas = document.createElement('canvas');
    this.tempContext = this.tempCanvas.getContext('2d');
    this.activeIndex = -1;
    this._ready = false;
    this.w = 0;
    this.h = 0;

    this.prepare = function() {
        this.tempContext.font = this.font;
        const textHeight = ~~/\d+/.exec(this.font)[0];
        let maxTextWidth = 0;
        this.items.forEach((v) => {
            if('object' == typeof v)
                v = v.title;
            const dims = this.tempContext.measureText(v);
            if(dims.width > maxTextWidth)
                maxTextWidth = dims.width;
        });
        this.w = this.tempCanvas.width = maxTextWidth + this.padding * 2;
        this.h = this.tempCanvas.height = this.items.length * (textHeight + this.padding * 2);
        this._ready = true;
    }

    this.render = function(ctx) {
        if(!this._ready)
            this.prepare();
        const textHeight = ~~/\d+/.exec(this.font)[0];
        this.items.forEach((v, i) => {
            const bg = i == this.activeIndex ? this.activebackground : this.background;
            const fg = i == this.activeIndex ? this.activeforeground : this.foreground;
            const text = 'object' == typeof v ? v.title : v;
            const y = this.padding + (textHeight + this.padding * 2) * i;
            this.tempContext.beginPath();
            this.tempContext.fillStyle = bg;
            this.tempContext.rect(0, y - this.padding, this.tempCanvas.width, textHeight + this.padding * 2);
            this.tempContext.fill();
            this.tempContext.closePath();
            this.tempContext.beginPath();
            this.tempContext.fillStyle = fg;
            this.tempContext.font = this.font;
            this.tempContext.textBaseline = 'top';
            this.tempContext.textAlign = 'left';
            this.tempContext.fillText(text, this.padding, y);
            this.tempContext.closePath();
        });
        this.tempContext.beginPath();
        this.tempContext.strokeStyle = this.border;
        this.tempContext.rect(0, 0, this.w, this.h);
        this.tempContext.stroke();
        this.tempContext.closePath();

        ctx.drawImage(this.tempCanvas, this.x, this.y);
    }

    this.checkMouse = function(pos) {
        if(!this._ready)
            this.prepare();
        return pos.x >= this.x && pos.x <= this.x + this.w
            && pos.y >= this.y && pos.y <= this.y + this.h;
    }

    this.posToIndex = function(pos) {
        const cellHeight = ~~/\d+/.exec(this.font)[0] + 2 * this.padding;
        if(!this.checkMouse(pos)) return -1;
        return Math.floor((pos.y - this.y) / cellHeight);
    }
}