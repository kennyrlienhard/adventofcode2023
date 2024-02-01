import { Message, ModuleType, Pulse, Module, loadData } from './utils';

const IS_TRAINING = false;

function gcd(a: number, b: number) {
  return a ? gcd(b % a, a) : b;
}

function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

function logMessage(msg: Message) {
  const [sender, receiver, value] = msg;
  console.log(`${sender} -${value === Pulse.Low ? 'low' : 'high'}-> ${receiver}`);
}

function createMessages(module: Module, pulse: Pulse): Message[] {
  return module.destinations.map((d) => [module.id, d, pulse]);
}

function sendMessage(modules: Module[], msg: Message): [Module[], Message[]] {
  if (IS_TRAINING) logMessage(msg);

  const [sender, receiver, value] = msg;

  const module = modules.find((m) => m.id === receiver);
  if (!module) return [modules, []];

  if (module.type === ModuleType.FlipFlop) {
    if (value === Pulse.Low) {
      const messages = createMessages(module, module.state ? Pulse.Low : Pulse.High);
      module.state = !module.state;
      return [modules, messages];
    }

    return [modules, []];
  }

  if (module.type === ModuleType.Conjunction) {
    module.memory[sender] = value;
    return [
      modules,
      createMessages(module, Object.values(module.memory).every((v) => v === Pulse.High) ? Pulse.Low : Pulse.High),
    ];
  }

  if (module.type === 'broadcaster') {
    return [modules, createMessages(module, value)];
  }

  return [modules, []];
}

async function partOne() {
  const BUTTON_PRESSES = 1000;

  let modules = await loadData();

  let lowPulses = 0;
  let highPulses = 0;

  for (let round = 0; round < BUTTON_PRESSES; round += 1) {
    let messages = [['button', 'broadcaster', Pulse.Low]] as Message[];

    while (messages.length) {
      const nextMessages = [];

      for (const message of messages) {
        if (message[2] === Pulse.Low) lowPulses += 1;
        else highPulses += 1;

        const [nextModules, newMessages] = sendMessage(modules, message);

        nextMessages.push(...newMessages);
        modules = nextModules;
      }

      messages = nextMessages;
    }
  }

  return lowPulses * highPulses;
}

async function partTwo() {
  let modules = await loadData();

  let buttonPresses = 0;

  // 1. Assumption: There is only one feed to the rx module. The feed is a conjunction module.
  const feed = modules.find((m) => m.destinations.includes('rx')).id;

  // 2. Assumption: All input modules to the feed must send a high pulse, so that RX receives a low pulse from the feed.
  // Hence, we're looking for the LCM of all input modules
  const inputModules = modules.filter((m) => m.destinations.includes(feed)).map((m) => m.id);

  const cycleLength = {};

  while (true) {
    let messages = [['button', 'broadcaster', Pulse.Low]] as Message[];
    buttonPresses += 1;

    while (messages.length) {
      const nextMessages = [];

      for (const message of messages) {
        if (message[1] === feed && message[2] === Pulse.High) {
          if (!Object.keys(cycleLength).includes(message[0])) {
            cycleLength[message[0]] = buttonPresses;
          }

          if (Object.keys(cycleLength).length === inputModules.length) {
            return Object.values(cycleLength).reduce(lcm);
          }
        }

        const [nextState, newMessages] = sendMessage(modules, message);

        nextMessages.push(...newMessages);
        modules = nextState;
      }

      messages = nextMessages;
    }
  }
}

export default [partOne, partTwo];
