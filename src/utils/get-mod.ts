/**
 * Function to generate BEM-like class names for element modifications.
 * @param {string} baseClass base class of element
 * @param {string} mod element modifications
 * @returns {string} string with BEM-like class names: 'base base--mod1 base--mod2...'
 */

export default function getMod(baseClass: string, mod: string): string {
	return mod
		.split(' ')
		.map((item) => `${baseClass}--${item}`)
		.join(' ');
}
