import { loadData } from './utils';

const ALL_NEIGHBOURS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const DIRECTIONS = {
  '^': [[-1, 0]],
  v: [[1, 0]],
  '<': [[0, -1]],
  '>': [[0, 1]],
  '.': ALL_NEIGHBOURS,
};

async function run(handleSlopes = false) {
  const grid = await loadData();

  const getPointsToWalk = () => {
    const result = [] as [number, number][];

    for (let r = 0; r < grid.length; r += 1) {
      for (let c = 0; c < grid[r].length; c += 1) {
        if (grid[r][c] === '#') continue;

        let neighbors = 0;

        for (const n of handleSlopes ? DIRECTIONS[grid[r][c]] : ALL_NEIGHBOURS) {
          const [nr, nc] = [r + n[0], c + n[1]];
          if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[r].length) continue;
          if (grid[nr][nc] !== '#') neighbors += 1;
        }

        if (neighbors >= 3) result.push([r, c]);
      }
    }

    return result;
  };

  const start = [0, grid[0].findIndex((cell) => cell === '.')] as [number, number];
  const end = [grid.length - 1, grid.at(-1).findIndex((cell) => cell === '.')] as [number, number];

  const points = [start, end, ...getPointsToWalk()];
  const graph = {};

  for (const [sr, sc] of points) {
    const stack = [[0, sr, sc]];
    const id = [sr, sc].join(',');
    const seen = new Set([id]);

    while (stack.length) {
      const [n, r, c] = stack.pop();

      if (n !== 0 && points.some(([pr, pc]) => pr === r && pc === c)) {
        if (!graph[id]) graph[id] = {};
        graph[id][[r, c].join(',')] = n;
        continue;
      }

      for (const [dr, dc] of handleSlopes ? DIRECTIONS[grid[r][c]] : ALL_NEIGHBOURS) {
        const nr = r + dr;
        const nc = c + dc;
        const neighbourId = [nr, nc].join(',');

        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[r].length && grid[nr][nc] !== '#' && !seen.has(neighbourId)) {
          stack.push([n + 1, nr, nc]);
          seen.add(neighbourId);
        }
      }
    }
  }

  const seen = new Set();

  function dfs(pt: [number, number]) {
    const id = pt.join(',');
    if (id === end.join(',')) return 0;

    let m = -Infinity;

    seen.add(id);

    for (const nx of Object.keys(graph[id])) {
      if (!seen.has(nx)) {
        const np = nx.split(',').map(Number) as [number, number];
        m = Math.max(m, dfs(np) + graph[id][nx]);
      }
    }

    seen.delete(id);

    return m;
  }

  return dfs(start);
}

export default [() => run(true), () => run()];
