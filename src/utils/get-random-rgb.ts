function getRandomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 10)) + min;
}

export function getRandomRGB(): string {
	const min = 100;
	const max = 150;

	let r = getRandomNumber(min, max);
	let g = getRandomNumber(min, max);
	let b = getRandomNumber(min, max);

	const colorToZero = Math.floor(Math.random() * 3);
	switch (colorToZero) {
		case 0:
			r = 0;
			break;
		case 1:
			g = 0;
			break;
		case 2:
			b = 0;
			break;
	}

	return `${r}, ${g}, ${b}`;
}
