import { distinct } from "jsr:@std/collections";

const isDivisible = (dividend, divisor) => dividend % divisor === 0;
const gcd = (num1, num2) => {
  if (num1 === 0) return num2;
  if (num2 === 0) return num1;
  const start = num1 > num2 ? num2 : num1;
  for (let index = start; index > 0; index--) {
    if (isDivisible(num1, index) && isDivisible(num2, index)) return index;
  }

  return 1;
};

const getVisibleCount = (asteroids, currentIndex) => {
  const currentAsteroid = asteroids[currentIndex];
  const gcds = [];

  for (let index in asteroids) {
    if (index === currentIndex) continue;

    const newAsteroid = asteroids[index];

    const dx = newAsteroid.x - currentAsteroid.x;
    const dy = newAsteroid.y - currentAsteroid.y;
    const g = gcd(Math.abs(dx), Math.abs(dy));
    gcds.push([dx / g, dy / g] + "");
  }
  return distinct(gcds).length;
};

const generateAsteroids = (map) => {
  const rows = map.split("\n");
  const asteroids = [];
  for (const y in rows) {
    for (const x in rows[y]) {
      if (rows[y][x] === "#") {
        asteroids.push({ x, y });
      }
    }
  }
  return asteroids;
};

const findBestSpot = (asteroids) => {
  let maximumCount = -Infinity;
  let bestSpot = 0;
  for (const index in asteroids) {
    const count = getVisibleCount(asteroids, index);
    if (count > maximumCount) {
      maximumCount = count;
      bestSpot = index;
    }
  }
  return bestSpot;
};

const findD = (main, other) => ({ dx: other.x - main.x, dy: other.y - main.y });

const findAngle = (dx, dy) => Math.atan2(dx, -dy);

const findDistance = (dx, dy) => Math.abs(dx) + Math.abs(dy);

const computeAsteroids = function* (bestSpot, other) {
  for (const asteroid of other) {
    const { dx, dy } = findD(bestSpot, asteroid);
    let angle = findAngle(dx, dy);
    if (angle < 0) angle += 2 * Math.PI;
    const distance = findDistance(dx, dy);
    yield { ...asteroid, angle, distance };
  }
};

const organiseAsteroids = (bestSpot, otherAsteroids) => {
  const organisedAsteroids = {};
  const computed = computeAsteroids(bestSpot, otherAsteroids);
  computed.forEach((asteroid) => {
    if (!(asteroid.angle in organisedAsteroids)) {
      organisedAsteroids[asteroid.angle] = [];
    }

    organisedAsteroids[asteroid.angle].push(asteroid);
  });
  const angles = Object.keys(organisedAsteroids).map((x) => parseFloat(x)).sort(
    (a, b) => a - b,
  );
  const newAsteroids = angles.map((angle) =>
    organisedAsteroids[angle].sort((a, b) => a.distance - b.distance)
  );
  return newAsteroids;
};

const vaporiseAsteroids = (map) => {
  const asteroids = generateAsteroids(map);
  const bestSpotIndex = parseInt(findBestSpot(asteroids));
  const otherAsteroids = [
    ...asteroids.slice(0, bestSpotIndex),
    ...asteroids.slice(bestSpotIndex + 1),
  ];
  const bestSpot = asteroids[bestSpotIndex];
  const organised = organiseAsteroids(bestSpot, otherAsteroids);
  const vaporised = [];
  for (let index = 0; index < asteroids.length; index++) {
    const directionIndex = index % organised.length;
    vaporised.push(organised[directionIndex].pop());
  }
  return vaporised[199];
};
