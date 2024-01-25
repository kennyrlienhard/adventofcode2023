import { getData } from '../data';

export async function loadData(trainingData = false): Promise<string[]> {
  return (await getData(15, trainingData))[0].split(',');
}
