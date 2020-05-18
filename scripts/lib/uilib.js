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
    this.format = opts.format || "Loading {done}/{total} ({percents}%)";
}