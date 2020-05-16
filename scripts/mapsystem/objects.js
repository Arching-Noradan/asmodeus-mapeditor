'use strict';
let APIObject = function() {
    this._fields = [];
}

APIObject.toPrimitive = function(value) {
    if(value instanceof Array)
        return value.map((elem) => {
            return APIObject.toPrimitive(elem);
        });
    else if(value instanceof APIObject)
        return value.jsonify();
    else
        return value;
}

APIObject.prototype.jsonify = function() {
    let response = {};
    for(let i = 0; i < this._fields.length; i++) {
        let key = this._fields[i];
        let value = this[key];
        response[key] = APIObject.toPrimitive(value);
    }
    return response;
}

APIObject.checkType = function(key, value, expected) {
    if(expected instanceof Array) {
        for(let i = 0; i < value.length; i++) {
            let val = value[i];
            APIObject.checkType(key + '[' + i + ']', val, expected[0]);
        }
    } else if('string' == typeof expected) {
        if(expected != typeof value) {
            let txt = "Invalid type of " + key + ": ";
            txt += "expected to be type of " + expected + ", ";
            txt += "got " + (typeof value) + ".";
            throw new TypeError(txt);
        }
    } else if(!(value instanceof expected)) {
        let txt = "Invalid type of " + key + ": ";
        txt += "expected to be instance of " + expected.constructor.name + ", ";
        txt += "got " + value.constructor.name + ".";
        throw new TypeError(txt);
    }
    return value;
}


let Coordinates = function(x, y) {
    APIObject.call(this);
    this._fields = ['x', 'y'];
    this.x = APIObject.checkType('x', x, 'number');
    this.y = APIObject.checkType('y', y, 'number');
}
Coordinates.prototype = Object.create(APIObject.prototype);
Coordinates.prototype.constructor = Coordinates;

let MapObject = function(uid, type) {
    APIObject.call(this);
    this._fields = ['uid', 'type'];
    this.uid = APIObject.checkType('uid', uid, 'string');
    this.type = APIObject.checkType('type', type, 'string');
}
MapObject.prototype = Object.create(APIObject.prototype);
MapObject.prototype.constructor = MapObject;

let NPC = function(uid, icon, form, hp, coordinates) {
    MapObject.call(this, uid, 'npc');
    this._fields = [
        'uid', 'type', 'icon',
        'form', 'hp', 'coordinates'
    ];
    this.icon = APIObject.checkType('icon', icon, 'string');
    this.form = APIObject.checkType('form', form, 'string');
    this.hp = APIObject.checkType('hp', hp, 'number');
    this.coordinates = APIObject.checkType('coordinates', coordinates, Coordinates);
}
NPC.prototype = Object.create(MapObject.prototype);
NPC.prototype.constructor = NPC;

let Map = function(name, uid, owner, file, pps, objects) {
    APIObject.call(this);
    this._fields = [
        'name', 'uid', 'owner',
        'file', 'pixel_per_square',
        'map_objects'
    ];
    this.map_name = APIObject.checkType('name', name, 'string');
    this.map_uid = APIObject.checkType('uid', uid, 'string');
    this.map_owner = APIObject.checkType('owner', owner, 'string');
    this.map_file = APIObject.checkType('file', file, 'string');
    this.pixel_per_square = APIObject.checkType('pixel_per_square', pps, 'number');
    this.map_objects = APIObject.checkType('map_objects', objects, [MapObject]);
}
Map.prototype = Object.create(APIObject.prototype);
Map.prototype.constructor = Map;
