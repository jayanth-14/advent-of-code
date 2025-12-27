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

const getValue = (instructions, location, type) => {
  switch (type) {
    case "0":
      return parseInt(instructions[location] || 0);
    case "1":
      return parseInt(location);
    case "2":
      return parseInt(instructions[relativeBase + parseInt(location)] || 0);
  }
};

const getAddress = (mode, param) => {
  if (mode === "0") return param;
  if (mode === "2") return relativeBase + parseInt(param);
};

const writeOutput = (_, output, ip) => ({ ip: ip + 2, output });

const parseOpcode = (opcode) => {
  const padded = String(opcode).padStart(5, "0");
  return {
    opcode: Number(padded.slice(3)),
    modes: [...padded.slice(0, 3)].reverse()
  };
};

const changeRelativeBase = (instructions, p, modes) => {
  const adder = getValue(instructions, instructions[p + 1], modes[0]);
  relativeBase += adder;
  return p + 2;
};

const compute = (array, signal,  ip) => {
  const instructions = array;
  let output = 0;
  let i = 1;
  while (ip < instructions.length) {
    if (instructions[ip] === 99 || instructions[ip] === '99') {
      return { instructions, ip, output, isHalted: true };
    }
    const { opcode, modes } = parseOpcode(instructions[ip]);
    const p1 = getValue(instructions, instructions[ip + 1], modes[0]);
    const p2 = getValue(instructions, instructions[ip + 2], modes[1]);
    const p3 = getAddress(modes[2], instructions[ip + 3]);
    console.log({opcode});
    switch (opcode) {
      case 1:
        ip = add(instructions, p1, p2, p3, ip).ip;
        break;
      case 2:
        ip = mul(instructions, p1, p2, p3, ip).ip;
        break;
      case 3: {
        const addr = getAddress(modes[0], instructions[ip + 1]);
        instructions[addr] = signal;
        ip += 2;
        break;
      }
      case 4: {
        const r = writeOutput(instructions, p1, ip);
        ip = r.ip;
        output = r.output;
        return { instructions, ip, output, isHalted: false };
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
      case 9:
        ip = changeRelativeBase(instructions, ip, modes);
        break;

      default:
        throw new Error(`Unknown opcode ${opcode}`);
    }
  }

  return { instructions, ip, output, isHalted: false };
};


const COMPASS = {
  'N' : { left : 'W', right : 'E', offset : { dx : 0, dy : -1 }},
  'E' : { left : 'N', right : 'S', offset : { dx : 1, dy : 0 }},
  'S' : { left : 'E', right : 'W', offset : { dx : 0, dy : 1 }},
  'W' : { left : 'S', right : 'N', offset : { dx : -1, dy : 0 }}
};

const getColor = (grid, position) => {
  const key = position.toString();
  return grid[key] || 0;
}

const paintColor = (grid, position, color) => {
  const key = position.toString();
  grid[key] = color;
}

const updateState = (state, result) => {
    console.log(result);
    state.instructions = result.instructions;
    state.pointer = result.ip;
    state.isHalt = result.isHalted;
}

const updatePosition = (position, offset) => {
  position[0] += offset.dx;
  position[1] += offset.dy;
}

const rebot = (code) => {
  const position = [0, 0];
  let direction = 'N';
  const grid = {};
  const instructions = code.split(',').map(x => +x);
  let state = { instructions, pointer : 0, isHalt : false };
  grid['0,0'] = 1;
  while (!state.isHalt) {
    const color = getColor(grid, position);
    const result = compute(state.instructions, color, state.pointer);
    updateState(state, result);
    const colorToPaint = result.output;
    paintColor(grid, position, colorToPaint);
    const result2 = compute(state.instructions, color, state.pointer);
    updateState(state, result2);
    const turning = result2.output === 0 ? 'left' : 'right';
    direction = COMPASS[direction][turning];
    updatePosition(position, COMPASS[direction].offset);
  }
  return grid;
}

const visualiseGrid = code => {
  const grid = rebot(code);
  const coords = Object.keys(grid).map(k => k.split(",").map(Number));
  const xs = coords.map(c => c[0]);
  const ys = coords.map(c => c[1]);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  for (let y = minY; y <= maxY; y++) {
    let row = "";
    for (let x = minX; x <= maxX; x++) {
      row += grid[`${x},${y}`] === 1 ? "█" : " ";
    }
    console.log(row);
  }
}
