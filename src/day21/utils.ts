import { getData } from '../data';

export async function loadData(trainingData = false): Promise<string[][]> {
  return (await getData(21, trainingData)).map((line) => line.split(''));
}
