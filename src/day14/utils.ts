import { getData } from '../data';

export function printArea(area: string[][]) {
  console.log(area.map((line) => line.join('')).join('\n'));
  console.log();
}

export async function loadData(trainingData = false): Promise<string[][]> {
  return (await getData(14, trainingData)).map((line) => line.split(''));
}
