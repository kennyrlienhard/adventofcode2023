import { MapInterface, loadData } from './utils';

function getLocation(seed: number, maps: MapInterface[], reverse = false): number {
  const sources = ['seed', 'location'];
  const keys = ['source', 'destination'];
  const indexes = [0, 1];

  if (reverse) {
    sources.reverse();
    keys.reverse();
    indexes.reverse();
  }

  let [source] = sources;
  const [, destination] = sources;

  let value = seed;

  const convertNumber = (): [string, number] => {
    const map = maps.find((m) => m[keys[0]] === source);
    const converter = map.converters.find((c) => c[indexes[1]] <= value && c[indexes[1]] + c[2] > value);
    if (!converter) return [map[keys[1]], value];

    return [map[keys[1]], converter[indexes[0]] + (value - converter[indexes[1]])];
  };

  while (source !== destination) [source, value] = convertNumber();

  return value;
}

async function partOne() {
  const [seeds, maps] = await loadData();
  return Math.min(...seeds.map((seed) => getLocation(seed, maps)));
}

async function partTwo() {
  const [seeds, maps] = await loadData();

  let location = 0;
  const seedRanges = [];

  for (let i = 0; i < seeds.length; i += 2) seedRanges.push([seeds[i], seeds[i + 1]]);

  while (true) {
    const seed = getLocation(location, maps, true);

    if (seedRanges.some((range) => range[0] <= seed && range[0] + range[1] >= seed)) {
      return location;
    }

    location += 1;
  }
}

export default [partOne, partTwo];
