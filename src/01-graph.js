const fs = require('fs/promises');
const path = require('path');
const { spawnSync } = require('child_process');

class Graph {
  _nodes;

  _adjList;

  constructor() {
    this._nodes = [];
    this._adjList = [];
  }

  data(nodeIndex) {
    return this._nodes[nodeIndex];
  }

  addNode(data) {
    this._nodes.push(data);
    this._adjList.push([]);
  }

  addEdge(fromNode, toNode) {
    if (fromNode >= this._nodes.length) throw new Error(`Node ${fromNode} does not exist`);
    if (toNode >= this._nodes.length) throw new Error(`Node ${toNode} does not exist`);
    this._adjList[fromNode].push(toNode);
    if (fromNode !== toNode) {
      this._adjList[toNode].push(fromNode);
    }
  }

  removeEdge(fromNode, toNode) {
    const fromNodeNeighbors = this._adjList?.[fromNode];
    const toNodeNeighbors = this._adjList?.[toNode];
    if (!fromNodeNeighbors || !toNodeNeighbors) return false;
    const toNodeIdx = fromNodeNeighbors.indexOf(toNode);
    const fromNodeIdx = toNodeNeighbors.indexOf(fromNode);
    if (toNodeIdx === -1 || fromNodeIdx === -1) return false;
    fromNodeNeighbors.splice(toNodeIdx, 1);
    toNodeNeighbors.splice(fromNodeIdx, 1);
    return true;
  }

  hasEdge(fromNode, toNode) {
    const fromNodeNeighbors = this._adjList?.[fromNode];
    const toNodeNeighbors = this._adjList?.[toNode];
    if (!fromNodeNeighbors || !toNodeNeighbors) return false;
    return (
      fromNodeNeighbors.length < toNodeNeighbors.length
        ? fromNodeNeighbors.includes(toNode)
        : toNodeNeighbors.includes(fromNode)
    );
  }

  nodeCount() {
    return this._nodes.length;
  }

  edgeCount() {
    const f = JSON.stringify;
    const edges = this._adjList.flatMap(
      (x, idx) => x.map((y) => (idx < y ? f([idx, y]) : f([y, idx]))),
    );

    return Array.from(new Set(edges)).map((x) => JSON.parse(x)).length;
  }

  edgeList() {
    const f = JSON.stringify;
    const edges = this._adjList.flatMap(
      (x, idx) => x.map((y) => (idx < y ? f([idx, y]) : f([y, idx]))),
    );

    return Array.from(new Set(edges)).map((x) => JSON.parse(x));
  }

  neighbors(nodeIndex) {
    return this._adjList[nodeIndex];
  }

  bfs(startNode, key) {
    const visited = new Array(this._nodes.length);
    const queue = [];
    queue.push(startNode);
    while (queue.length > 0) {
      const node = queue.shift();
      if (!visited[node]) {
        visited[node] = true;
        if (this._nodes[node] === key) return node;

        const neighbors = this.neighbors(node);
        queue.push(...neighbors);
      }
    }
    return false;
  }

  dfs(startNode, key) {
    const visited = new Array(this._nodes.length);
    const stack = [];
    stack.push(startNode);
    while (stack.length > 0) {
      const node = stack.pop();
      if (!visited[node]) {
        visited[node] = true;
        if (this._nodes[node] === key) return node;

        const neighbors = this.neighbors(node);
        stack.push(...neighbors);
      }
    }
    return false;
  }

  toDotString() {
    const edges = this.edgeList();

    let nodeDotStr = '';
    for (let i = 0; i < this._nodes.length; i += 1) {
      nodeDotStr = `${nodeDotStr}  ${i} [label="${this._nodes[i]}"];\n`;
      // nodeDotStr = `${nodeDotStr}  ${i} [label="${i}"];\n`;
    }

    let edgeDotStr = '';
    for (let i = 0; i < edges.length; i += 1) {
      const edge = edges[i];
      const node1 = `${edge[0]}`;
      const node2 = `${edge[1]}`;
      edgeDotStr = `${edgeDotStr}  ${node1} -- ${node2};\n`;
    }

    const dotStr = `graph G {\n  node [shape=circle]\n\n${nodeDotStr}\n${edgeDotStr}}`;

    return dotStr;
  }

  async createGraph() {
    const fileBasename = '01-graph';

    const imgFileName = `${fileBasename}.png`;
    const imgFileDir = path.resolve(__dirname, '../img');
    const imgFilePath = path.join(imgFileDir, imgFileName);

    const dotFileName = `${fileBasename}.dot`;
    const dotFileDir = path.resolve(__dirname, '../dot');
    const dotFilePath = path.join(dotFileDir, dotFileName);

    const dotFileData = this.toDotString();

    let dotFileHandler;
    try {
      dotFileHandler = await fs.open(dotFilePath, 'w');
      await dotFileHandler.writeFile(dotFileData, 'ascii');
      spawnSync('dot', ['-Tpng', dotFilePath, '-o', imgFilePath]);
    } catch (err) {
      console.error(err);
    } finally {
      dotFileHandler?.close();
    }
  }
}

async function testGraph() {
  const g = new Graph();
  g.addNode(70);
  g.addNode(80);
  g.addNode(70);
  //
  g.addNode(10);
  g.addNode(20);
  g.addNode(30);
  //
  g.addNode(111);
  g.addNode(222);
  g.addNode(333);
  //
  g.addEdge(0, 1);
  g.addEdge(1, 2);
  g.addEdge(0, 0);
  //
  g.addEdge(3, 4);
  g.addEdge(4, 5);
  g.addEdge(5, 3);
  //
  // console.log(g.edgeList());
  // console.log(g.neighbors(0));
  g.addEdge(1, 3);
  // g.bfs(0, (x) => console.log(`{${x}}`));
  console.log(g.bfs(0, 10));
  console.log(g.dfs(0, 10));

  await g.createGraph();
}

testGraph();
