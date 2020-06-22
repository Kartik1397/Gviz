export function Edge(v1, v2, color) {
    this.v1 = v1;
    this.v2 = v2;
    this.color = color;
}

Edge.prototype.draw = function(ctx, directed) {
    ctx.beginPath();
    ctx.moveTo(this.v1.x, this.v1.y);
    ctx.lineTo(this.v2.x, this.v2.y);
    if (directed === true) {
        let angle = Math.atan2(this.v1.y-this.v2.y, this.v1.x-this.v2.x);
        let x = Math.cos(angle) * 20 + this.v2.x;
        let y = Math.sin(angle) * 20 + this.v2.y;
        ctx.moveTo(x, y);
        let angle1 = angle - Math.PI/15;
        let x1 = Math.cos(angle1)*30 + this.v2.x;
        let y1 = Math.sin(angle1)*30 + this.v2.y;
        ctx.lineTo(x1, y1);
        ctx.moveTo(x, y);
        angle1 = angle + Math.PI/15;
        x1 = Math.cos(angle1)*30 + this.v2.x;
        y1 = Math.sin(angle1)*30 + this.v2.y;
        ctx.lineTo(x1, y1);
    }
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
}