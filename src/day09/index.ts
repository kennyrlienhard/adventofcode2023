import { loadData } from './utils';

function getDifferences(values: number[]) {
  const result = [[...values]];

  while (!result.at(-1).every((value) => value === 0)) {
    const nextLine = [];

    for (let i = 0; i < result.at(-1).length - 1; i += 1) {
      nextLine.push(result.at(-1)[i + 1] - result.at(-1)[i]);
    }

    result.push(nextLine);
  }

  return result;
}

function extrapolate(values: number[], reverse = false) {
  const result = getDifferences(values);

  if (reverse) result.at(-1).unshift(0);
  else result.at(-1).push(0);

  for (let i = result.length - 2; i >= 0; i -= 1) {
    if (reverse) result[i].unshift(result[i][0] - result[i + 1][0]);
    else result[i].push(result[i + 1].at(-1) + result[i].at(-1));
  }

  return result;
}

async function partOne() {
  const result = (await loadData()).map((line) => extrapolate(line));
  return result.reduce((acc, line) => acc + line[0].at(-1), 0);
}

async function partTwo() {
  const result = (await loadData()).map((line) => extrapolate(line, true));
  return result.reduce((acc, line) => acc + line[0][0], 0);
}

export default [partOne, partTwo];
