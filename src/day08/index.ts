import { Element, loadData } from './utils';

const gcd = (a: number, b: number) => (a ? gcd(b % a, a) : b);

const lcm = (a: number, b: number) => (a * b) / gcd(a, b);

function solve(position: string, instructions: string, elements: Element) {
  let steps = 0;

  while (true) {
    const direction = instructions[steps % instructions.length] === 'L' ? 0 : 1;
    position = elements[position][direction];
    steps += 1;

    if (position[2] === 'Z') break;
  }

  return steps;
}

async function partOne() {
  return solve('AAA', ...(await loadData()));
}

async function partTwo() {
  const data = await loadData();
  const starts = Object.keys(data[1]).filter((key) => key[2] === 'A');

  return starts.map((position) => solve(position, ...data)).reduce(lcm);
}

export default [partOne, partTwo];
