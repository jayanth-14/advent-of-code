const parse = instruction => [instruction[0],instruction.slice(1)]

const offsets = {
	'R' : {x:1, y:0},
	'L' : {x:-1, y:0},
	'U' : {x:0, y:1},
	'D' : {x:0, y:-1}
}

const splitInstructions = instructions => instructions.match(/\w\d+/g);

const move = (direction, [x,y]) => {
	const {x:dx, y:dy} = offsets[direction];
	return [x+dx, y+dy]
}

const performInstruction = (instruction, location) => {
	const [direction, steps] = parse(instruction);
	const locations = [];
	let lastLocation = location;
	locations.push(location);
	for(let i = 0; i < steps; i++) {
		lastLocation = move(direction,lastLocation)
		locations.push(lastLocation);
	}
	return locations;
}

const executeInstructions = text  => {
	let location = [0,0];
	const locations = [];
	const instructions = splitInstructions(text);
	return instructions.flatMap(instruction => {
		const result = performInstruction(instruction, location);
		location = result[result.length - 1];
		return result;
	})
}

const intersecting = (points1, points2) => {
	const intersects = [];
	for (const point1 of points1) {
		for (const point2 of points2) {
			if(areSamePoints(point1, point2)){
				intersects.push(point1);
			}
		}
	}
	return intersects;
}

const areSamePoints = (point1, point2) => point1.toString() === point2.toString();
