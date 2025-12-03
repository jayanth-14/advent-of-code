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

const bruteForce = (code, range, expected) => {
	const [start, end] = range;
	for(let i = start; i <= end; i++) {
		for (let j = start; j <= end; j++) {
			const result = compute(code, {1:i, 2:j});console.log({i,j, result, expected, isMatch: result === expected});
			if (result === expected) {
				return 100 * i + j;
			}
		}
	}
}

bruteForce('1,0,0,3,1,1,2,3,1,3,4,3,1,5,0,3,2,6,1,19,1,19,9,23,1,23,9,27,1,10,27,31,1,13,31,35,1,35,10,39,2,39,9,43,1,43,13,47,1,5,47,51,1,6,51,55,1,13,55,59,1,59,6,63,1,63,10,67,2,67,6,71,1,71,5,75,2,75,10,79,1,79,6,83,1,83,5,87,1,87,6,91,1,91,13,95,1,95,6,99,2,99,10,103,1,103,6,107,2,6,107,111,1,13,111,115,2,115,10,119,1,119,5,123,2,10,123,127,2,127,9,131,1,5,131,135,2,10,135,139,2,139,9,143,1,143,2,147,1,5,147,0,99,2,0,14,0', [0,99], 1202);
