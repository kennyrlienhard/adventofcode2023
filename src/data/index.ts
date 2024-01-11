import readline from 'readline';
import { createReadStream } from 'fs';

export async function getData(day: number, trainingData = false): Promise<string[]> {
  const filename = `${__dirname}/day${day < 10 ? `0${day}` : day}${trainingData ? '_training' : ''}.txt`;
  const myInterface = readline.createInterface({ input: createReadStream(filename) });

  const result = [];

  return new Promise((resolve) => {
    myInterface
      .on('line', (line: string) => {
        result.push(line);
      })
      .on('close', () => {
        resolve(result);
      });
  });
}
