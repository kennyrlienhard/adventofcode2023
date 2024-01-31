class PriorityQueue {
  values: { val: string; priority: number }[];

  constructor() {
    this.values = [];
  }

  enqueue(val: string, priority: number) {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }
}

class WeightedGraph {
  adjacencyList: { [key: string]: { node: string; weight: number }[] };

  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex: string) {
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
  }

  addEdge(vertex1: string, vertex2: string, weight: number) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }

  Dijkstra(start: string, end: string) {
    const nodes = new PriorityQueue();
    const distances = {};
    const previous = {};

    const path = []; // to return at end
    let smallest: string;

    // build up initial state
    for (const vertex in this.adjacencyList) {
      if (vertex === start) {
        nodes.enqueue(vertex, 0);
        distances[vertex] = 0;
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }

    // as long as there is something to visit
    while (nodes.values.length) {
      smallest = nodes.dequeue().val;

      if (smallest === end) {
        while (previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
      }

      if (smallest || distances[smallest] != Infinity) {
        for (const neighbor in this.adjacencyList[smallest]) {
          // find neighboring node
          const nextNode = this.adjacencyList[smallest][neighbor];

          // calculate new distance to neighboring node
          const candidate = distances[smallest] + nextNode.weight;
          const nextNeighbor = nextNode.node;

          if (candidate < distances[nextNeighbor]) {
            // updating new smallest distance to neighbor
            distances[nextNeighbor] = candidate;

            // updating previous – How we got to neighbor
            previous[nextNeighbor] = smallest;

            // enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }

    return { distance: distances[end], path: path.concat(smallest).reverse() };
  }
}

function partOne() {
  const graph = new WeightedGraph();
  graph.addVertex('A');
  graph.addVertex('B');
  graph.addVertex('C');
  graph.addVertex('D');
  graph.addVertex('E');
  graph.addVertex('F');

  graph.addEdge('A', 'B', 4);
  graph.addEdge('A', 'C', 2);
  graph.addEdge('B', 'E', 3);
  graph.addEdge('C', 'D', 2);
  graph.addEdge('C', 'F', 4);
  graph.addEdge('D', 'E', 3);
  graph.addEdge('D', 'F', 1);
  graph.addEdge('E', 'F', 1);

  const result = graph.Dijkstra('A', 'E');

  return result.distance;
}

export default [partOne];
