import crypto from 'crypto';

import { loadData } from './utils';

function totalLoad(area: string[][]) {
  return area.reduce((sum, line, index) => sum + (area.length - index) * line.filter((c) => c === 'O').length, 0);
}

function moveNorth(area: string[][]) {
  for (let y = 0; y < area.length; y++) {
    for (let x = 0; x < area[y].length; x += 1) {
      if (area[y][x] === 'O') {
        for (let i = y - 1; i >= 0; i--) {
          if (area[i][x] === '#' || area[i][x] === 'O') {
            area[y][x] = '.';
            area[i + 1][x] = 'O';
            break;
          }

          if (i === 0) {
            area[y][x] = '.';
            area[0][x] = 'O';
            break;
          }
        }
      }
    }
  }

  return area;
}

function moveSouth(area: string[][]) {
  for (let y = area.length - 2; y >= 0; y -= 1) {
    for (let x = 0; x < area[y].length; x += 1) {
      if (area[y][x] !== 'O' || area[y + 1][x] !== '.') continue;

      let moveDown = 1;

      while (y + moveDown < area.length && area[y + moveDown][x] === '.') {
        area[y + moveDown][x] = 'O';
        area[y + moveDown - 1][x] = '.';
        moveDown += 1;
      }
    }
  }

  return area;
}

function moveWest(area: string[][]) {
  for (let x = 0; x < area[0].length; x += 1) {
    for (let y = 0; y < area.length; y += 1) {
      if (area[y][x] === 'O') {
        for (let i = x - 1; i >= 0; i -= 1) {
          if (area[y][i] === '#' || area[y][i] === 'O') {
            area[y][x] = '.';
            area[y][i + 1] = 'O';
            break;
          }

          if (i === 0) {
            area[y][x] = '.';
            area[y][0] = 'O';
            break;
          }
        }
      }
    }
  }

  return area;
}

function moveEast(area: string[][]) {
  for (let x = area[0].length - 1; x >= 0; x--) {
    for (let y = 0; y < area.length; y++) {
      if (area[y][x] === 'O') {
        for (let i = x + 1; i < area[y].length; i++) {
          if (area[y][i] === '#' || area[y][i] === 'O') {
            area[y][x] = '.';
            area[y][i - 1] = 'O';
            break;
          }

          if (i === area[y].length - 1) {
            area[y][x] = '.';
            area[y][area[y].length - 1] = 'O';
            break;
          }
        }
      }
    }
  }

  return area;
}

function performCycle(area: string[][]) {
  const TRANSFORMER = { north: moveNorth, west: moveWest, south: moveSouth, east: moveEast };
  return ['north', 'west', 'south', 'east'].reduce((acc, direction) => TRANSFORMER[direction](acc), area);
}

function hashArea(area: string[][]) {
  return crypto
    .createHash('sha256')
    .update(area.map((row) => row.join('')).join('\n'))
    .digest('hex');
}

async function partOne() {
  return totalLoad(moveNorth(await loadData()));
}

async function partTwo() {
  const CYCLES = 1_000_000_000;

  let area = await loadData();

  const visited = new Set();
  const storage = new Map();

  for (let i = 0; i < CYCLES; i += 1) {
    area = performCycle(area);
    const hash = hashArea(area);

    if (visited.has(hash)) {
      const loopOrigin = storage.get(hash);
      const loopLength = i - loopOrigin;

      const remaining = CYCLES - 1 - i;
      const remainingMod = remaining % loopLength;

      for (let j = 0; j < remainingMod; j += 1) {
        area = performCycle(area);
      }

      return totalLoad(area);
    }

    visited.add(hash);
    storage.set(hash, i);
  }
}

export default [partOne, partTwo];
