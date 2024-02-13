import { getData } from '../data';

export async function loadData(trainingData = false): Promise<string[]> {
  return getData(22, trainingData);
}
