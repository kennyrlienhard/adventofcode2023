import { getData } from '../data';

export enum ModuleType {
  FlipFlop = '%',
  Conjunction = '&',
  Broadcast = 'broadcaster',
}

export enum Pulse {
  Low = 0,
  High = 1,
}

export type Module = {
  id: string;
  type: ModuleType;
  state: boolean;
  destinations: string[];
  memory: { [key: string]: number };
};

export type Message = [sender: string, receiver: string, value: Pulse];

export async function loadData(trainingData = false): Promise<Module[]> {
  const result = [];

  const data = await getData(20, trainingData);

  for (const line of data) {
    const [id, targets] = line.split(' -> ');

    result.push({
      id: id === ModuleType.Broadcast ? id : id.slice(1),
      type: id === ModuleType.Broadcast ? id : id.slice(0, 1),
      state: false,
      destinations: targets.split(', '),
      memory: {},
    });
  }

  return result.map((module) => {
    if (module.type === ModuleType.Conjunction) {
      module.memory = result
        .filter((m) => m.destinations.includes(module.id))
        .reduce((acc, m) => ({ ...acc, [m.id]: Pulse.Low }), {});
    }

    return module;
  });
}
