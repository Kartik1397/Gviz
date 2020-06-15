export function Force(x, y) {
    this.x = x;
    this.y = y;
}

Force.prototype.add = function(f) {
    this.x += f.x;
    this.y += f.y;
}

Force.prototype.scale = function(v) {
    this.x *= v;
    this.y *= v;
}

export function dist(v1, v2) {
    return Math.sqrt((v2.x-v1.x)*(v2.x-v1.x) + (v2.y-v1.y)*(v2.y-v1.y));
}

export function uvec(v1, v2) {
    let f = new Force(v2.x-v1.x, v2.y-v1.y);
    let d = dist(v1, v2);
    f.scale(1/d);
    return f;
}

export function mag(x, y) {
    return Math.sqrt(x*x + y*y);
}