import dayjs from 'dayjs';
import { type Oppgavefelt, TolkesSom } from 'filter/filterTsTypes';
// Sideeffekt: registrerer dayjs-plugins (bl.a. duration) som formatCelleVerdi er avhengig av.
import 'utils/dateUtils';

export function harFormatering(feltdef: Oppgavefelt | undefined): boolean {
	if (!feltdef) return false;
	if (feltdef.verdiforklaringer && feltdef.verdiforklaringer.length > 0) return true;
	return [TolkesSom.Boolean, TolkesSom.Timestamp, TolkesSom.Duration].includes(feltdef.tolkes_som);
}

export function formatCelleVerdi(
	verdi: string | number | boolean | string[] | null | undefined,
	feltdef: Oppgavefelt | undefined,
	formater: boolean,
): string {
	if (verdi === null || verdi === undefined || verdi === '') {
		return '-';
	}

	if (Array.isArray(verdi)) {
		if (verdi.length === 0) {
			return '-';
		}
		return verdi.map((v) => formatCelleVerdi(v, feltdef, formater)).join(', ');
	}

	if (!formater || !feltdef) {
		return String(verdi);
	}

	if (feltdef.verdiforklaringer && feltdef.verdiforklaringer.length > 0) {
		const forklaring = feltdef.verdiforklaringer.find((v) => v.verdi === String(verdi));
		if (forklaring) {
			return forklaring.visningsnavn;
		}
	}

	if (feltdef.tolkes_som === TolkesSom.Boolean) {
		const boolVerdi = typeof verdi === 'boolean' ? verdi : String(verdi) === 'true';
		return boolVerdi ? 'Ja' : 'Nei';
	}

	if (feltdef.tolkes_som === TolkesSom.Timestamp) {
		const dato = dayjs(String(verdi));
		if (dato.isValid()) {
			return dato.format('D. MMM YYYY, [kl.] HH:mm');
		}
	}

	if (feltdef.tolkes_som === TolkesSom.Duration) {
		const strVerdi = String(verdi);
		const tall = Number(strVerdi);
		if (!Number.isNaN(tall)) {
			return `${Math.floor(tall)}`;
		}
		const dur = dayjs.duration(strVerdi);
		const dager = dur.asDays();
		if (!Number.isNaN(dager)) {
			return `${Math.floor(dager)}`;
		}
		return strVerdi;
	}

	return String(verdi);
}
