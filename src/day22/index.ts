import { X1, Y1, Z1, X2, Y2, Z2, loadData } from './utils';

function overlaps(a: number[], b: number[]) {
  return Math.max(a[X1], b[X1]) <= Math.min(a[X2], b[X2]) && Math.max(a[Y1], b[Y1]) <= Math.min(a[Y2], b[Y2]);
}

function getSupportingBricks(bricks: number[][]) {
  for (let i = 0; i < bricks.length; i += 1) {
    let maxZ = 1;

    for (let j = 0; j < i; j += 1) {
      if (overlaps(bricks[i], bricks[j])) maxZ = Math.max(maxZ, bricks[j][Z2] + 1);

      bricks[i][Z2] -= bricks[i][Z1] - maxZ;
      bricks[i][Z1] = maxZ;
    }

    bricks.sort((a, b) => a[Z1] - b[Z1]);
  }

  const kSupportsV = bricks.reduce((acc, _, i) => ({ ...acc, [i]: new Set() }), {}) as { [key: string]: Set<number> };
  const vSupportsK = bricks.reduce((acc, _, i) => ({ ...acc, [i]: new Set() }), {}) as { [key: string]: Set<number> };

  for (let j = 0; j < bricks.length; j += 1) {
    for (let i = 0; i < j; i += 1) {
      if (overlaps(bricks[i], bricks[j]) && bricks[j][Z1] === bricks[i][Z2] + 1) {
        kSupportsV[i].add(j);
        vSupportsK[j].add(i);
      }
    }
  }

  return [kSupportsV, vSupportsK];
}

async function partOne() {
  let result = 0;

  const bricks = await loadData();
  const [kSupportsV, vSupportsK] = getSupportingBricks(bricks);

  for (let i = 0; i < bricks.length; i += 1) {
    if (Array.from(kSupportsV[i]).every((j) => vSupportsK[j].size >= 2)) result += 1;
  }

  return result;
}

async function partTwo() {
  let result = 0;

  const bricks = await loadData();
  const [kSupportsV, vSupportsK] = getSupportingBricks(bricks);

  for (let i = 0; i < bricks.length; i += 1) {
    const q = Array.from(kSupportsV[i]).filter((j) => vSupportsK[j].size === 1);
    const falling = new Set(q);
    falling.add(i);

    while (q.length) {
      const j = q.shift();
      for (const k of kSupportsV[j]) {
        if (!falling.has(k)) {
          if (Array.from(vSupportsK[k]).every((b) => falling.has(b))) {
            q.push(k);
            falling.add(k);
          }
        }
      }
    }

    result += falling.size - 1;
  }

  return result;
}

export default [partOne, partTwo];
