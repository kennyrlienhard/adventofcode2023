import { getData } from '../data';

export async function loadData(trainingData = false): Promise<string[][]> {
  return (await getData(10, trainingData)).map((line) => line.split(''));
}
