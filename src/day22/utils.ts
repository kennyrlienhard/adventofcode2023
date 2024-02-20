import { getData } from '../data';

export const X1 = 0;
export const Y1 = 1;
export const Z1 = 2;

export const X2 = 3;
export const Y2 = 4;
export const Z2 = 5;

export async function loadData(trainingData = false): Promise<number[][]> {
  const parseLine = (line: string) =>
    line
      .replace('~', ',')
      .split(',')
      .map((v) => Number(v));

  return (await getData(22, trainingData)).map(parseLine).sort((a, b) => a[Z1] - b[Z1]);
}
