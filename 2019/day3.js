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

const areSamePoints = (point1, point2) => point1[0] === point2[0] && point1[1] === point2[1];

const getDistance = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const mapDistances = (points, fromPoint = [0,0]) => {
	const map = {};
	for (const point of points) {
		const distance = getDistance(point, fromPoint);
		map[distance] = point;
	}
	return map;
}

const shortestPoint = (distanceMap) => {
  const distances = Object.keys(distanceMap).map(distance => parseInt(distance));
  const shortest = Math.min(...distances);
  return distanceMap[shortest];
}

const findSteps = (point, allPoints) => allPoints.findIndex(cp => cp[0] === point[0] && cp[1] === point[1]) + 1;

const findAllSteps = (intersects, firstWire, secondWire) => {
	const steps = [];
	for (const inter of intersects) {
		const firstWireSteps = findSteps(inter, firstWire);
		const secondWireSteps = findSteps(inter, secondWire);
		const totalSteps = add(firstWireSteps, secondWireSteps);
    steps.push(totalSteps);
	}
	return steps;
}

const shortestSteps = (intersects, firstWire, secondWire) => {
	const allSteps = findAllSteps(intersects, firstWire, secondWire);
	return Math.min(...allSteps);
}
