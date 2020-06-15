import { Force, dist, uvec, mag } from './modules/force.js';
import { Node } from './modules/node.js';
import { Edge } from './modules/edge.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// variables

const WIDTH = canvas.width = 970;
const HEIGHT = canvas.height = 600;
const EDGE_LEN = 100;

let nodes = [];
let edges = [];
let adj = [];
let extra_nodes = new Set();

function loop() {
    for (let i = 0; i < nodes.length; i++) {
        if (extra_nodes.has(nodes[i].val-1)) {
            continue;
        }
        let resultant = new Force(0, 0);
        for (let j = 0; j < nodes.length; j++) {
            if (extra_nodes.has(nodes[j].val-1)) {
                continue;
            }
            if (j !== i) {
                let f = new Force(0, 0);
                if (adj[i][j]) {
                    f.add(uvec(nodes[i], nodes[j]));
                    f.scale(20*(dist(nodes[i], nodes[j])-EDGE_LEN));
                }
                f.add(uvec(nodes[j], nodes[i]));
                f.scale(10/(dist(nodes[i], nodes[j])*dist(nodes[i], nodes[j])));
                resultant.add(f);
            }
        }
        let drag = new Force(-nodes[i].velX, -nodes[i].velY);
        drag.scale(0.005);
        resultant.add(drag);
        nodes[i].force = resultant;
    }
    for (let i = 0; i < nodes.length; i++) {
        if (extra_nodes.has(nodes[i].val-1))
            continue;
        nodes[i].update();
    }
}

function moveGraphToCenter() {
    let average_x = 0, average_y = 0;

    for (let i = 0; i < nodes.length; i++) {
        if (extra_nodes.has(nodes[i].val-1)) {
            continue;
        }
        average_x += nodes[i].x;
        average_y += nodes[i].y;
    }

    average_x /= nodes.length-extra_nodes.size;
    average_y /= nodes.length-extra_nodes.size;

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].x -= (average_x-WIDTH/2);
        nodes[i].y -= (average_y-HEIGHT/2);
    }
}

function graphScore() {
    let mn = 100000000;
    for (let i = 0; i < nodes.length; i++) {
        if (extra_nodes.has(nodes[i].val-1)) {
            continue;
        }
        for (let j = 0; j < nodes.length; j++) {
            if (extra_nodes.has(nodes[j].val-1)) {
                continue;
            }
            if (i != j) {
                mn = Math.min(mn, dist(nodes[i], nodes[j]));
            }
        }
    }
    return mn;
}

function graphDia() {
    let mx = 0;
    for (let i = 0; i < nodes.length; i++) {
        if (extra_nodes.has(nodes[i].val-1)) {
            continue;
        }
        for (let j = 0; j < nodes.length; j++) {
            if (extra_nodes.has(nodes[j].val-1)) {
                continue;
            }
            if (i != j) {
                mx = Math.max(mx, dist(nodes[i], nodes[j]));
            }
        }
    }
    return mx;
}

export function Graph(V, E) {
    this.V = V;
    this.E = E;
}

Graph.prototype.draw = function() {
    nodes = [];
    edges = [];
    adj = [];

    for (let i = 0; i < this.V.length; i++) {
        nodes.push(
            new Node(
                300+Math.floor(400*Math.random()), 
                200+Math.floor(400*Math.random()), 
                0, 0, 'white', 20, this.V[i], 
                new Force(0, 0)
            )
        );
    }
    
    let deg = [];
    for (let i = 0; i < this.V.length; i++) {
        deg.push(0);
    }

    for (let i = 0; i < this.V.length; i++) {
        let temp = [];
        for (let j = 0; j < this.V.length; j++) {
            temp.push(0);
        }
        adj.push(temp);
    }

    for (let i = 0; i < this.E.length; i++) {
        deg[this.E[i][0]-1] += 1;
        deg[this.E[i][1]-1] += 1;

        adj[this.E[i][0]-1][this.E[i][1]-1] = 1;
        adj[this.E[i][1]-1][this.E[i][0]-1] = 1;
    }

    for (let i = 0; i < deg.length; i++) {
        if (deg[i] === 0) {
            extra_nodes.add(i);
        }
    }
    
    var best_score = 0;
    var best_nodes = [];
    for (let j = 0; j < 20; j++) {
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].x = 300+Math.floor(400*Math.random() + 10*Math.random());
            nodes[i].y = 300+Math.floor(400*Math.random() + 20*Math.random());
            nodes[i].velX = 0;
            nodes[i].velY = 0;
            nodes[i].Force = new Force(0, 0);
        }
        for (let i = 0; i < 5000; i++) {
            loop();
        }
        let score = graphScore();
        let max_dist = graphDia();

        if (score > best_score && max_dist < canvas.height) {
            best_score = score;
            best_nodes = [];
            for (let i = 0; i < nodes.length; i++) {
                best_nodes[i] = nodes[i].copy();
            }
        }
    }

    
    nodes = best_nodes;
    moveGraphToCenter();
    let pos = 30;
    for (let i = 0; i < nodes.length; i++) {
        if (extra_nodes.has(nodes[i].val-1)) {
            nodes[i].x = pos;
            nodes[i].y = 40;
            pos += 50;
        }
    }
    
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    
    for (let i = 0; i < this.E.length; i++) {
        edges.push(new Edge(nodes[this.E[i][0]-1], nodes[this.E[i][1]-1], 'white'));
    }

    for (let i = 0; i < edges.length; i++) {
        edges[i].draw(ctx);
    }

    for (let i = 0; i < nodes.length; i++) {
        nodes[i].draw(ctx);
    }
}