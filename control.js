import { Graph } from './main.js';

const textInput = document.getElementById('text_input');
const edgeLenInput = document.getElementById('edge_len');
const rootInput = document.getElementById('root_input');
const toggle_stat = document.getElementById('is_directed');
var directed = false;

textInput.defaultValue = ""

export function render() {
    let root;
    if (rootInput.value !== "") {
        root = Number(rootInput.value);
    }
    
    let text = textInput.value;
    let tokens = text.split(/\s+/);
    let N = Number(tokens[0]);
    let M = Number(tokens[1]);
    let V = [];
    for (let i = 0; i < N; i++) {
        V.push(i+1);
    }
    let E = [];
    for (let i = 0; i < M; i++) {
        let u = Number(tokens[2*i + 2]);
        let v = Number(tokens[2*i + 3]);
        let e = [u, v];
        E.push(e);
    }
    let G = new Graph(V, E, root, directed);
    G.draw();
}

export function change_stat() {
    if (directed === true) {
        toggle_stat.innerText = "Undirected";
        directed = false;
    } else {
        toggle_stat.innerText = "Directed";
        directed = true;
    }
}
