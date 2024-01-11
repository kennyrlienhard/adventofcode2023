import { loadData } from './utils';

enum CardScore {
  FiveOfAKind = 21,
  FourOfAKind = 20,
  FullHouse = 19,
  ThreeOfAKind = 18,
  TwoPairs = 17,
  Pair = 16,
  HighCard = 15,
  'A' = 14,
  'K' = 13,
  'Q' = 12,
  'J' = 11,
  'T' = 10,
}

function getScoreForCard(card: string, withJoker: boolean): number {
  if (withJoker && card === 'J') return 1;
  return CardScore[card] || parseInt(card, 10);
}

const scoreHand = (cards: string, withJoker: boolean) => {
  const buckets = cards.split('').reduce((acc, card) => ({ ...acc, [card]: (acc[card] || 0) + 1 }), {}) as {
    [key: string]: number;
  };

  const jokers = withJoker ? buckets.J || 0 : 0;
  if (withJoker) delete buckets.J;

  const [first = 0, second = 0] = Object.values(buckets).sort((a, b) => b - a);
  return (first + jokers) * 2 + second;
};

async function play(withJoker = false) {
  const data = (await loadData()).map(([hand, bid]) => ({
    hand,
    cards: hand.split('').map((c) => getScoreForCard(c, withJoker)),
    bid,
    score: scoreHand(hand, withJoker),
  }));

  const ranks = data.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;

    for (let i = 0; a.cards.length; i += 1) {
      if (a.cards[i] !== b.cards[i]) return a.cards[i] - b.cards[i];
    }
  });

  return ranks.reduce((acc, item, rank) => acc + (rank + 1) * item.bid, 0);
}

export default async function start() {
  return Promise.all([() => play(), () => play(true)].map((puzzle) => puzzle()));
}
