import { type Oppgavefelt, OppgavefilterKode } from './filterTsTypes';

/**
 * Referanse til et felt som faktisk er valgt (kode er aldri null).
 * Bruk denne i stedet for Pick<Oppgavefelt, 'område' | 'kode'> der feltet kan være uutfylt.
 */
export type Feltreferanse = { område: string | null; kode: string };

/**
 * Reserverte verdier som brukes i nedtrekkslister og aldri skal tolkes som feltidentiteter.
 * Definert her slik at feltreferanseFraIdentitet kan avvise dem eksplisitt,
 * uavhengig av hvordan identitetsformatet ser ut.
 */
export const FELT_SENTINELLER = {
	separator: '__separator__',
	gruppe: '__gruppe__',
	antall: '__antall__',
} as const;

export const feltIdentitet = ({ område, kode }: Feltreferanse): string => `${område ?? ''}__${kode}`;

export const sammeFelt = (a: Feltreferanse, b: Feltreferanse): boolean => a.område === b.område && a.kode === b.kode;

export const finnFelt = (felter: Oppgavefelt[], referanse: Feltreferanse): Oppgavefelt | undefined =>
	felter.find((felt) => sammeFelt(felt, referanse));

export const feltreferanseFraIdentitet = (identitet: string): Feltreferanse | undefined => {
	// Avvis reserverte verdier eksplisitt, slik at de aldri kan tolkes som felt
	if (Object.values(FELT_SENTINELLER).includes(identitet as (typeof FELT_SENTINELLER)[keyof typeof FELT_SENTINELLER])) {
		return undefined;
	}

	const separatorIndex = identitet.indexOf('__');
	if (separatorIndex === -1) return undefined;

	const område = identitet.slice(0, separatorIndex);
	const kode = identitet.slice(separatorIndex + 2);
	if (!kode) return undefined;

	return { område: område === '' ? null : område, kode };
};

export const FELTREFERANSER: Record<string, Feltreferanse> = {
	oppgavestatus: { område: null, kode: OppgavefilterKode.Oppgavestatus },
	personbeskyttelse: { område: null, kode: OppgavefilterKode.Personbeskyttelse },
	hastesak: { område: 'K9', kode: OppgavefilterKode.Hastesak },
};
