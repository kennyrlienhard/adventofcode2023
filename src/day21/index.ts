import { loadData } from './utils';

const MOVE = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

function solve(grid: string[][], start: [number, number], steps: number) {
  const answers = new Set<string>();
  const seen = new Set<string>();
  const queue = [[start[0], start[1], steps]];

  const invalidStep = ([y, x]: [number, number]) =>
    x < 0 || y < 0 || x >= grid[0].length || y >= grid.length || grid[y][x] === '#' || seen.has([y, x].join(','));

  while (queue.length) {
    const [y, x, stepsLeft] = queue.shift();

    if (stepsLeft % 2 === 0) answers.add(`${y},${x}`);

    if (stepsLeft === 0) continue;

    const neighbours = MOVE.map(([dy, dx]) => [y + dy, x + dx]) as [number, number][];

    for (const neighbour of neighbours) {
      if (invalidStep(neighbour)) continue;

      seen.add(neighbour.join(','));
      queue.push([...neighbour, stepsLeft - 1]);
    }
  }

  return answers.size;
}

async function partOne() {
  const STEPS = 64;

  const grid = await loadData();

  for (let y = 0; y < grid.length; y += 1) {
    const x = grid[y].indexOf('S');
    if (x === -1) continue;
    return solve(grid, [y, x], STEPS);
  }
}

async function partTwo() {
  const STEPS = 26501365;

  const grid = await loadData();

  const start = grid.map((row, y) => [y, row.indexOf('S')]).find(([, x]) => x !== -1) as [number, number];

  const gridWidth = Math.floor(STEPS / grid.length) - 1;

  const oddGrids = (Math.floor(gridWidth / 2) * 2 + 1) ** 2;
  const evenGrids = (Math.floor((gridWidth + 1) / 2) * 2) ** 2;

  const oddPoints = solve(grid, start, STEPS * 2 + 1);
  const evenPoints = solve(grid, start, STEPS * 2);

  const cornerTop = solve(grid, [grid.length - 1, start[1]], grid.length - 1);
  const cornerRight = solve(grid, [start[0], 0], grid.length - 1);
  const cornerBottom = solve(grid, [0, start[1]], grid.length - 1);
  const cornerLeft = solve(grid, [start[0], grid.length - 1], grid.length - 1);

  const stepsSmall = Math.floor(grid.length / 2) - 1;
  const smallTopRight = solve(grid, [grid.length - 1, 0], stepsSmall);
  const smallTopLeft = solve(grid, [grid.length - 1, grid.length - 1], stepsSmall);
  const smallBottomRight = solve(grid, [0, 0], stepsSmall);
  const smallBottomLeft = solve(grid, [0, grid.length - 1], stepsSmall);

  const stepsLarge = Math.floor((grid.length * 3) / 2) - 1;
  const largeTopRight = solve(grid, [grid.length - 1, 0], stepsLarge);
  const largeTopLeft = solve(grid, [grid.length - 1, grid.length - 1], stepsLarge);
  const largeBottomRight = solve(grid, [0, 0], stepsLarge);
  const largeBottomLeft = solve(grid, [0, grid.length - 1], stepsLarge);

  return (
    oddGrids * oddPoints +
    evenGrids * evenPoints +
    cornerTop +
    cornerRight +
    cornerBottom +
    cornerLeft +
    (gridWidth + 1) * (smallTopRight + smallTopLeft + smallBottomRight + smallBottomLeft) +
    gridWidth * (largeTopRight + largeTopLeft + largeBottomRight + largeBottomLeft)
  );
}

export default [partOne, partTwo];
