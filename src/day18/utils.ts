import { getData } from '../data';

export enum Direction {
  Right = 'R',
  Left = 'L',
  Up = 'U',
  Down = 'D',
}

export type Instruction = [direction: Direction, steps: number, color: string];

export function drawGrid(visited: [number, number][]) {
  const width = Math.max(...visited.map((v) => v[1]));
  const height = Math.max(...visited.map((v) => v[0]));

  const border = new Set(visited.map((v) => v.join(',')));

  for (let i = 0; i <= height; i += 1) {
    let line = '';

    for (let j = 0; j <= width; j += 1) {
      line += border.has(`${i},${j}`) ? '#' : '.';
    }

    console.log(line);
  }
}

export async function loadData(trainingData = false): Promise<Instruction[]> {
  const regExp = /\(([^)]+)\)/;

  return (await getData(18, trainingData)).map((line) => {
    const [direction, steps, color] = line.split(' ');
    return [direction, parseInt(steps, 10), regExp.exec(color)[1]] as Instruction;
  });
}
