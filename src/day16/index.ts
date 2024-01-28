import { loadData } from './utils';

enum Direction {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}

type Beam = [number, number, Direction];

// Mirror left = /
const MirrorSlash = {
  [Direction.Up]: [0, 1, Direction.Right],
  [Direction.Right]: [-1, 0, Direction.Up],
  [Direction.Down]: [0, -1, Direction.Left],
  [Direction.Left]: [1, 0, Direction.Down],
} as Record<Direction, Beam>;

// Mirror right = \
const MirrorBackslash = {
  [Direction.Up]: [0, -1, Direction.Left],
  [Direction.Right]: [1, 0, Direction.Down],
  [Direction.Down]: [0, 1, Direction.Right],
  [Direction.Left]: [-1, 0, Direction.Up],
} as Record<Direction, Beam>;

const MoveStraight = {
  [Direction.Up]: [-1, 0, Direction.Up],
  [Direction.Right]: [0, 1, Direction.Right],
  [Direction.Down]: [1, 0, Direction.Down],
  [Direction.Left]: [0, -1, Direction.Left],
} as Record<Direction, Beam>;

function energize(startFrom: Beam, grid: string[][]) {
  let beams = [[...startFrom]];

  const visited = new Map<string, number>();
  const handled = new Set<string>();

  while (beams.length > 0) {
    const nextBeams = [];

    for (let i = 0; i < beams.length; i += 1) {
      const beam = beams[i];
      const id = [beam[0], beam[1]].join(',');
      const tmpBeams = [];

      if (!visited.has(id)) visited.set(id, 1);
      handled.add(beam.join(','));

      const tile = grid[beam[0]][beam[1]];

      if (
        tile === '.' ||
        ([Direction.Right, Direction.Left].includes(beam[2]) && tile === '-') ||
        ([Direction.Up, Direction.Down].includes(beam[2]) && tile === '|')
      ) {
        const change = MoveStraight[beam[2]];
        tmpBeams.push([beam[0] + change[0], beam[1] + change[1], beam[2]]);
      } else if (['/', '\\'].includes(tile)) {
        const change = (tile === '/' ? MirrorSlash : MirrorBackslash)[beam[2]];
        tmpBeams.push([beam[0] + change[0], beam[1] + change[1], change[2]]);
      } else if (tile === '-') {
        tmpBeams.push([beam[0], beam[1] - 1, Direction.Left], [beam[0], beam[1] + 1, Direction.Right]);
      } else if (tile === '|') {
        tmpBeams.push([beam[0] - 1, beam[1], Direction.Up], [beam[0] + 1, beam[1], Direction.Down]);
      }

      const validBeams = tmpBeams
        .filter(([x, y]) => x >= 0 && y >= 0 && x < grid.length && y < grid[0].length)
        .filter((b) => !handled.has(b.join(',')));

      nextBeams.push(...validBeams);
    }

    beams = [...nextBeams];
  }

  return visited.size;
}

async function partOne() {
  return energize([0, 0, Direction.Right], await loadData());
}

async function partTwo() {
  let bestResult = 0;

  const grid = await loadData();

  // top row (heading downward)
  for (let i = 0; i < grid[0].length; i += 1) {
    const result = energize([0, i, Direction.Down], grid);
    if (result > bestResult) bestResult = result;
  }

  // bottom row (heading upward)
  for (let i = 0; i < grid[grid.length - 1].length; i += 1) {
    const result = energize([grid.length - 1, i, Direction.Up], grid);
    if (result > bestResult) bestResult = result;
  }

  // leftmost column (heading right)
  for (let i = 0; i < grid.length; i += 1) {
    const result = energize([i, 0, Direction.Right], grid);
    if (result > bestResult) bestResult = result;
  }

  // rightmost column (heading left)
  for (let i = 0; i < grid.length; i += 1) {
    const result = energize([i, grid[0].length - 1, Direction.Left], grid);
    if (result > bestResult) bestResult = result;
  }

  return bestResult;
}

export default [partOne, partTwo];
