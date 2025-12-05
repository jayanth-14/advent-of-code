const map = {
  'B' : 'COM',
  'C' : 'B',
  'D' : 'C',
  'E' : 'D',
  'F' : 'E',
  'G' : 'B',
  'H' : 'G',
  'I' : 'D',
  'J' : 'E',
  'K' : 'J',
  'L' : 'K'
}

const orbit = (object, map) => map[object];

const orbitsCount = (object, map) => {
  const orb = orbit(object, map);
	if (orb === undefined) return 0;
	return 1 + orbitsCount(orb, map);
}

const totalOrbits = (map) => {
	const orbits = Object.keys(map);
	let total = 0;
	for (const orb of orbits) {
		total += orbitsCount(orb, map);
	}
	return total;
}

const parseMap = (rawMap) => {
	const map = rawMap.split('\n').map(data => data.split(')'));
	return map.reduce((m, [k,v]) => { 
    m[v] = k; 
    return m
  }, {});
}

const orbitCheckSums = (rawMap) => totalOrbits(parseMap(rawMap));
