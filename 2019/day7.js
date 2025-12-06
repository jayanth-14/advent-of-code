const parseInstructions = code => code.split(',');

const ternary = (condition, x, y) => condition ? x : y;

const getValue = (type, location, instructions) => {
  const value = ternary(type === 0, instructions[location], location);
  return parseInt(value);
}

const save = (value, location, instructions) => {
  instructions[location] = value;  
}

const add = (instructions, p, x, y, z) => save(x+y, z, instructions) || [0, ++p];

const mul = (instructions, p, x, y, z) => save(x * y, z, instructions) || [0, ++p];

const halt = () => {throw "HALT"};

const stdin = 1;

const stdout = []

const read = (instructions, p, x) => {
  instructions[x] = stdin;
  return [0, ++p];
}

const write = (instructions, p, x) => {
  stdout.push(x);
  return [0, ++p];
}

const jumpIfTrue = (instructions, p, x, y) => [0, ternary(parseInt(x), y, ++p)];

const jumpIfFalse = (instructions, p, x, y) =>[0, ternary(parseInt(x), ++p, y)];

const lessThan = (instructions, p, x, y, z) => {
  const result = x < y ? 1 : 0;
  save(result, z, instructions);
  return [0, ++p];
}

const equalTo = (instructions, p, x, y, z) => {
  const result = x === y ? 1 : 0;
  save(result, z, instructions);
  return [0, ++p];
}

const OPCODES = {
	'01' : {operation: add, argsCount : 3 , lastType : 1},
	'02' : {operation : mul, argsCount : 3, lastType : 1},
  '03' : {operation: read, argsCount : 1 , lastType : 1},
  '04' : {operation: write, argsCount : 1, lastType : 0},
  '05' : {operation: jumpIfTrue, argsCount : 2, lastType : 0},
  '06' : {operation: jumpIfFalse, argsCount : 2, lastType : 0},
  '07' : {operation: lessThan, argsCount : 3, lastType : 1},
  '08' : {operation: equalTo, argsCount : 3, lastType : 1},
	'99' : {operation : halt, argsCount : 0, lastType : 0}
}

const getOperations = opcode =>  OPCODES[opcode];

const getType = (index, argTypes, lastType, argsCount) => {
  let type = argTypes[index - 1];
  const defaultType = index === argsCount ? lastType : 0;
  return type || defaultType;
}

const getCode = (opcode) => {
  const sliced = opcode.slice(-2);
  return sliced.length === 1 ? '0' + sliced : sliced;
}

const parseOpcode = (opcode) => [getCode(opcode), opcode.slice(0, -2).split('').reverse()];

const getArgs = (instructions, pointer, argTypes, {argsCount, lastType}) => {
  const args = [];
  for (let index = 1; index <= argsCount; index++) {
    const type = parseInt(getType(index, argTypes, lastType, argsCount ));
    const loc = instructions[++pointer];
    const value = getValue(type, loc, instructions);
    args.push(value);
  }
  return [args, pointer];
}

const perform = (pointer, instructions) => {
  const [opcode, argTypes] = parseOpcode(instructions[pointer].toString());
	const {operation, ...rest } = getOperations(opcode)
  const [args, np] = getArgs(instructions, pointer, argTypes, rest);
  const [result, p] = operation(instructions, np,...args);
	return p;
}


const compute = (code) => {
	const instructions = parseInstructions(code);
  try {
		let i = 0;
		while (i < instructions.length) {
			i = perform(i, instructions);
		}
	} catch(e) {
    console.log('error', e)
  }
	return instructions;
}


