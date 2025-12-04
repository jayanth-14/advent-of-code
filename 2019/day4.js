const isSuccessive = (index, string) => string[index] === string[index + 1];

 const areSuccessiveDigits = (numberInText) => {
	const digits = numberInText.split('');
	return numberInText === digits.toSorted().join('');
}
 const hasSuccessive = (num) => {
	const successives = {};
		for (let index = 0; index < num.length; index++) {
      const digit = num[index];
  if (successives[digit] === undefined) {
		successives[digit] = 0;
	}	
	if(isSuccessive(index, num)) {
			successives[digit]++;
		}
	}
	const frequencies = Object.values(successives);
	if(frequencies.includes(1)) {
	return true;
}
return false;
}


const isEligible = (number) => {
	const num = number.toString();
	return hasSuccessive(num) && areSuccessiveDigits(num);
}

const firstEligible = (start, end, adder, predicate) => {
	for(let num = start; predicate(num, end); num += adder){
		if(isEligible(num)) {
			return num;
		}
	}
}

const allPasswords = (start, end) => {
	const first = firstEligible(start, end, 1, (x,y) => x < y);
	const last = firstEligible(end, start, -1, (x,y) => x > y);
	const eligible = [];
	for (let pass = first; pass < end; pass++) {
		if (isEligible(pass)) {
			eligible.push(pass);
		}
	}
	return eligible;
}
