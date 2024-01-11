import { getData } from '../data';

export type Element = { [source: string]: string[] };

export async function loadData(trainingData = false): Promise<[string, Element]> {
  const data = await getData(8, trainingData);

  return [
    data[0],
    data.slice(2).reduce((acc, line) => {
      const [source, target] = line.split(' = ');
      return { ...acc, [source]: target.replace('(', '').replace(')', '').split(', ') };
    }, {} as Element),
  ];
}
