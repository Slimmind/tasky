import { TimeUnits } from './constants';

export const minutesToEstimation = (totalMinutes: number): string => {
	const units: TimeUnits = {
		w: Math.floor(totalMinutes / (5 * 8 * 60)),
		d: 0,
		h: 0,
		m: 0,
	};

	totalMinutes -= units.w * 5 * 8 * 60;
	units.d = Math.floor(totalMinutes / (8 * 60));
	totalMinutes -= units.d * 8 * 60;
	units.h = Math.floor(totalMinutes / 60);
	totalMinutes -= units.h * 60;
	units.m = totalMinutes;

	let result = '';
	for (const [key, value] of Object.entries(units)) {
		if (value > 0) {
			result += `${value}${key} `;
		}
	}

	return result.trim();
};
