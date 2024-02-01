import day01 from './day01';
import day02 from './day02';
import day03 from './day03';
import day04 from './day04';
import day05 from './day05';
import day06 from './day06';
import day07 from './day07';
import day08 from './day08';
import day09 from './day09';
import day10 from './day10';
import day11 from './day11';
import day12 from './day12';
import day13 from './day13';
import day14 from './day14';
import day15 from './day15';
import day16 from './day16';
import day17 from './day17';
import day18 from './day18';
import day19 from './day19';
import day20 from './day20';

const PUZZLES = [
  day01,
  day02,
  day03,
  day04,
  day05,
  day06,
  day07,
  day08,
  day09,
  day10,
  day11,
  day12,
  day13,
  day14,
  day15,
  day16,
  day17,
  day18,
  day19,
  day20,
];

const DAYS_TO_SOLVE = [PUZZLES.length];

function printResult(result: { day: number; part: number; start: Date; end: Date; value: number }) {
  console.log(`Day ${('0' + result.day).slice(-2)}. Part ${result.part}: ${result.value}`);
  console.log(`Exucted in ${(result.end.getTime() - result.start.getTime()) / 1000}s`);
  console.log();
}

async function solvePuzzlesForDays(days: number[]) {
  const result = (
    await Promise.all(
      days.map((day) =>
        Promise.all(
          PUZZLES[day - 1].map(async (p, i) => {
            const start = new Date();
            const value = await p();
            return { day, part: i + 1, start, end: new Date(), value };
          })
        )
      )
    )
  ).flat();

  result.forEach(printResult);
}

solvePuzzlesForDays(DAYS_TO_SOLVE);
