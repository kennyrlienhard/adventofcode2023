import { init as initZ3 } from 'z3-solver';

import { Point, loadData } from './utils';

const IS_TRAINING = false;

const MOVES = 1000;

const MIN = IS_TRAINING ? 7 : 200_000_000_000_000;

const MAX = IS_TRAINING ? 27 : 400_000_000_000_000;

function getIntersection(p1: Point, p2: Point, p3: Point, p4: Point): [boolean, number?, number?] {
  const x12 = p1.x - p2.x;
  const x34 = p3.x - p4.x;
  const y12 = p1.y - p2.y;
  const y34 = p3.y - p4.y;

  const c = x12 * y34 - y12 * x34;

  if (Math.abs(c) < 0.01) {
    return [false];
  } else {
    const a = p1.x * p2.y - p1.y * p2.x;
    const b = p3.x * p4.y - p3.y * p4.x;

    const x = (a * x34 - b * x12) / c;
    const y = (a * y34 - b * y12) / c;

    return [true, x, y];
  }
}

function hasValidIntersection(p1: Point, p3: Point): boolean {
  const p2 = p1.clone();
  p2.move(MOVES);

  const p4 = p3.clone();
  p4.move(MOVES);

  const [intersects, x, y] = getIntersection(p1, p2, p3, p4);

  const inRange = x >= MIN && x <= MAX && y >= MIN && y <= MAX;

  const crossedEarlier = (p: Point) =>
    (x < p.x && p.vx > 0) || (x > p.x && p.vx < 0) || (y < p.y && p.vy > 0) || (y > p.y && p.vy < 0);

  return intersects && inRange && !crossedEarlier(p1) && !crossedEarlier(p3);
}

async function partOne() {
  let result = 0;

  const seen = new Set<string>();
  const points = await loadData(IS_TRAINING);

  for (const p1 of points) {
    for (const p2 of points) {
      const id = [p1.id, p2.id].sort().join('/');
      if (p1.id === p2.id || seen.has(id)) continue;

      seen.add(id);
      if (hasValidIntersection(p1, p2)) result += 1;
    }
  }

  return result;
}

async function partTwo() {
  const points = await loadData(IS_TRAINING);

  const { Context } = await initZ3();
  const { Real, Solver } = Context('main');

  const x = Real.const('x');
  const y = Real.const('y');
  const z = Real.const('z');

  const vx = Real.const('vx');
  const vy = Real.const('vy');
  const vz = Real.const('vz');

  const solver = new Solver();

  for (const [index, p] of points.slice(0, 3).entries()) {
    const t = Real.const(`t${index}`);

    solver.add(t.ge(0));
    solver.add(x.add(vx.mul(t)).eq(t.mul(p.vx).add(p.x)));
    solver.add(y.add(vy.mul(t)).eq(t.mul(p.vy).add(p.y)));
    solver.add(z.add(vz.mul(t)).eq(t.mul(p.vz).add(p.z)));
  }

  await solver.check();

  const model = solver.model();

  return [model.eval(x), model.eval(y), model.eval(z)].map(Number).reduce((acc, val) => acc + val, 0);

  // const points = await loadData(false);

  // const equations = [];

  // for (let i = 0; i < 3; i += 1) {
  //   const p = points[i];

  //   equations.push(`(xr - ${p.x}) * (${p.vy} - vyr) - (yr - ${p.y}) * (${p.vx} - vxr)`);
  //   equations.push(`(yr - ${p.y}) * (${p.vz} - vzr) - (zr - ${p.z}) * (${p.vy} - vyr)`);
  // }

  // const n = (nerdamer as any).solveEquations(equations);
}

export default [partOne, partTwo];
