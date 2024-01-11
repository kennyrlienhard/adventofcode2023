import { loadData } from './utils';

async function partOne() {
  const data = await loadData(true);
  console.log(data);
  return 0;
}

async function partTwo() {
  // const data = await loadData();
  // console.log(data);
  return 0;
}

export default async function start() {
  return Promise.all([partOne, partTwo].map((puzzle) => puzzle()));
}
