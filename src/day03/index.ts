import { Value, loadData } from './utils';

async function partOne() {
  const [values, symbols] = await loadData();
  const symbolIdSet = new Set(symbols.map((symbol) => symbol.id));

  const isPartNumber = (value: Value) => {
    return Boolean(value.neighbours.find((neighbour) => symbolIdSet.has(neighbour.id)));
  };

  return values.filter(isPartNumber).reduce((acc, item) => acc + item.value, 0);
}

async function partTwo() {
  const [values, symbols] = await loadData();
  const gears = symbols.filter((symbol) => symbol.value === '*');

  return gears.reduce((sum, gear) => {
    const neighbourSet = new Set(gear.neighbours.map((neighbour) => neighbour.id));
    const adjacentValues = values.filter((item) => item.self.filter((self) => neighbourSet.has(self.id)).length > 0);
    if (adjacentValues.length === 2) return sum + adjacentValues.reduce((acc, item) => acc * item.value, 1);

    return sum;
  }, 0);
}

export default [partOne, partTwo];
