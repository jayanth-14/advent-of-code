const stdin = 2;
const stdout = [];
let relativeBase = 0;

const parseInstructions = (code) => code.split(",");

const chunkInstructions = (instructions) => chunk(instructions, 4);

const getValue = (type, location, instructions) => {
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

const save = (value, location, instructions) => {
  instructions[location] = value;
};
const add = (instructions, p, modes) => {
  const param1 = getValue(modes[0], instructions[p + 1], instructions);
  const param2 = getValue(modes[1], instructions[p + 2], instructions);
  const param3 = getAddress(modes[2], instructions[p + 3], instructions);
  save(param1 + param2, param3, instructions);
  return p + 4;
};

const mul = (instructions, p, modes) => {
  const param1 = getValue(modes[0], instructions[p + 1], instructions);
  const param2 = getValue(modes[1], instructions[p + 2], instructions);
  const param3 = getAddress(modes[2], instructions[p + 3], instructions);
  save(param1 * param2, param3, instructions);
  return p + 4;
};

const halt = () => {
  throw "HALT";
};

const read = (instructions, p, modes) => {
  const param = getAddress(modes[0], instructions[p + 1], instructions);
  instructions[param] = stdin;
  return p + 2;
};
const write = (instructions, p, modes) => {
  const param = getValue(modes[0], instructions[p + 1], instructions);
  stdout.push(param);
  return p + 2;
};

const jumpIfTrue = (instructions, p, modes) => {
  const param1 = getValue(modes[0], instructions[p + 1], instructions);
  const param2 = getValue(modes[1], instructions[p + 2], instructions);
  return param1 ? param2 : p + 3;
};

const jumpIfFalse = (instructions, p, modes) => {
  const param1 = getValue(modes[0], instructions[p + 1], instructions);
  const param2 = getValue(modes[1], instructions[p + 2], instructions);
  return !param1 ? param2 : p + 3;
};

const lessThan = (instructions, p, modes) => {
  const param1 = getValue(modes[0], instructions[p + 1], instructions);
  const param2 = getValue(modes[1], instructions[p + 2], instructions);
  const param3 = getAddress(modes[2], instructions[p + 3], instructions);
  const result = param1 < param2 ? 1 : 0;
  save(result, param3, instructions);
  return p + 4;
};

const equalTo = (instructions, p, modes) => {
  const param1 = getValue(modes[0], instructions[p + 1], instructions);
  const param2 = getValue(modes[1], instructions[p + 2], instructions);
  const param3 = getAddress(modes[2], instructions[p + 3], instructions);
  const result = param1 === param2 ? 1 : 0;
  save(result, param3, instructions);
  return p + 4;
};
const changeRelativeBase = (instructions, p, modes) => {
  const adder = getValue(modes[0], instructions[p + 1], instructions);
  relativeBase += adder;
  return p + 2;
};

const OPCODES = {
  "01": add,
  "02": mul,
  "03": read,
  "04": write,
  "05": jumpIfTrue,
  "06": jumpIfFalse,
  "07": lessThan,
  "08": equalTo,
  "09": changeRelativeBase,
  "99": halt,
};

const getOperations = (opcode) => OPCODES[opcode];

const getType = (index, argTypes, argsCount, lastType) => {
  let type = argTypes[index - 1];
  const defaultType = index === argsCount ? lastType : 0;
  return type || defaultType;
};

const parseOpcode = (code) => {
  const paddedOpcode = code.padStart(5, "0");
  return {
    opcode: paddedOpcode.slice(-2),
    modes: paddedOpcode.slice(0, 3).split("").reverse(),
  };
};

const perform = (pointer, instructions) => {
  const { opcode, modes } = parseOpcode(
    instructions[pointer].toString(),
  );
  const operation = getOperations(opcode);
  return operation(instructions, pointer, modes);
};

const compute = (code) => {
  const instructions = parseInstructions(code);
  try {
    let i = 0;
    while (i < instructions.length) {
      i = perform(i, instructions);
    }
  } catch (e) {
    console.log("error", e);
  }
  return instructions;
};
