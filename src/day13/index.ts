import { loadData } from './utils';

function getMirror(pattern: string[], smudge = 0): number {
  const createRow = (i: number) => pattern.map((row) => row[i]);

  const findVerticalReflection = () => {
    for (let row = 0; row < pattern.length - 1; row += 1) {
      let left = row;
      let right = row + 1;
      let mismatch = 0;

      while (left >= 0 && right < pattern.length) {
        const leftRow = pattern[left].split('');
        const rightRow = pattern[right].split('');
        mismatch += leftRow.reduce((acc, curr, i) => acc + (curr === rightRow[i] ? 0 : 1), 0);

        left -= 1;
        right += 1;
      }

      if (mismatch === smudge) return (row + 1) * 100;
    }

    return null;
  };

  const findHorizontalReflection = () => {
    for (let col = 0; col < pattern[0].length - 1; col += 1) {
      let top = col;
      let bottom = col + 1;
      let mismatch = 0;

      while (top >= 0 && bottom < pattern[0].length) {
        const topCol = createRow(top);
        const bottomCol = createRow(bottom);
        mismatch += topCol.reduce((acc, curr, i) => acc + (curr === bottomCol[i] ? 0 : 1), 0);

        top -= 1;
        bottom += 1;
      }

      if (mismatch === smudge) return col + 1;
    }
  };

  return findVerticalReflection() || findHorizontalReflection() || null;
}

async function partOne() {
  return (await loadData()).reduce((acc, pattern) => acc + getMirror(pattern), 0);
}

async function partTwo() {
  return (await loadData()).reduce((acc, pattern) => acc + getMirror(pattern, 1), 0);
}

export default [partOne, partTwo];
