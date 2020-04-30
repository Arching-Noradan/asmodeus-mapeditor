window.hkc = new (function(w, d) {
    this.wnd = w;
    this.doc = d;
    // nothing to see here, yet
})(window, document);

window.ImageAsset = function ImageAsset(url, on_ready) {
    console.log('[AssetLoader:ImageAsset]', 'Preparing', url);
    this.image = new Image();
    this.ready = false;
    this.progress = 0;
    this.loaded = null;
    this.imageSize = null;
    this.on_ready = on_ready || null;
    this.xhr = new XMLHttpRequest();

    let self = this;
    this.image.onload = function(e) {
        self.ready = true;
        if(self.on_ready != null)
            self.on_ready(self);
        self.image.onload = null;
        console.log('[AssetLoader:ImageAsset]', 'Ready', url);
    }

    this.xhr.open('GET', url);
    this.xhr.responseType = 'arraybuffer';
    this.xhr.onload = function(e) {
        let headers = self.xhr.getAllResponseHeaders(),
            ct_type = headers.match(/^Content-Type\:\s*(.*?)$/mi),
            mime_tp = ct_type[1] || 'image/png';
        let blob = new Blob([this.response], {type: mime_tp});
        self.image.src = window.URL.createObjectURL(blob);
        console.log('[AssetLoader:ImageAsset]', 'Loaded', url, self.image.src);
    }
    this.xhr.onprogress = function(e) {
        if(e.lengthComputable) {
            self.imageSize = e.total;
            self.loaded = e.loaded;
            self.progress = e.loaded / e.total;
        }
        let progress_int = Math.floor(self.progress * 100);
    }
    this.xhr.onloadstart = function() {
        console.log('[AssetLoader:ImageAsset]', 'Started', url);
    }
    this.xhr.onloadend = function() {
        console.log('[AssetLoader:ImageAsset]', 'Finished', url);
    }
    this.xhr.send();
    console.log('[AssetLoader:ImageAsset]', 'Sent request', url);
}