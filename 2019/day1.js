const divideBy3 = number => number / 3;

const subtract2 = number => number - 2;

export const fuelRequired = mass => {
  const fuel = subtract2(Math.floor(divideBy3(mass)));
  return fuel > 0 ? fuel + fuelRequired(fuel) : 0;
}

const fuelRequirements = starMasses => starMasses.reduce((sum, mass) => sum + fuelRequired(mass), 0);

const totalFuel = masses => {
  const parsedMasses = masses.split("\n").filter(x => x !== "").map(x => parseInt(x));
  return fuelRequirements(parsedMasses);
}
