const parseInstructions = code => code.split(',');

const ternary = (condition, x, y) => condition ? x : y;

const getValue = (type, location, instructions) => {
  const value = ternary(type === 0, instructions[location], location);
  return parseInt(value);
}

const save = (value, location, instructions) => {
  instructions[location] = value;  
}

let stdin = [];
let stdout = [];

const success = (p) => [0, ++p];

const add = (instructions, p, x, y, z) => save(x+y, z, instructions) || success(p);

const mul = (instructions, p, x, y, z) => save(x * y, z, instructions) || success(p);

const halt = () => {throw "HALT"};

const last = array => array.slice(-1);

const read = (instructions, p, x) => {
  instructions[x] = last(stdin);
  return success(p); 
}

const write = (instructions, p, x) => {
  stdout.push(x);
  return success(p);
}

const jumpIfTrue = (instructions, p, x, y) => success(ternary(parseInt(x), y, ++p));

const jumpIfFalse = (instructions, p, x, y) =>success(ternary(parseInt(x), ++p, y));

const lessThan = (instructions, p, x, y, z) => {
  const result = ternary(x < y , 1 , 0);
  save(result, z, instructions);
  return success(p); 
}

const equalTo = (instructions, p, x, y, z) => {
  const result = ternary(x === y , 1 , 0);
  save(result, z, instructions);
  return success(p);
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
  const defaultType = ternary(index === argsCount , lastType , 0);
  return type || defaultType;
}

const getCode = (opcode) => {
  const sliced = opcode.slice(-2);
  return ternary(sliced.length === 1 , '0' + sliced , sliced);
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
  return operation(instructions, np,...args);
}


const compute = (code, inputReference = [0], outputReference = []) => {
	const instructions = parseInstructions(code);
  stdin = inputReference;
  stdout = outputReference;
  try {
		let i = 0;
    let stat = 0;
		while (i < instructions.length) {
			const [ns, ni] = perform(i, instructions);
      i = ni;
      stat = ns;
		}
	} catch(e) {
    console.log('error', e)
  }
	return instructions;
}


