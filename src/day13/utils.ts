import { getData } from '../data';

export async function loadData(trainingData = false): Promise<string[][]> {
  const data = await getData(13, trainingData);

  const result = [];

  let pattern = [];

  for (let i = 0; i < data.length; i += 1) {
    if (data[i] === '') {
      result.push(pattern);
      pattern = [];
      continue;
    }

    pattern.push(data[i]);
  }

  result.push(pattern);

  return result;
}
