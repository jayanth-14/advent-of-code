 
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
  '05' : {operation: jumpIfTrue, argsCount : 2, lastType : 1},
  '06' : {operation: jumpIfFalse, argsCount : 2, lastType : 1},
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
  const instruction = instructions[pointer].toString();
  console.log(instruction);
  const [opcode, argTypes] = parseOpcode(instruction);
	const {operation, ...rest } = getOperations(opcode)
  const [args, np] = getArgs(instructions, pointer, argTypes, rest);
  return operation(instructions, np,...args);
}


const compute = (code, inputReference, outputReference) => {
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

const generateStds = (input, output) => {
  let i = 0;
  function stdin () {
    const index = i < input.length ? i++ : input.length - 1;
    return input[index];
  }
  function stdout (value) {
    output.push(value);
  }
  return [stdin, stdout];
}

const amplify = (signals, code) => {
  let previousOutput = 0;
  signals.forEach((signal) => {
    const input = [signal, previousOutput];
    const output = [];
    const [stdin, stdout] = generateStds(input, output);
    compute(code, stdin, stdout);
    previousOutput = last(output);
  })
  return previousOutput;
}

const generateCombinations = combinations => permutations(combinations);

const runAllComputations = (signalSets, code) => signalSets.map((set) => last(amplify(set, code)));

const findLargestSignal = (code, eligible) => {
  const signalSets = generateCombinations(eligible);
  const computedSignals = runAllComputations(signalSets, code);
  return Math.max(...computedSignals);
}

