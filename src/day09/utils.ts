import { getData } from '../data';

export async function loadData(trainingData = false): Promise<number[][]> {
  return (await getData(9, trainingData)).map((line) => line.split(' ').map((val) => Number(val)));
}
