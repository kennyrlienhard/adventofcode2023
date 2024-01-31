import Heap from 'heap-js';

import { loadData } from './utils';

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

interface Position {
  row: number;
  col: number;
  rowDir: number;
  colDir: number;
  consecutive: number;
  heat: number;
}

class Visited {
  visited = new Set<number>();

  constructor(
    private readonly minSteps: number,
    private readonly maxSteps: number
  ) {}

  check({ row, col, rowDir, colDir, consecutive }: Position): boolean {
    const key = (row << 24) | (col << 16) | ((rowDir & 3) << 14) | ((colDir & 3) << 12) | consecutive;
    if (this.visited.has(key)) return true;
    if (consecutive >= this.minSteps) for (let i = 0; i <= this.maxSteps - consecutive; ++i) this.visited.add(key + i);
    else this.visited.add(key);
    return false;
  }
}

async function solve(minSteps: number, maxSteps: number): Promise<number> {
  const grid = await loadData();

  function tryDirection(positions: Heap<Position>, pos: Position, rowDir: number, colDir: number): void {
    const nextRow = pos.row + rowDir;
    const nextCol = pos.col + colDir;
    const sameDirection = rowDir === pos.rowDir && colDir === pos.colDir;

    // Boundary check
    if (nextRow < 0 || nextRow >= grid.length || nextCol < 0 || nextCol >= grid[0].length) return;
    // Backwards check
    if (rowDir === -pos.rowDir && colDir === -pos.colDir) return;
    // Max steps check
    if (pos.consecutive === maxSteps && sameDirection) return;
    // Min steps check
    if (pos.consecutive < minSteps && !sameDirection && !(pos.row === 0 && pos.col === 0)) return;

    positions.push({
      row: nextRow,
      col: nextCol,
      rowDir,
      colDir,
      consecutive: sameDirection ? pos.consecutive + 1 : 1,
      heat: pos.heat + grid[nextRow][nextCol],
    });
  }

  function minHeat(): number {
    const positions = new Heap<Position>((a, b) => a.heat - b.heat);
    const visited = new Visited(minSteps, maxSteps);
    positions.push({ row: 0, col: 0, rowDir: 0, colDir: 0, consecutive: 0, heat: 0 });
    while (positions.length > 0) {
      const pos = positions.pop() as Position;
      if (visited.check(pos)) continue;
      if (pos.row === grid.length - 1 && pos.col === grid[0].length - 1 && pos.consecutive >= minSteps) return pos.heat;
      for (const direction of DIRECTIONS) tryDirection(positions, pos, direction[0], direction[1]);
    }

    return Infinity;
  }

  return minHeat();
}

async function partOne() {
  return solve(0, 3);
}

async function partTwo() {
  return solve(4, 10);
}

export default [partOne, partTwo];
