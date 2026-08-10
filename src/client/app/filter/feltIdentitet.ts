import { type Oppgavefelt, OppgavefilterKode } from './filterTsTypes';

export type Feltreferanse = Pick<Oppgavefelt, 'område' | 'kode'>;

export const feltIdentitet = ({ område, kode }: Feltreferanse): string => JSON.stringify([område, kode]);

export const sammeFelt = (a: Feltreferanse, b: Feltreferanse): boolean => a.område === b.område && a.kode === b.kode;

export const finnFelt = (felter: Oppgavefelt[], referanse: Feltreferanse): Oppgavefelt | undefined =>
	felter.find((felt) => sammeFelt(felt, referanse));

export const feltreferanseFraIdentitet = (identitet: string): Feltreferanse | undefined => {
	try {
		const [område, kode] = JSON.parse(identitet) as unknown[];
		if ((typeof område === 'string' || område === null) && typeof kode === 'string') {
			return { område: område as string | null, kode };
		}
	} catch {
		// Verdier som ikke er feltidentiteter, for eksempel separatorer, håndteres av kallestedet.
	}
	return undefined;
};

export const FELTREFERANSER = {
	oppgavestatus: { område: null as string | null, kode: OppgavefilterKode.Oppgavestatus },
	personbeskyttelse: { område: null as string | null, kode: OppgavefilterKode.Personbeskyttelse },
	hastesak: { område: 'K9', kode: OppgavefilterKode.Hastesak },
} satisfies Record<string, Feltreferanse>;
