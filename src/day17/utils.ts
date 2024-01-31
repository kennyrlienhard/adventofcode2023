import { getData } from '../data';

export async function loadData(trainingData = false): Promise<number[][]> {
  return (await getData(17, trainingData)).map((row) => row.split('').map((val) => parseInt(val, 10)));
}
