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