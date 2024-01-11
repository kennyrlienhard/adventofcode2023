import { Galaxy, loadData } from './utils';

function getGalaxies(image: string[][]): Galaxy[] {
  const result = [] as Galaxy[];

  let id = 0;

  for (let y = 0; y < image.length; y += 1) {
    for (let x = 0; x < image[y].length; x += 1) {
      if (image[y][x] === '#') result.push([y, x, (id += 1)]);
    }
  }

  return result;
}

function getPairs(galaxies: Galaxy[]): [Galaxy, Galaxy][] {
  const ids = galaxies.map((galaxy) => galaxy[2]);
  return ids.flatMap((v, i) => ids.slice(i + 1).map((w) => [galaxies.find((g) => g[2] === v), galaxies.find((g) => g[2] === w)]));
}

async function getTotalDistance(expansion = 2) {
  const image = await loadData();

  const emptyRows = [];
  const emptyColumns = [];

  for (let row = 0; row < image.length; row += 1) {
    if (!image[row].includes('#')) emptyRows.push(row);
  }

  for (let column = 0; column < image[0].length; column += 1) {
    if (!image.find((row) => row[column].includes('#'))) emptyColumns.push(column);
  }

  const getDistance = (a: Galaxy, b: Galaxy) => {
    const minRow = Math.min(a[0], b[0]);
    const maxRow = Math.max(a[0], b[0]);

    const minColumn = Math.min(a[1], b[1]);
    const maxColumn = Math.max(a[1], b[1]);

    const emptyRowsBetween = emptyRows.filter((row) => row > minRow && row < maxRow).length;
    const emptyColumnsBetween = emptyColumns.filter((column) => column > minColumn && column < maxColumn).length;

    return Math.abs(a[0] - b[0]) + (expansion - 1) * (emptyRowsBetween + emptyColumnsBetween) + Math.abs(a[1] - b[1]);
  };

  return getPairs(getGalaxies(image))
    .map((pair) => getDistance(pair[0], pair[1]))
    .reduce((acc, distance) => acc + distance, 0);
}

async function partOne() {
  return getTotalDistance();
}

async function partTwo() {
  return getTotalDistance(1_000_000);
}

export default async function start() {
  return Promise.all([partOne, partTwo].map((puzzle) => puzzle()));
}
