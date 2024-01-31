import { uncurry, ap, compose, subtract, tail, cycle, zip } from './helpers';
import { Direction, Instruction, loadData } from './utils';

const Move = {
  [Direction.Right]: [0, 1],
  [Direction.Left]: [0, -1],
  [Direction.Up]: [-1, 0],
  [Direction.Down]: [1, 0],
};

const TransformDirection = {
  '0': Direction.Right,
  '1': Direction.Down,
  '2': Direction.Left,
  '3': Direction.Up,
};

function shoeLaceArea(vertices: [number, number][]): number {
  return (
    Math.abs(
      uncurry(subtract)(
        ap(zip)(compose(tail, cycle))(vertices).reduce(
          (a: [number, number], x: [number, number]) =>
            [0, 1].map((b) => {
              const n = Number(b);

              return a[n] + x[0][n] * x[1][Number(!b)];
            }),
          [0, 0]
        )
      )
    ) / 2
  );
}

function findArea(instructions: Instruction[]) {
  let perimeter = 0;

  let x = 0;
  let y = 0;
  const pts = [[0, 0]] as [number, number][];

  for (const instruction of instructions) {
    const [d, n] = instruction;

    const [dx, dy] = Move[d];
    x = x + dx * n;
    y = y + dy * n;
    pts.push([x, y]);
    perimeter += n;
  }

  return shoeLaceArea(pts) + perimeter / 2 + 1;
}

async function partOne() {
  return findArea(await loadData());
}

async function partTwo() {
  const data = await loadData();

  const instructions = data.map((instruction) => {
    const steps = parseInt(instruction[2].slice(1, 6), 16);
    return [TransformDirection[instruction[2].slice(-1)], steps, null] as Instruction;
  });

  return findArea(instructions);
}

export default [partOne, partTwo];
