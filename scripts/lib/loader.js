function Loadable(src, name, ldr) {
    this.src = src, this.name = name;
    this.loader = ldr;
    this.loaded = false;
    this.loadhooks = [];
    this.script = document.createElement('script');
    this.script.setAttribute('src', this.src + '?nonce=' + new Date().getTime());
    this.script.addEventListener('load', (e) => {
        this.loaded = true;
        if(this.loader.debugCallback)
            this.loader.debugCallback('Loaded: ' + name);
        this.onload();
    });

    this.onload = function() {
        this.loadhooks.forEach((hook, i) => {
            hook(this);
        });
        this.loader.checkAll();
    }

    document.head.appendChild(this.script);
}

function Loader(files, debugCallback) {
    this._files = files;
    this.debugCallback = debugCallback;
    this.scripts = {'__all__': {'loadhooks': [], 'loaded': true}};
    for (let i = 0; i < files.length; i++) {
        let name = files[i][0], path = files[i][1];
        this.scripts[name] = new Loadable(path, name, this);
        if(this.debugCallback)
            this.debugCallback('Prepared: ' + name);
    }

    this.checkAll = function() {
        for(let scriptName in this.scripts) {
            if(!this.scripts[scriptName].loaded)
                return false;
        }
        this.scripts.__all__.loadhooks.forEach((hook, i) => {
            hook(this);
        });
    }

    this.addLoadHook = function(name, callback) {
        this.scripts[name].loadhooks.push(callback);
    }
}
