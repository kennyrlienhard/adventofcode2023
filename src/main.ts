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

const PUZZLES = [day01, day02, day03, day04, day05, day06, day07, day08, day09, day10, day11, day12];

const DAYS_TO_SOLVE = [12];

function printResult(day: number, answers: number[]) {
  const printPartial = (acc: string, part: number, partIndex: number) => `${acc}Part ${partIndex + 1}: ${part}, `;

  console.log(`Day ${day}. ${answers.reduce(printPartial, '').slice(0, -2)}`);
}

async function solvePuzzlesForDays(puzzlesToSolve: number[]) {
  const puzzles = puzzlesToSolve.map((day) => ({ day, solve: PUZZLES[day - 1] }));
  const results = await Promise.all(puzzles.map((puzzle) => puzzle.solve()));
  results.forEach((answers, index) => printResult(puzzles[index].day, answers));
}

solvePuzzlesForDays(DAYS_TO_SOLVE);
