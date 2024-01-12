import { loadData } from './utils';

enum Direction {
  Up = 'top',
  Down = 'down',
  Right = 'right',
  Left = 'left',
}

type Point = [y: number, x: number];

type Sketch = string[][];

type Connector = { point: Point; direction: Direction };

const ALLOWED_PIPES = {
  [Direction.Up]: ['|', 'F', '7'],
  [Direction.Down]: ['|', 'L', 'J'],
  [Direction.Right]: ['-', '7', 'J'],
  [Direction.Left]: ['-', 'F', 'L'],
};

const MOVE = {
  [Direction.Up]: [-1, 0],
  [Direction.Down]: [1, 0],
  [Direction.Right]: [0, 1],
  [Direction.Left]: [0, -1],
};

function getStart(sketch: Sketch): Point {
  for (let y = 0; y < sketch.length; y += 1) {
    for (let x = 0; x < sketch[y].length; x += 1) {
      if (sketch[y][x] === 'S') return [y, x];
    }
  }

  return [0, 0];
}

function getPipe(sketch: Sketch, [y, x]: Point): string {
  if (y < 0 || y >= sketch.length || x < 0 || x >= sketch[y].length) return null;
  return sketch[y][x];
}

function move(direction: Direction, point: Point): Point {
  return [point[0] + MOVE[direction][0], point[1] + MOVE[direction][1]];
}

function getNextConnector(pipe: string, position: Connector): Connector {
  const createConnector = (direction: Direction, point: Point): Connector => ({
    direction,
    point: move(direction, point),
  });

  const { direction, point } = position;

  if (['-', '|'].includes(pipe)) return createConnector(direction, point);

  if (direction === Direction.Up) {
    if (pipe === 'F') return createConnector(Direction.Right, point);
    if (pipe === '7') return createConnector(Direction.Left, point);
  }

  if (direction === Direction.Down) {
    if (pipe === 'L') return createConnector(Direction.Right, point);
    if (pipe === 'J') return createConnector(Direction.Left, point);
  }

  if (direction === Direction.Right) {
    if (pipe === 'J') return createConnector(Direction.Up, point);
    if (pipe === '7') return createConnector(Direction.Down, point);
  }

  if (direction === Direction.Left) {
    if (pipe === 'F') return createConnector(Direction.Down, point);
    if (pipe === 'L') return createConnector(Direction.Up, point);
  }
}

function getStartConnectors(sketch: Sketch, startFrom: Point): Connector[] {
  return Object.values(Direction)
    .map((direction) => {
      const point = move(direction, startFrom);
      return ALLOWED_PIPES[direction].includes(getPipe(sketch, point)) && { direction, point };
    })
    .filter((c) => c);
}

async function partOne() {
  const sketch = await loadData();
  const startFrom = getStart(sketch);

  let steps = 1;

  let connectors = getStartConnectors(sketch, startFrom);

  while (connectors[0].point.join(';') !== connectors[1].point.join(';')) {
    connectors = connectors.map((c) => getNextConnector(getPipe(sketch, c.point), c));
    steps += 1;
  }

  return steps;
}

function getAreaViaShoelaceFormula(vertices: Point[]): number {
  let area = 0;

  for (let i = 0; i < vertices.length; i += 1) {
    const nextIndex = (i + 1) % vertices.length;
    const [aY, aX] = vertices[i];
    const [bY, bX] = vertices[nextIndex];
    area += aX * bY - aY * bX;
  }

  return Math.abs(area) / 2;
}

function getPolygonData(sketch: Sketch): [area: number, boundaryPoints: number] {
  const startingPoint = getStart(sketch);
  const vertices: Point[] = [startingPoint];

  let numberOfBoundaryPoints = 1;
  let connector = getStartConnectors(sketch, startingPoint)[0];

  while (connector.point.join(';') !== startingPoint.join(';')) {
    const val = getPipe(sketch, connector.point);
    if (['F', '7', 'L', 'J'].includes(val)) vertices.push(connector.point);
    connector = getNextConnector(val, connector);
    numberOfBoundaryPoints++;
  }

  return [getAreaViaShoelaceFormula(vertices), numberOfBoundaryPoints];
}

/*
Pick's theorem (https://en.wikipedia.org/wiki/Pick%27s_theorem)
A = i + (b / 2) - 1

Where:
A = area of the polygon
i = number of interior points
b = number of boundary points

Hence:
i = A - (b / 2) + 1
*/

async function partTwo() {
  const [area, boundaryPoints] = getPolygonData(await loadData());
  return area - boundaryPoints / 2 + 1;
}

export default [partOne, partTwo];
