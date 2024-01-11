import { getData } from '../data';

export interface SubsetInterface {
  red: number;
  green: number;
  blue: number;
}

export type Game = [number, SubsetInterface[]];

export async function loadData(trainingData = false): Promise<Game[]> {
  return (await getData(2, trainingData)).map((line) => {
    const id = parseInt(line.split(':')[0].match(/\d/g).join(''), 10);

    const cubes = line
      .split(':')[1]
      .trim()
      .split(';')
      .map((subset) =>
        subset.split(',').reduce((acc, val) => {
          const cube = val.trim().split(' ');
          return { ...acc, [cube[1]]: parseInt(cube[0], 10) };
        }, {})
      ) as SubsetInterface[];

    return [id, cubes] as Game;
  });
}
