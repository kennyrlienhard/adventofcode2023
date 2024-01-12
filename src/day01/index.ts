import { loadData } from './utils';

const DICTIONARY = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function getResult(data: string[][]): number {
  return data.map((values) => parseInt(`${values[0]}${values.at(-1)}`, 10)).reduce((a, b) => a + b, 0);
}

async function partOne() {
  return getResult((await loadData()).map((line) => line.match(/\d/g)));
}

async function partTwo() {
  const getValueForMatch = (match: RegExpExecArray): string => {
    return isNaN(Number(match.at(0))) ? DICTIONARY[match.at(0)] : match.at(0);
  };

  const findAllMatches = (line: string, search: string): RegExpExecArray[] => {
    const result = [] as RegExpExecArray[];
    let match: RegExpExecArray;
    const reg = new RegExp(search, 'g');

    while (null != (match = reg.exec(line))) result.push(match);

    return result;
  };

  const getValues = (line: string): [string, string] => {
    const matches = [] as RegExpExecArray[];

    for (const key of [...Object.keys(DICTIONARY), ...Object.values(DICTIONARY).map((v) => v.toString())]) {
      matches.push(...findAllMatches(line, key));
    }

    matches.sort((a, b) => a.index - b.index);

    return [getValueForMatch(matches[0]), getValueForMatch(matches.at(-1))];
  };

  return getResult((await loadData()).map(getValues));
}

export default [partOne, partTwo];
