window.hkc = new (function(w, d) {
    this.wnd = w;
    this.doc = d;
    // nothing to see here, yet
})(window, document);

window.ImageAsset = function ImageAsset(url, on_ready) {
    this.url = url;
    this.image = new Image();
    this.ready = false;
    this.progress = 0;
    this.imageSize = null;
    this.on_ready = on_ready || null;

    let self = this;
    this.image.onload = function(e) {
        self.ready = true;
        if(self.on_ready != null)
            self.on_ready(self);
        self.image.onload = null;
    }
    this.image.src = this.url;
}