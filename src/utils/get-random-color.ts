export const getRandomColor = (): string => {
	const transparencyLevel = '0.5';
	const min = 50;
	const max = 200;
	const generateRandomNumber = () =>
		Math.floor(Math.random() * (max - min) + min);
	return `rgba(${generateRandomNumber()}, ${generateRandomNumber()}, ${generateRandomNumber()}, ${transparencyLevel})`;
};
