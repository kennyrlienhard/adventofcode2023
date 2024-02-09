import cytoscape from 'cytoscape';

import { loadData } from './utils';

async function partOne() {
  const data = await loadData();

  const graph = cytoscape();

  graph.add({
    nodes: Array.from(new Set(Array.from(data).flat())).map((node) => ({ data: { id: node } })),
    edges: data.map(([source, target]) => ({ data: { id: `${source}/${target}`, source, target } })),
  });

  const result = graph.elements().kargerStein() as unknown as { partition1: []; partition2: [] }; // Convert type to avoid TypeScript error

  return result.partition1.length * result.partition2.length;
}

export default [partOne];
