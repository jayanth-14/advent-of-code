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

const allOrbits = (object, map) => {
  const orbits = [];
  let orb = orbit(object, map);
  while ( orb !== undefined) {
    orbits.push(orb);
    orb = orbit(orb, map);
  }
  return orbits.slice(0, -2);
}

const stepsBetween = (location, destination, rawMap) => {
  const map = parseMap(rawMap);
  const locToCenter = allOrbits(location, map);
  const desToCenter = allOrbits(destination, map);
  const intersecting = locToCenter.find(x => desToCenter.includes(x));
  return locToCenter.indexOf(intersecting) + desToCenter.indexOf(intersecting);
}
