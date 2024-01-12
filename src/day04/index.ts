import { loadData } from './utils';

async function partOne() {
  const data = await loadData();

  return data.reduce((sum, [winningCards, myCards]) => {
    const cards = winningCards.filter((card) => myCards.includes(card));
    return sum + cards.reduce((acc, card, i) => (i === 0 ? 1 : 2 * acc), 0);
  }, 0);
}

async function partTwo() {
  const data = await loadData();
  const cards = {} as Record<string, number>;

  for (let index = 0; index < data.length; index += 1) {
    const cardsToAdd = data[index][0].filter((winner) => data[index][1].includes(winner)).map((_, i) => i + 1 + index + 1);
    for (const add of new Array((cards[index + 1] || 0) + 1).fill(cardsToAdd).flat()) cards[add] = (cards[add] || 0) + 1;
    cards[index + 1] = (cards[index + 1] || 0) + 1;
  }

  return Object.values(cards).reduce((acc, card) => acc + card, 0);
}

export default [partOne, partTwo];
