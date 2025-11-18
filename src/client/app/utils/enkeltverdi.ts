import { isArray } from 'lodash';

export function enkeltverdi(verdi: string | string[]) {
	if (isArray(verdi)) {
		return verdi[0];
	}
	return verdi;
}
