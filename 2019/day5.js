import { chunk } from "jsr:@std/collections";

const parseInstructions = code => code.split(',');

const chunkInstructions = instructions => chunk(instructions,4);

const getValue = (type, location, instructions) => {
  const value = type === 0 ? instructions[location] : location;
  return parseInt(value);
}
const save = (value, location, instructions) => {
  console.log({value, location })
  instructions[location] = value;  
}
const add = (instructions, p, x,y) => [x + y, ++p];

const mul = (instructions, p, x,y) => [x * y, ++p];

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

const jumpIfTrue = (instructions, p, x, y) => console.log({x,y}) || [0, parseInt(x) > 0 ? y : ++p];

const jumpIfFalse = (instructions, p, x, y) =>console.log({x,y}) || [0, parseInt(x) ? ++p : y];

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
	'01' : {operation: add, argsCount : 3, shouldSave : true , lastType : 1},
	'02' : {operation : mul, argsCount : 3, shouldSave : true , lastType : 1},
  '03' : {operation: read, argsCount : 1, shouldSave : false , lastType : 1},
  '04' : {operation: write, argsCount : 1, shouldSave : false, lastType : 0},
  '05' : {operation: jumpIfTrue, argsCount : 2, shouldSave : false, lastType : 0},
  '06' : {operation: jumpIfFalse, argsCount : 2, shouldSave : false, lastType : 0},
  '07' : {operation: lessThan, argsCount : 3, shouldSave : false, lastType : 1},
  '08' : {operation: equalTo, argsCount : 3, shouldSave : false, lastType : 1},
	'99' : {operation : halt, argsCount : 0, shouldSave : false, lastType : 0}
}

const getOperations = opcode => OPCODES[opcode];

const getType = (index, argTypes, argsCount, lastType) => {
  let type = argTypes[index - 1];
  const defaultType = index === argsCount ? lastType : 0;
  return type || defaultType;
}

const perform = (pointer, instructions) => {
	let opcode = instructions[pointer].toString();
  opcode = opcode.length === 1 ? "0" + opcode : opcode;
	const {operation, argsCount, shouldSave, lastType } = getOperations(opcode.slice(-2));
	const argTypes = opcode.slice(0,-2).split('').reverse();
	const args = [];
	for (let index = 1; index <= argsCount; index++) {
		const type =  parseInt(getType(index, argTypes, argsCount, lastType));
		const loc = instructions[++pointer];
		const value = getValue(type, loc, instructions);
		args.push(value);
	}
  const [result, p] = operation(instructions, pointer,...args);
  console.log({result, p});
	if (shouldSave){
   save(result, args[args.length- 1], instructions);
  }
	return p;
}


const compute = (code) => {
	const instructions = parseInstructions(code);
  try {
		let i = 0;
		while (i < instructions.length) {
      console.log({i, instruction : instructions[i]})
			i = perform(i, instructions);
		}
	} catch(e) {
    console.log('error', e)
  }
	return instructions;
}


