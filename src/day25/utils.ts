import { getData } from '../data';

export async function loadData(trainingData = false): Promise<[string, string][]> {
  const result = [] as [string, string][];

  const data = await getData(25, trainingData);

  for (const line of data) {
    const [node, connections] = line.split(': ');
    connections.split(' ').forEach((connection) => result.push([node, connection]));
  }

  return result;
}
