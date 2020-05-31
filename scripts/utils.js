window.hkc = new (function(w, d) {
    this.wnd = w;
    this.doc = d;
    this.IS_DEBUG = false;

    this.log = function() {
        if(this.IS_DEBUG)
            console.log.apply(this, arguments);
    }

    this.averageImageColor = function(image) {
        let canv = document.createElement('canvas'),
            ctx = canv.getContext('2d'),
            blockSize = 10,
            rgb = {r:0,g:0,b:0},
            count = 0,
            width, height, data;
        width = canv.width = image.width;
        height = canv.height = image.height;
        ctx.drawImage(image, 0, 0);
        try {
            data = ctx.getImageData(0, 0, width, height);
        } catch(e) {
            return rgb;
        }
        for(let i = 0; i < data.data.length; i += (4 * blockSize)) {
            count++;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);
        return rgb;
    }

    this.uuid4 = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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
    this.avgColor = null;

    let self = this;
    this.image.onload = function(e) {
        self.avgColor = hkc.averageImageColor(self.image);
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
