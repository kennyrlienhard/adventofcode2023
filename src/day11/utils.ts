import { getData } from '../data';

export type Image = string[][];

export type Galaxy = [y: number, x: number, id: number];

export function drawImage(image: Image): void {
  console.log(image.map((row) => row.join('')).join('\n'));
}

export async function loadData(trainingData = false): Promise<Image> {
  return (await getData(11, trainingData)).map((line) => line.split(''));
}
