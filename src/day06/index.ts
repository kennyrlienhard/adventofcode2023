import { loadData } from './utils';

function getWaysToWin([time, distance]: number[]): number {
  let result = 0;

  for (let buttonPress = 1; buttonPress < time; buttonPress += 1) {
    const speed = buttonPress;
    const distanceCovered = speed * (time - buttonPress);
    if (distanceCovered > distance) result += 1;
    else if (result > 0) break;
  }

  return result;
}

async function partOne() {
  const races = await loadData();
  return races.map(getWaysToWin).reduce((acc, waysToWin) => acc * waysToWin, 1);
}

async function partTwo() {
  const combineNumbers = (values: [number, number][], index: number): number => {
    const value = values.reduce((acc, val) => `${acc}${val[index]}`, '');
    return parseInt(value, 10);
  };

  const data = await loadData();
  return getWaysToWin([combineNumbers(data, 0), combineNumbers(data, 1)]);
}

export default async function start() {
  return Promise.all([partOne, partTwo].map((puzzle) => puzzle()));
}
