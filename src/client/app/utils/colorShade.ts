/* eslint-disable no-param-reassign */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	// Remove any leading '#' and expand shorthand form if needed.
	hex = hex.replace(/^#/, '');
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map((ch) => ch + ch)
			.join('');
	}
	if (hex.length !== 6) return null;

	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
	return `#${[r, g, b]
		.map((x) => {
			const hex = x.toString(16);
			return hex.length === 1 ? `0${hex}` : hex;
		})
		.join('')}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h *= 60;
	}

	return { h, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
	s /= 100;
	l /= 100;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const hPrime = h / 60;
	const x = c * (1 - Math.abs((hPrime % 2) - 1));
	let r1 = 0,
		g1 = 0,
		b1 = 0;

	if (hPrime >= 0 && hPrime < 1) {
		r1 = c;
		g1 = x;
	} else if (hPrime >= 1 && hPrime < 2) {
		r1 = x;
		g1 = c;
	} else if (hPrime >= 2 && hPrime < 3) {
		g1 = c;
		b1 = x;
	} else if (hPrime >= 3 && hPrime < 4) {
		g1 = x;
		b1 = c;
	} else if (hPrime >= 4 && hPrime < 5) {
		r1 = x;
		b1 = c;
	} else if (hPrime >= 5 && hPrime < 6) {
		r1 = c;
		b1 = x;
	}

	const m = l - c / 2;
	return {
		r: Math.round((r1 + m) * 255),
		g: Math.round((g1 + m) * 255),
		b: Math.round((b1 + m) * 255),
	};
}

/**
 * Returns a darker “shade” of the given hex color.
 * @param hex - The base color in hex format (e.g. "#87CEEB").
 * @param offset - A number from 0 (no change) up to 5 (darker shade).
 * @returns The new color in hex format.
 */
export function colorShade(hex: string, offset: number): string {
	// Clamp offset between 0 and 5
	offset = Math.max(0, Math.min(5, offset));
	const rgb = hexToRgb(hex);
	if (!rgb) return hex; // if hex invalid, return original

	// Convert to HSL so we can adjust lightness.
	const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

	// Reduce lightness by 10 percentage points per offset step.
	// For example, skyblue (≈73% lightness) becomes ≈23% lightness at offset 5.
	const newLightness = Math.max(hsl.l - offset * 10, 0);
	const newRgb = hslToRgb(hsl.h, hsl.s, newLightness);
	return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}
