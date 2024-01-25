import { loadData } from './utils';

type Box = [string, number];

function hash(value: string) {
  return value.split('').reduce((acc, v) => {
    acc += v.charCodeAt(0);
    acc *= 17;
    return acc % 256;
  }, 0);
}

async function partOne() {
  return (await loadData()).reduce((acc, v) => acc + hash(v), 0);
}

async function partTwo() {
  const IS_TRAINING = false;

  const data = await loadData(IS_TRAINING);
  const boxes = new Map<number, Box[]>();

  let result = 0;

  const printBox = (label: string) => {
    if (!IS_TRAINING) return;

    console.log('After', label);
    console.log(boxes);
    console.log();
  };

  for (let i = 0; i < data.length; i += 1) {
    const value = data[i];

    const isRemoveOperation = value.includes('-');

    if (isRemoveOperation) {
      const label = value.split('-')[0];
      const index = hash(label);

      if (!boxes.has(index)) boxes.set(index, []);

      boxes.set(
        index,
        boxes.get(index).filter((item) => item[0] !== label)
      );

      printBox(value);

      continue;
    }

    const label = value.split('=')[0];
    const focalLength = parseInt(value.split('=')[1], 10);
    const index = hash(label);

    if (!boxes.has(index)) boxes.set(index, []);

    const hasLabel = boxes.get(index).some(([l]) => l === label);

    if (hasLabel) {
      boxes.set(
        index,
        boxes.get(index).map((item) => (item[0] === label ? [label, focalLength] : item))
      );
    } else {
      boxes.get(index).push([label, focalLength]);
    }

    printBox(value);
  }

  for (const [key, value] of boxes.entries()) {
    result += value.reduce((acc, [, focalLength], i) => acc + (key + 1) * (i + 1) * focalLength, 0);
  }

  return result;
}

export default [partOne, partTwo];
