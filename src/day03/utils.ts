import { getData } from '../data';

type Location = { id: string; y: number; x: number };

export type Sign = Location & { value: string; neighbours: Location[] };

export type Value = Location & {
  value: number;
  self: Location[];
  neighbours: Location[];
};

export async function loadData(trainingData = false): Promise<[Value[], Sign[]]> {
  const numbReg = /\d+/g;

  const data = await getData(3, trainingData);

  const symbols = [] as Sign[];
  const numbers = [] as Value[];

  for (let currY = 0; currY < data.length; currY += 1) {
    for (let currX = 0; currX < data[currY].length; currX += 1) {
      if (data[currY][currX] !== '.' && !/^\d+$/.test(data[currY][currX])) {
        const neighbours = [];

        for (let dy = -1; dy < 2; dy += 1) {
          for (let dx = -1; dx < 2; dx += 1) {
            const y = currY + dy;
            const x = currX + dx;

            const isOutside = y < 0 || x < 0 || y >= data.length || x >= data[currY].length;

            if (isOutside || (dy === 0 && dx === 0)) continue;
            else neighbours.push({ id: [y, x].join('%'), y, x });
          }
        }

        symbols.push({ id: [currY, currX].join('%'), value: data[currY][currX], y: currY, x: currX, neighbours });
      }
    }
  }

  for (let lineY = 0; lineY < data.length; lineY += 1) {
    const line = data[lineY];

    let match: RegExpExecArray;

    while (null != (match = numbReg.exec(line))) {
      const neighbours = [];
      const self = [];

      const index = match.index;
      const occupiedX = Array.from({ length: match.at(0).length }, (_, i) => index + i);

      for (let dy = -1; dy < 2; dy += 1) {
        for (let dx = -1; dx < [-1, ...occupiedX].length; dx += 1) {
          const y = lineY + dy;
          const x = match.index + dx;

          const isOutside = y < 0 || x < 0 || y >= data.length || x >= line.length;
          const isOnNumber = dy === 0 && occupiedX.includes(x);

          if (isOutside) continue;

          const location = { id: [y, x].join('%'), y, x };

          if (isOnNumber) self.push(location);
          else neighbours.push(location);
        }
      }

      numbers.push({
        id: [lineY, match.index].join('%'),
        value: parseInt(match.at(0), 10),
        y: lineY,
        x: match.index,
        self,
        neighbours,
      });
    }
  }

  return [numbers, symbols];
}
