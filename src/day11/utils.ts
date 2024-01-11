import { getData } from '../data';

export type Image = string[][];

export type Galaxy = [y: number, x: number, id: number];

export function drawImage(image: Image): void {
  console.log(image.map((row) => row.join('')).join('\n'));
}

export async function loadData(trainingData = false): Promise<Image> {
  return (await getData(11, trainingData)).map((line) => line.split(''));

  // const result = [...data.map((row) => [...row])];

  // let rowsAdded = 0;
  // let columnsAdded = 0;

  // for (let row = 0; row < data.length; row += 1) {
  //   if (!data[row].includes('#')) {
  //     result.splice(row + rowsAdded, 0, Array(data[row].length).fill('.'));
  //     rowsAdded += 1;
  //   }
  // }

  // for (let column = 0; column < data[0].length; column += 1) {
  //   if (!data.find((row) => row[column].includes('#'))) {
  //     for (const row of result) row.splice(column + columnsAdded, 0, '.');
  //     columnsAdded += 1;
  //   }
  // }

  // return result;
}
