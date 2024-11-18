type TimeUnit = 'w' | 'd' | 'h' | 'm';

export const estimationToMinutes = (str: string): number => {
	const timeUnits: Record<TimeUnit, number> = {
		w: 5 * 8 * 60,
		d: 8 * 60,
		h: 60,
		m: 1,
	};

	return str
		.split(' ')
		.map((unit) => unit.match(/[a-zA-Z]+|[0-9]+/g))
		.reduce((acc, val) => {
			if (val && val[0] && val[1]) {
				const quantity = +val[0];
				const unit = val[1] as TimeUnit;

				if (timeUnits[unit]) {
					return acc + quantity * timeUnits[unit];
				}
			}
			return acc;
		}, 0);
};
