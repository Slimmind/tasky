export const getColor = (rgb: string, transparency?: number): string =>
	transparency ? `rgba(${rgb}, ${transparency})` : `rgb(${rgb})`;
