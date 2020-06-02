const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

const width = canvas.width = 970;
const height = canvas.height = 600;
const radius = 10;
const edgeLen = 100;

function Force(x, y) {
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

function Node(x, y, velX, velY, color, size, val, force) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.val = val;
    this.force = force;
}

Node.prototype.draw = function() {
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

function Edge(v1, v2, color) {
    this.v1 = v1;
    this.v2 = v2;
    this.color = color;
}

Edge.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.v1.x, this.v1.y);
    ctx.lineTo(this.v2.x, this.v2.y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function dist(v1, v2) {
    return Math.sqrt((v2.x-v1.x)*(v2.x-v1.x) + (v2.y-v1.y)*(v2.y-v1.y));
}

function uvec(v1, v2) {
    let f = new Force(v2.x-v1.x, v2.y-v1.y);
    let d = dist(v1, v2);
    f.scale(1/d);
    return f;
}

function mag(x, y) {
    return Math.sqrt(x*x + y*y);
}

let nodes = [];
let edges = [];
let adj = [];

function loop() {
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < edges.length; i++) {
        edges[i].draw();
    }

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].draw();
        let resultant = new Force(0, 0);
        for (let j = 0; j < nodes.length; j++) {
            if (j !== i) {
                let f = new Force(0, 0);
                if (adj[i][j]) {
                    f.add(uvec(nodes[i], nodes[j]));
                    f.scale(10*(dist(nodes[i], nodes[j])-edgeLen));
                }
                f.add(uvec(nodes[j], nodes[i]));
                f.scale(20/(dist(nodes[i], nodes[j])*dist(nodes[i], nodes[j])));
                resultant.add(f);
            }
        }
        let drag = new Force(-nodes[i].velX, -nodes[i].velY);
        drag.scale(0.005);
        resultant.add(drag);
        nodes[i].force = resultant;
    }
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
    }
}

function Graph(V, E) {
    this.V = V;
    this.E = E;
}

Graph.prototype.draw = function() {
    nodes = [];
    edges = [];
    adj = [];

    for (let i = 0; i < this.V.length; i++) {
        nodes.push(new Node(300+Math.floor(200*Math.random()), 200+Math.floor(300*Math.random()), 0, 0, 'white', 20, this.V[i], new Force(0, 0)));
    }
    
    for (let i = 0; i < this.E.length; i++) {
        edges.push(new Edge(nodes[this.E[i][0]-1], nodes[this.E[i][1]-1], 'white'));
    }
    
    for (let i = 0; i < this.V.length; i++) {
        let temp = [];
        for (let j = 0; j < this.V.length; j++) {
            temp.push(0);
        }
        adj.push(temp);
    }
  //  console.log(adj);
    for (let i = 0; i < this.E.length; i++) {
//console.log(this.E[i]);
        adj[this.E[i][0]-1][this.E[i][1]-1] = 1;
        adj[this.E[i][1]-1][this.E[i][0]-1] = 1;
    }
    //console.log(adj, nodes, edges);
    for (let i = 0; i < 10000; i++) {
        loop();
    }
}
/*
3 3
1 2
2 3
3 1
*/