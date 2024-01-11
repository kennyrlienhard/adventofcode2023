import { getData } from '../data';

export async function loadData(trainingData = false): Promise<[string, number][]> {
  return (await getData(7, trainingData)).map((line) => {
    const [hand, bid] = line.split(' ');
    return [hand, parseInt(bid, 10)];
  });
}
