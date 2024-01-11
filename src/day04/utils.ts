import { getData } from '../data';

export async function loadData(trainingData = false): Promise<[number[], number[]][]> {
  const parseCards = (cards: string) =>
    cards
      .trim()
      .replace(/  +/g, ' ')
      .split(' ')
      .map((card) => parseInt(card, 10));

  return (await getData(4, trainingData)).map((line) => {
    const [winningCards, myCards] = line.split(':')[1].split('|');
    return [parseCards(winningCards), parseCards(myCards)];
  });
}
