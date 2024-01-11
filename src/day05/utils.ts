import { getData } from '../data';

type Converter = [number, number, number];

export interface MapInterface {
  source: string;
  destination: string;
  converters: Converter[];
}

export async function loadData(trainingData = false): Promise<[number[], MapInterface[]]> {
  const data = await getData(5, trainingData);

  const seeds = data[0]
    .split(':')[1]
    .trim()
    .split(' ')
    .map((val) => parseInt(val, 10));

  const maps = [];

  let map = {} as MapInterface;

  for (const item of data.slice(2)) {
    if (!item) {
      maps.push(map);
    } else if (item.includes('map')) {
      map = { source: item.split('-to-')[0], destination: item.split('-to-')[1].split(' ')[0] } as MapInterface;
    } else {
      const [destinationStart, sourceStart, range] = item.split(' ').map((val) => parseInt(val, 10));
      map.converters = map.converters || [];
      map.converters.push([destinationStart, sourceStart, range]);
    }
  }

  maps.push(map);

  return [seeds, maps];
}
