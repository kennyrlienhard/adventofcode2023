import { Game, SubsetInterface, loadData } from './utils';

const RULES = {
  red: 12,
  green: 13,
  blue: 14,
};

async function partOne() {
  const subsetsAreValid = (subset: SubsetInterface) => {
    return (
      (!subset.red || subset.red <= RULES.red) &&
      (!subset.green || subset.green <= RULES.green) &&
      (!subset.blue || subset.blue <= RULES.blue)
    );
  };

  const isValidGame = (game: Game) => {
    const [, cubes] = game;
    return cubes.every((subset) => subsetsAreValid(subset));
  };

  const data = await loadData();
  const invalidGames = data.filter(isValidGame);
  return invalidGames.reduce((acc, game) => acc + game[0], 0);
}

async function partTwo() {
  const data = await loadData();

  const reducedGames = data.map((game) => {
    const [, cubes] = game;
    return cubes.reduce(
      (acc, subset) => ({
        ...acc,
        ...Object.keys(subset).reduce((curr, key) => ({ ...curr, [key]: subset[key] > acc[key] ? subset[key] : acc[key] }), {}),
      }),
      {
        red: 0,
        blue: 0,
        green: 0,
      }
    );
  });

  return reducedGames.map((game) => Object.values(game).reduce((acc, val) => acc * val, 1)).reduce((acc, val) => acc + val, 0);
}

export default [partOne, partTwo];
