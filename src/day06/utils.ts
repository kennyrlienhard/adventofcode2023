import { getData } from '../data';

export async function loadData(trainingData = false): Promise<[number, number][]> {
  const [times, distances] = (await getData(6, trainingData)).map((line) => line.match(/(\d+)/g));
  return times.map((time, index) => [parseInt(time, 10), parseInt(distances[index], 10)]);
}
