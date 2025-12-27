let relativeBase = 0;

const add = (array, v1, v2, loc, ip) => {
  array[loc] = v1 + v2;
  return { ip: ip + 4 };
};

const mul = (array, v1, v2, loc, ip) => {
  array[loc] = v1 * v2;
  return { ip: ip + 4 };
};

const jumpIfTrue = (_, v1, v2, __, ip) => {
  return { ip: v1 !== 0 ? v2 : ip + 3 };
};

const jumpIfFalse = (_, v1, v2, __, ip) => {
  return { ip: v1 === 0 ? v2 : ip + 3 };
};

const lessThan = (array, v1, v2, loc, ip) => {
  array[loc] = v1 < v2 ? 1 : 0;
  return { ip: ip + 4 };
};

const equals = (array, v1, v2, loc, ip) => {
  array[loc] = v1 === v2 ? 1 : 0;
  return { ip: ip + 4 };
};

const takeInput = (array, input1, input2, loc, isSignalUsed, ip) => {
  array[loc] = !isSignalUsed ? input1 : input2;
  return { ip: ip + 2, isSignalUsed: true };
};

const writeOutput = (_, output, ip) => ({ ip: ip + 2, output });

const parseOpcode = (opcode) => {
  const padded = String(opcode).padStart(5, "0");
  return {
    opcode: Number(padded.slice(3)),
    modes: [...padded.slice(0, 3)].reverse().map(Number),
  };
};

const getValue = (array, index, mode) =>
  mode === 1 ? array[index] : array[array[index]];

const compute = (array, signal, thrust, ip, isSignalUsed) => {
  const instructions = [...array];
  let output = 0;

  while (ip < instructions.length) {
    if (instructions[ip] === 99) {
      return { instructions, ip, output, isSignalUsed, isHalted: true };
    }

    const { opcode, modes } = parseOpcode(instructions[ip]);
    const p1 = getValue(instructions, ip + 1, modes[0]);
    const p2 = getValue(instructions, ip + 2, modes[1]);
    const p3 = instructions[ip + 3];

    switch (opcode) {
      case 1:
        ip = add(instructions, p1, p2, p3, ip).ip;
        break;
      case 2:
        ip = mul(instructions, p1, p2, p3, ip).ip;
        break;
      case 3: {
        const r = takeInput(
          instructions,
          signal,
          thrust,
          instructions[ip + 1],
          isSignalUsed,
          ip,
        );
        ip = r.ip;
        isSignalUsed = r.isSignalUsed;
        break;
      }
      case 4: {
        const r = writeOutput(instructions, p1, ip);
        ip = r.ip;
        output = r.output;
        return { instructions, ip, output, isSignalUsed, isHalted: false };
      }
      case 5:
        ip = jumpIfTrue(instructions, p1, p2, p3, ip).ip;
        break;
      case 6:
        ip = jumpIfFalse(instructions, p1, p2, p3, ip).ip;
        break;
      case 7:
        ip = lessThan(instructions, p1, p2, p3, ip).ip;
        break;
      case 8:
        ip = equals(instructions, p1, p2, p3, ip).ip;
        break;
      default:
        throw new Error(`Unknown opcode ${opcode}`);
    }
  }

  return { instructions, ip, output, isSignalUsed, isHalted: false };
};

const generateMaximumSignal = (code, eligibleSignals) => {
  const signalCombinations = permutations(eligibleSignals);
  const baseInstructions = code.split(",").map(Number);
  let maxThrust = -Infinity;

  for (const signals of signalCombinations) {
    const amplifiers = Array.from({ length: 5 }, () => ({
      instructions: [...baseInstructions],
      ip: 0,
      isHalt: false,
      isSignalUsed: false,
    }));

    let thrust = 0;
    let haltedCount = 0;

    while (haltedCount < amplifiers.length) {
      for (let i = 0; i < amplifiers.length; i++) {
        const amp = amplifiers[i];
        if (amp.isHalt) continue;

        const result = compute(
          amp.instructions,
          signals[i],
          thrust,
          amp.ip,
          amp.isSignalUsed,
        );

        amp.instructions = result.instructions;
        amp.ip = result.ip;
        amp.isSignalUsed = result.isSignalUsed;

        if (result.isHalted && !amp.isHalt) {
          haltedCount++;
        }

        amp.isHalt = result.isHalted;

        if (!result.isHalted) {
          thrust = result.output;
        }
      }
    }

    maxThrust = Math.max(maxThrust, thrust);
  }

  return maxThrust;
};

console.log(generateMaximumSignal(Deno.args[0], [5, 6, 7, 8, 9]));

