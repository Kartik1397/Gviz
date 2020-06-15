export function Node(x, y, velX, velY, color, size, val, force) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.val = val;
    this.force = force;
}

Node.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'crimson';
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = this.color;
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.val, this.x, this.y+7);
}

Node.prototype.update = function() {
    this.velX += this.force.x;
    this.velY += this.force.y;
    this.x += this.velX;
    this.y += this.velY;
}

Node.prototype.copy = function() {
    return new Node(this.x, this.y, this.velX, this.velY, this.color, this.size, this.val, this.force);
}