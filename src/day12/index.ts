import { loadData, memoize } from './utils';

const countArrangements = memoize((line: string, damagedGroups: number[]): number => {
  if (line.length === 0) {
    return damagedGroups.length === 0 ? 1 : 0;
  }

  if (damagedGroups.length === 0) {
    for (let i = 0; i < line.length; i += 1) {
      if (line[i] === '#') return 0;
    }
    return 1;
  }

  if (line.length < damagedGroups.reduce((acc, val) => acc + val, 0) + damagedGroups.length - 1) {
    // The line is not long enough to contain all the damaged groups
    return 0;
  }

  if (line[0] === '.') {
    return countArrangements(line.slice(1), damagedGroups);
  }

  if (line[0] === '#') {
    const [firstGroup, ...otherGroups] = damagedGroups;

    for (let i = 0; i < firstGroup; i += 1) {
      if (line[i] === '.') return 0;
    }

    if (line[firstGroup] === '#') return 0;

    return countArrangements(line.slice(firstGroup + 1), otherGroups);
  }

  return countArrangements('#' + line.slice(1), damagedGroups) + countArrangements('.' + line.slice(1), damagedGroups);
});

async function partOne() {
  return (await loadData(true)).reduce((acc, row) => acc + countArrangements(row[0], row[1]), 0);
}

async function partTwo() {
  const COPIES = 5;

  return (await loadData())
    .map((row) => [Array(COPIES).fill(row[0]).flat().join('?'), Array(COPIES).fill(row[1]).flat()] as [string, number[]])
    .reduce((acc, row) => acc + countArrangements(row[0], row[1]), 0);
}

export default [partOne, partTwo];
