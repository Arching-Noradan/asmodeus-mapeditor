function Player(opts) {
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.avatar = new ImageAsset(opts.avatar, function(s) {
        s.canv = document.createElement('canvas');
        let w = s.canv.width = s.image.width,
            h = s.canv.height = s.image.height;
        s.ctx = s.canv.getContext('2d');
        s.ctx.beginPath();
        s.ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        s.ctx.clip();
        s.ctx.closePath();
        s.ctx.drawImage(s.image, 0, 0);
        s.image = s.canv;
    });
    this.health_max = opts.health_max || 100;
    this.health = opts.health || this.health_max;
    this.name = opts.name || 'Unknown';
    this.map = opts.map;
    this.ctx = null;
    this.renderer = null;

    this.render = function() {
        if(!this.ctx) {
            this.ctx = this.map.context;
            this.renderer = this.map.renderer;
        }
        let pos = this.renderer.camera.worldCoordToScreen({
            x: this.x, y: this.y
        });
        let end = this.renderer.camera.worldCoordToScreen({
            x: this.x + 100, y: this.y + 100
        });
        let width = end.x - pos.x, height = end.y - pos.y;
        let health = this.health / this.health_max;
        if(health < 0) health = 0;
        if(health > 1) health = 1;

        // Avatar
        this.ctx.beginPath();
        if(this.avatar.ready) {
            this.ctx.drawImage(this.avatar.image, pos.x, pos.y, width, height);
        } else {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.ellipse(pos.x + width / 2, pos.y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.closePath();

        // Avatar frame
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#d8d8d8';
        this.ctx.lineWidth = this.renderer.camera.scale * 2;
        this.ctx.ellipse(pos.x + width / 2, pos.y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();

        // Bars
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ffffff';
        this.ctx.rect(pos.x, end.y - height / 4, width, height * 0.1);
        this.ctx.rect(pos.x, end.y - height * 0.15, width, height * 0.15);
        this.ctx.fill();
        this.ctx.closePath();

        // Health Bar
        this.ctx.beginPath();
        this.ctx.fillStyle = '#ff9595';
        this.ctx.rect(pos.x, end.y - height / 4, width * health, height * 0.1);
        this.ctx.fill();
        this.ctx.closePath();

        // Frames
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#d8d8d8';
        this.ctx.lineWidth = 2;
        this.ctx.rect(pos.x, end.y - height / 4, width, height * 0.1);
        this.ctx.stroke();
        this.ctx.rect(pos.x, end.y - height * 0.15, width, height * 0.15);
        this.ctx.stroke();
        this.ctx.closePath();

        // Texts
        this.ctx.beginPath();
        let hp_string = Math.floor(this.health) + '/' + this.health_max + ' HP';
        this.ctx.font = Math.floor(height * 0.1) + 'px Montserrat';
        this.ctx.fillStyle = '#131313';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(hp_string, pos.x + width / 2, end.y - height * 0.24);
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.font = Math.floor(height * 0.15) + 'px Montserrat';
        this.ctx.fillText(this.name, pos.x + width / 2, end.y - height * 0.14);
        this.ctx.closePath();
    }

    this.tick = function(delta) {
        if(this.health < this.health_max) {
            this.health += delta * 0.1 * (this.health_max - this.health);
            if(this.health > this.health_max)
                this.health = this.health_max;
        }
    }
}