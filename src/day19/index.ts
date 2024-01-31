import { RatingInterface, Range, loadData } from './utils';

async function partOne() {
  const applyWorkflow = (rating: RatingInterface, workflow: [string, string][]): string => {
    for (let i = 0; i < workflow.length; i += 1) {
      if (i === workflow.length - 1) return workflow[i][1];

      const key = workflow[i][0].slice(0, 1);
      const f = `var ${key} = ${rating[key]}; ${workflow[i][0]}`;

      if (eval(f)) return workflow[i][1];
    }
  };

  const [workflows, ratings] = await loadData();

  let result = 0;

  for (const rating of ratings) {
    let workflow = 'in';

    while (!['A', 'R'].includes(workflow)) {
      workflow = applyWorkflow(rating, workflows[workflow]);
    }

    if (workflow === 'A') result += Object.values(rating).reduce((acc, val) => acc + val, 0);
  }

  return result;
}

async function partTwo() {
  const MIN = 1;
  const MAX = 4000;

  const [workflows] = await loadData();

  const deepCopy = (range: Range) => JSON.parse(JSON.stringify(range));

  const getValidRanges = (name: string, range: Range): Range[] => {
    if (name === 'R') return [];
    if (name === 'A') return [deepCopy(range)];

    const ranges = [];

    for (const rule of workflows[name]) {
      if (rule[0] === null) {
        ranges.push(...getValidRanges(rule[1], deepCopy(range)));
      } else if (rule[0].includes('<')) {
        const nextRange = deepCopy(range);
        const [key, value] = rule[0].split('<');

        nextRange[key][1] = Number(value) - 1;
        range[key][0] = Number(value);

        ranges.push(...getValidRanges(rule[1], nextRange));
      } else if (rule[0].includes('>')) {
        const newRange = deepCopy(range);
        const [key, value] = rule[0].split('>');

        newRange[key][0] = Number(value) + 1;
        range[key][1] = Number(value);

        ranges.push(...getValidRanges(rule[1], newRange));
      }
    }

    return ranges;
  };

  return getValidRanges('in', { x: [MIN, MAX], m: [MIN, MAX], a: [MIN, MAX], s: [MIN, MAX] })
    .map((item) => Object.values(item).reduce((acc, [min, max]) => acc * (max - min + 1), 1))
    .reduce((acc: number, v: number) => acc + v, 0);
}

export default [partOne, partTwo];
