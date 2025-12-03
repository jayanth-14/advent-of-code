import { chunk } from "jsr:@std/collections";

const parseInstructions = code => code.split(',').map(x => parseInt(x));

const chunkInstructions = instructions => chunk(instructions,4);

const getValue = (location, instructions) => instructions[location];

const save = (value, location, instructions) => instructions[location] = value;  

const add = (x,y) => x + y;

const mul = (x,y) => x * y;

const halt = () => {throw "HALT"};

const OPCODES = {
	1 : add,
	2 : mul,
	99 : halt
}

const getOperations = opcode => OPCODES[opcode];

const perform = (instruction, allInstructions) => { 
  const [opcode, loc1, loc2, destination] = instruction;
	const operation = getOperations(opcode);
	const value1 = getValue(loc1, allInstructions);
	const value2 = getValue(loc2, allInstructions);
	const result = operation(value1, value2);
	save(result, destination, allInstructions);
}

const updateInstructions = (instructions, updates) => {
  const entries = Object.entries(updates);
  for(const entry of entries) {
    const [destination, value] = entry;
    instructions[destination] = value;
  }
}

const compute = (code, updates) => {
	const instructions = parseInstructions(code);
 updateInstructions(instructions, updates); 
  try {
		let i = 0;
		while (i < instructions.length) {
			const instruction = instructions.slice(i, i + 4); i += 4;
			perform(instruction, instructions);
		}
	} catch {
	}
	return instructions;
}
