export function Edge(v1, v2, color) {
    this.v1 = v1;
    this.v2 = v2;
    this.color = color;
}

Edge.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.v1.x, this.v1.y);
    ctx.lineTo(this.v2.x, this.v2.y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
}