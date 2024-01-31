import { getData } from '../data';

export interface RatingInterface {
  x: number;
  m: number;
  a: number;
  s: number;
}

export type Range = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
};

export type Workflows = Record<string, [string, string][]>;

function ratingParser(line: string): RatingInterface {
  return line
    .match(/{([^)]+)}/)[1]
    .split(',')
    .reduce((acc, val) => {
      const [key, value] = val.split('=');
      return { ...acc, [key]: parseInt(value, 10) };
    }, {} as RatingInterface);
}

function workflowParser(line: string): Workflows {
  const rules = line
    .match(/{([^)]+)}/)[1]
    .split(',')
    .map((rule) => rule.split(':'));

  return { [line.split('{')[0]]: [...rules.slice(0, -1), [null, rules.at(-1)[0]]] } as Workflows;
}

export async function loadData(trainingData = false): Promise<[Workflows, RatingInterface[]]> {
  const result = [{}, []] as [Workflows, RatingInterface[]];

  const data = await getData(19, trainingData);

  let index = 0;

  for (const line of data) {
    if (!line) {
      index += 1;
      continue;
    }

    const parser = index === 0 ? workflowParser : ratingParser;

    if (index === 0) result[index] = { ...result[index], ...(parser(line) as Workflows) };
    else (result[index] as RatingInterface[]).push(parser(line) as RatingInterface);
  }

  return result;
}
