// ap :: (a -> b -> c) -> (a -> b) -> (a -> c)
export const ap =
  (f) =>
  // Applicative instance for functions.
  // f(x) applied to g(x).
  (g) =>
  (x) =>
    f(x)(g(x));

// compose (<<<) :: (b -> c) -> (a -> b) -> a -> c
export const compose = (...fs) =>
  // A function defined by the right-to-left
  // composition of all the functions in fs.
  fs.reduce(
    (f, g) => (x) => f(g(x)),
    (x) => x
  );

// cycle :: [a] -> Generator [a]
export const cycle = function* (xs) {
  // An infinite repetition of xs,
  // from which an arbitrary prefix
  // may be taken.
  const lng = xs.length;
  let i = 0;

  while (true) {
    yield xs[i];
    i = (1 + i) % lng;
  }
};

// length :: [a] -> Int
export const length = (xs) =>
  // Returns Infinity over objects without finite
  // length. This enables zip and zipWith to choose
  // the shorter argument when one is non-finite,
  // like cycle, repeat etc
  'GeneratorFunction' !== xs.constructor.constructor.name ? xs.length : Infinity;

// subtract :: Num -> Num -> Num
export const subtract = (x) => (y) => y - x;

// take :: Int -> [a] -> [a]
// take :: Int -> String -> String
export const take =
  (n) =>
  // The first n elements of a list,
  // string of characters, or stream.
  (xs) =>
    'GeneratorFunction' !== xs.constructor.constructor.name
      ? xs.slice(0, n)
      : Array.from(
          {
            length: n,
          },
          () => {
            const x = xs.next();

            return x.done ? [] : [x.value];
          }
        ).flat();

// tail :: [a] -> [a]
export const tail = (xs) =>
  // A new list consisting of all
  // items of xs except the first.
  'GeneratorFunction' !== xs.constructor.constructor.name ? (Boolean(xs.length) ? xs.slice(1) : undefined) : (take(1)(xs), xs);

// uncurry :: (a -> b -> c) -> ((a, b) -> c)
export const uncurry =
  (f) =>
  // A function over a pair, derived
  // from a curried function.
  (...args) => {
    const [x, y] = Boolean(args.length % 2) ? args[0] : args;

    return f(x)(y);
  };

// zip :: [a] -> [b] -> [(a, b)]
export const zip = (xs) => (ys) => {
  const n = Math.min(length(xs), length(ys)),
    vs = take(n)(ys);

  return take(n)(xs).map((x, i) => [x, vs[i]]);
};
