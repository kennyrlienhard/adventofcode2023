import { getData } from '../data';

export class Point {
  id: number;

  x: number;

  y: number;

  z: number;

  vx: number;

  vy: number;

  vz: number;

  constructor(id: number, px: number, py: number, pz: number, vx: number, vy: number, vz: number) {
    this.id = id;

    this.x = px;
    this.y = py;
    this.z = pz;

    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
  }

  clone() {
    return new Point(this.id, this.x, this.y, this.z, this.vx, this.vy, this.vz);
  }

  move(moves = 1) {
    this.x += moves * this.vx;
    this.y += moves * this.vy;
    this.z += moves * this.vz;
  }
}

export async function loadData(trainingData = false): Promise<Point[]> {
  return (await getData(24, trainingData)).map((line, id) => {
    const [position, velocity] = line.split(' @ ');
    const [px, py, pz] = position.split(', ').map(Number);
    const [vx, vy, vz] = velocity.split(', ').map(Number);
    return new Point(id + 1, px, py, pz, vx, vy, vz);
  });
}
