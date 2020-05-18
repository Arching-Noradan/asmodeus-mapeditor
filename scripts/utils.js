window.hkc = new (function(w, d) {
    this.wnd = w;
    this.doc = d;
    this.IS_DEBUG = false;

    this.log = function() {
        if(this.IS_DEBUG)
            console.log.apply(this, arguments);
    }
})(window, document);

window.ImageAsset = function ImageAsset(url, onReady, onProgress) {
    hkc.log('[AssetLoader:ImageAsset]', 'Preparing', url);
    this.image = new Image();
    this.ready = false;
    this.progress = 0;
    this.loaded = null;
    this.imageSize = null;
    this.onReady = onReady || null;
    this.onProgress = onProgress || null;
    this.xhr = new XMLHttpRequest();

    let self = this;
    this.image.onload = function(e) {
        self.ready = true;
        if(self.onReady != null)
            self.onReady(self);
        self.image.onload = null;
        hkc.log('[AssetLoader:ImageAsset]', 'Ready', url);
    }

    this.xhr.open('GET', url);
    this.xhr.responseType = 'arraybuffer';

    this.xhr.onload = function(e) {
        let headers = self.xhr.getAllResponseHeaders(),
            ct_type = headers.match(/^Content-Type\:\s*(.*?)$/mi),
            mime_tp = ct_type[1] || 'image/png';
        let blob = new Blob([this.response], {type: mime_tp});
        self.image.src = window.URL.createObjectURL(blob);
        hkc.log('[AssetLoader:ImageAsset]', 'Loaded', url, self.image.src);
    }

    this.xhr.onprogress = function(e) {
        if(e.lengthComputable) {
            self.imageSize = e.total;
            self.loaded = e.loaded;
            self.progress = e.loaded / e.total;
            let progress_int = Math.floor(self.progress * 100);
            if(self.onProgress)
                self.onProgress(self, e, progress_int);
        }
    }

    this.xhr.onloadstart = function() {
        hkc.log('[AssetLoader:ImageAsset]', 'Started', url);
    }

    this.xhr.onloadend = function() {
        hkc.log('[AssetLoader:ImageAsset]', 'Finished', url);
    }

    this.xhr.send();
    hkc.log('[AssetLoader:ImageAsset]', 'Sent request', url);
}
