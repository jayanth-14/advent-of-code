import { chunk } from "jsr:@std/collections";

const parseInstructions = code => code.split(',');

const chunkInstructions = instructions => chunk(instructions,4);

const getValue = (type, location, instructions) => {
  const value = type === 0 ? instructions[location] : location;
  return parseInt(value);
}
const save = (value, location, instructions) => instructions[location] = value;  

const add = (instructions, x,y) => x + y;

const mul = (instructions,x,y) => x * y;

const halt = () => {throw "HALT"};

const stdin = 1;
const stdout = []

const read = (instructions, x) => {
  instructions[x] = stdin; 
  console.log('updated', x);
}
const write = (instructions, x) => stdout.push(x);

const OPCODES = {
	'01' : {operation: add, argsCount : 3, shouldSave : true , lastType : 1},
	'02' : {operation : mul, argsCount : 3, shouldSave : true , lastType : 1},
  '03' : {operation: read, argsCount : 1, shouldSave : false , lastType : 1},
  '04' : {operation: write, argsCount : 1, shouldSave : false, lastType : 0},
	'99' : {operation : halt, argsCount : 0, shouldSave : false, lastType : 0}
}

const getOperations = opcode => OPCODES[opcode];

const perform = (pointer, instructions) => {
	let opcode = instructions[pointer].toString();
  opcode = opcode.length === 1 ? "0" + opcode : opcode;
	const {operation, argsCount, shouldSave, lastType } = getOperations(opcode.slice(-2));
	const argTypes = opcode.slice(0,-2).split('').reverse();
	const args = [];
	for (let index = 1; index <= argsCount; index++) {
		const type = index === argsCount ? lastType : parseInt(argTypes[index - 1] || 0);
		const loc = instructions[++pointer];
		const value = getValue(type, loc, instructions);
		args.push(value);
	} 
  const result = operation(instructions,...args);
  console.log({result});
	if (shouldSave){
    console.log("saving", opcode);
    save(result, args[args.length- 1], instructions);
  }
	return ++pointer;
}


const compute = (code) => {
	const instructions = parseInstructions(code);
  try {
		let i = 0;
		while (i < instructions.length) {
      console.log({i,instruction : instructions[i]});
			i = perform(i, instructions);
		}
	} catch(e) {
    console.log('error', e)
  }
	return instructions;
}


