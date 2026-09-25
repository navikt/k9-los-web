import {
	type DefaultError,
	keepPreviousData,
	type UseQueryOptions,
	useMutation,
	useQueries,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import {
	endreLagretSok,
	endreOppgavekoSomAvdelingsleder,
	endreTittelPåUttrekk,
	getHentAlleAktiveReservasjonerQueryKey,
	getHentAlleOppgavekoerForAvdelingslederQueryKey,
	getHentAntallForLagretSokQueryKey,
	getHentAntallOppgaverIAvdelingslederkoQueryKey,
	getHentLagredeSokQueryKey,
	getHentOppgavekoerForSaksbehandlerSomAvdelingslederQueryKey,
	getHentOppgavekoSomAvdelingslederQueryKey,
	getHentSaksbehandlereForAdministrasjonQueryKey,
	getHentStandardOppgaveQueryQueryKey,
	getHentUttrekkQueryKey,
	getHentUttrekksresultatSomJsonQueryKey,
	getLastNedUttrekkSomCsvQueryKey,
	hentAlleAktiveReservasjoner,
	hentAlleOppgavekoerForAvdelingsleder,
	hentAntallForLagretSok,
	hentAntallOppgaverIAvdelingslederko,
	hentLagredeSok,
	hentOppgavekoerForSaksbehandlerSomAvdelingsleder,
	hentOppgavekoSomAvdelingsleder,
	hentSaksbehandlereForAdministrasjon,
	hentStandardOppgaveQuery,
	hentUttrekk,
	hentUttrekksresultatSomJson,
	kopierLagretSok,
	kopierOppgavekoSomAvdelingsleder,
	leggTilSaksbehandler,
	opprettLagretSok,
	opprettOppgavekoSomAvdelingsleder,
	opprettUttrekk,
	slettLagretSok,
	slettOppgavekoSomAvdelingsleder,
	slettSaksbehandlerMedEpost,
	slettUttrekk,
	slettUttrekkForLagretSøk,
} from 'api/generated/los';
import type { OppgaveKoIdOgTittel } from 'api/generated/los.schemas';
import { tilProxySti } from 'api/orvalMutator';
import type { OppgaveQuery, SelectFelt } from 'filter/filterTsTypes';
import type { Saksbehandler } from 'fleromrade/avdelingsleder/saksbehandlere/saksbehandlerTsType';
import { useOmråde } from 'fleromrade/OmrådeContext';
import type { OppgavekøV3, OppgavekøV3Enkel } from 'types/OppgavekøV3Type';
import { fraKlientQuery, tilKlientQuery } from './oppgaveQuery';

/**
 * Hooks for avdelingsleder på den genererte klienten, med samme signaturer som legacy-hookene i
 * `api/queries/avdelingslederQueries`. Komponentene er kopiert fra K9 og trenger dermed nesten ingen endringer.
 *
 * Flere svar fra backend avviker fra OpenAPI-spec-en (se `oppgaveQuery.ts`). Typene under beskriver det
 * backend faktisk sender.
 */

// Saksbehandlere

export const useHentSaksbehandlereAvdelingsleder = () => {
	const { urlSegment } = useOmråde();
	return useQuery<Saksbehandler[]>({
		queryKey: getHentSaksbehandlereForAdministrasjonQueryKey(urlSegment),
		queryFn: ({ signal }) =>
			hentSaksbehandlereForAdministrasjon(urlSegment, undefined, signal) as Promise<Saksbehandler[]>,
	});
};

export const useLeggTilSaksbehandler = () => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { epost: string }) => leggTilSaksbehandler(urlSegment, data),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: getHentSaksbehandlereForAdministrasjonQueryKey(urlSegment) }),
	});
};

export const useSlettSaksbehandler = () => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { epost: string }) => slettSaksbehandlerMedEpost(urlSegment, data),
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: getHentSaksbehandlereForAdministrasjonQueryKey(urlSegment) }),
				queryClient.invalidateQueries({ queryKey: getHentAlleOppgavekoerForAvdelingslederQueryKey(urlSegment) }),
			]),
	});
};

export const useHentAndreSaksbehandleresKøer = (saksbehandlerId: number) => {
	const { urlSegment } = useOmråde();
	return useQuery<OppgaveKoIdOgTittel[]>({
		queryKey: getHentOppgavekoerForSaksbehandlerSomAvdelingslederQueryKey(urlSegment, { saksbehandlerId }),
		queryFn: ({ signal }) =>
			hentOppgavekoerForSaksbehandlerSomAvdelingsleder(urlSegment, { saksbehandlerId }, undefined, signal),
	});
};

// Oppgavekøer. Id-er er strenger i komponentene, som i legacy.

const tilKø = (kø: Awaited<ReturnType<typeof hentOppgavekoSomAvdelingsleder>>): OppgavekøV3 => ({
	...kø,
	id: String(kø.id),
	oppgaveQuery: fraKlientQuery(kø.oppgaveQuery),
	endretTidspunkt: kø.endretTidspunkt ?? undefined,
});

export const useAlleKoer = () => {
	const { urlSegment } = useOmråde();
	return useQuery<OppgavekøV3Enkel[]>({
		queryKey: getHentAlleOppgavekoerForAvdelingslederQueryKey(urlSegment),
		queryFn: async ({ signal }) => {
			// Spec-en sier `visningsnavn`, men backend sender `tittel` og `sistEndret`.
			const køer = (await hentAlleOppgavekoerForAvdelingsleder(urlSegment, undefined, signal)) as unknown as Array<
				Omit<OppgavekøV3Enkel, 'id'> & { id: number }
			>;
			return køer.map((kø) => ({ ...kø, id: String(kø.id) }));
		},
	});
};

export const useKo = (id: string, options?: { enabled?: boolean }) => {
	const { urlSegment } = useOmråde();
	return useQuery<OppgavekøV3>({
		queryKey: getHentOppgavekoSomAvdelingslederQueryKey(urlSegment, Number(id)),
		queryFn: async ({ signal }) =>
			tilKø(await hentOppgavekoSomAvdelingsleder(urlSegment, Number(id), undefined, signal)),
		...options,
	});
};

/** Antall oppgaver med og uten reserverte for hver kø, hentet hver for seg. */
export const useAntallOppgaverIKøer = (køIder: string[]) => {
	const { urlSegment } = useOmråde();
	return useQueries({
		queries: køIder.map((id) => ({
			queryKey: getHentAntallOppgaverIAvdelingslederkoQueryKey(urlSegment, Number(id)),
			queryFn: ({ signal }: { signal: AbortSignal }) =>
				hentAntallOppgaverIAvdelingslederko(urlSegment, Number(id), undefined, signal),
		})),
	});
};

export const useNyKøMutation = (callback: (id: string) => void) => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { tittel: string }) => opprettOppgavekoSomAvdelingsleder(urlSegment, data),
		onSuccess: async (kø) => {
			await queryClient.invalidateQueries({ queryKey: getHentAlleOppgavekoerForAvdelingslederQueryKey(urlSegment) });
			callback(String(kø.id));
		},
	});
};

export const useKopierKøMutation = (callback?: () => void) => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: {
			kopierFraOppgaveId: string;
			tittel: string;
			taMedQuery: boolean;
			taMedSaksbehandlere: boolean;
		}) =>
			kopierOppgavekoSomAvdelingsleder(urlSegment, { ...data, kopierFraOppgaveId: Number(data.kopierFraOppgaveId) }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getHentAlleOppgavekoerForAvdelingslederQueryKey(urlSegment) });
			callback?.();
		},
	});
};

export const useSlettKøMutation = (callback?: () => void) => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => slettOppgavekoSomAvdelingsleder(urlSegment, Number(id)),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: getHentAlleOppgavekoerForAvdelingslederQueryKey(urlSegment) });
			callback?.();
		},
	});
};

export const useOppdaterKøMutation = (callback: () => void) => {
	const { urlSegment, område } = useOmråde();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (kø: OppgavekøV3) =>
			endreOppgavekoSomAvdelingsleder(urlSegment, {
				...kø,
				id: Number(kø.id),
				område,
				oppgaveQuery: tilKlientQuery(kø.oppgaveQuery),
			}),
		onSuccess: async (kø) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: getHentAlleOppgavekoerForAvdelingslederQueryKey(urlSegment) }),
				queryClient.invalidateQueries({ queryKey: getHentOppgavekoSomAvdelingslederQueryKey(urlSegment, kø.id) }),
				queryClient.invalidateQueries({ queryKey: getHentAntallOppgaverIAvdelingslederkoQueryKey(urlSegment, kø.id) }),
			]);
			callback();
		},
	});
};

// Reservasjoner

export const useAvdelingslederReservasjoner = () => {
	const { urlSegment } = useOmråde();
	return useQuery({
		queryKey: getHentAlleAktiveReservasjonerQueryKey(urlSegment),
		queryFn: ({ signal }) => hentAlleAktiveReservasjoner(urlSegment, undefined, signal),
	});
};

// Lagrede søk

export interface LagretSøk {
	id: number;
	tittel: string;
	beskrivelse: string;
	query: OppgaveQuery;
	lagetAv: number;
	versjon: number;
	sistEndret: string;
}

interface EndreLagretSøkRequest {
	id: number;
	tittel: string;
	beskrivelse: string;
	query: OppgaveQuery;
	versjon: number;
}

export const useHentLagredeSøk = (options?: Omit<UseQueryOptions<LagretSøk[], DefaultError>, 'queryKey'>) => {
	const { urlSegment } = useOmråde();
	return useQuery<LagretSøk[]>({
		queryKey: getHentLagredeSokQueryKey(urlSegment),
		queryFn: async ({ signal }) =>
			(await hentLagredeSok(urlSegment, undefined, signal)).map((søk) => ({
				...søk,
				id: søk.id as number,
				query: fraKlientQuery(søk.query),
			})),
		...options,
	});
};

export const useHentLagredeSøkDefaultQuery = () => {
	const { urlSegment } = useOmråde();
	return useQuery<OppgaveQuery>({
		queryKey: getHentStandardOppgaveQueryQueryKey(urlSegment),
		queryFn: async ({ signal }) => fraKlientQuery(await hentStandardOppgaveQuery(urlSegment, undefined, signal)),
	});
};

/** Antall oppgaver som treffer hvert lagret søk, hentet hver for seg. */
export const useAntallForLagredeSøk = (
	lagredeSøk: LagretSøk[],
	skalHente: (søk: LagretSøk, indeks: number) => boolean,
) => {
	const { urlSegment } = useOmråde();
	return useQueries({
		queries: lagredeSøk.map((søk, indeks) => ({
			queryKey: getHentAntallForLagretSokQueryKey(urlSegment, søk.id),
			enabled: skalHente(søk, indeks),
			queryFn: ({ signal }: { signal: AbortSignal }) => hentAntallForLagretSok(urlSegment, søk.id, undefined, signal),
		})),
	});
};

const useInvaliderLagredeSøk = () => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	return () => queryClient.invalidateQueries({ queryKey: getHentLagredeSokQueryKey(urlSegment) });
};

/** Den nye API-en har ikke eget opprett-endepunkt, så vi oppretter med standardkriteriene for området. */
export const useOpprettLagretSøk = (callback?: () => void) => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	const invalider = useInvaliderLagredeSøk();
	return useMutation({
		mutationFn: async (data: { tittel: string }) => {
			const query = await queryClient.fetchQuery({
				queryKey: getHentStandardOppgaveQueryQueryKey(urlSegment),
				queryFn: () => hentStandardOppgaveQuery(urlSegment),
			});
			return opprettLagretSok(urlSegment, { tittel: data.tittel, query });
		},
		onSuccess: async () => {
			await invalider();
			callback?.();
		},
	});
};

export const useNyttLagretSøk = (callback?: (id: number) => void) => {
	const { urlSegment } = useOmråde();
	const invalider = useInvaliderLagredeSøk();
	return useMutation({
		mutationFn: (data: { tittel: string; query: OppgaveQuery }) =>
			opprettLagretSok(urlSegment, { tittel: data.tittel, query: tilKlientQuery(data.query) }),
		onSuccess: async (id) => {
			await invalider();
			callback?.(id);
		},
	});
};

export const useEndreLagretSøk = (callback?: () => void) => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	const invalider = useInvaliderLagredeSøk();
	return useMutation({
		mutationFn: (data: EndreLagretSøkRequest) =>
			endreLagretSok(urlSegment, data.id, { ...data, query: tilKlientQuery(data.query) }),
		onSuccess: async (_svar, { id }) => {
			await Promise.all([
				invalider(),
				queryClient.invalidateQueries({ queryKey: getHentAntallForLagretSokQueryKey(urlSegment, id) }),
			]);
			callback?.();
		},
	});
};

export const useKopierLagretSøk = (callback?: (id: number) => void) => {
	const { urlSegment } = useOmråde();
	const invalider = useInvaliderLagredeSøk();
	return useMutation({
		mutationFn: (data: { id: number; tittel: string }) => kopierLagretSok(urlSegment, data.id, { tittel: data.tittel }),
		onSuccess: async (id) => {
			await invalider();
			callback?.(id);
		},
	});
};

export const useSlettLagretSøk = (callback?: () => void) => {
	const { urlSegment } = useOmråde();
	const invalider = useInvaliderLagredeSøk();
	return useMutation({
		mutationFn: (id: number) => slettLagretSok(urlSegment, id),
		onSuccess: async () => {
			await invalider();
			callback?.();
		},
	});
};

// Uttrekk

export enum UttrekkStatus {
	OPPRETTET = 'OPPRETTET',
	KJØRER = 'KJØRER',
	FULLFØRT = 'FULLFØRT',
	FEILET = 'FEILET',
}

export interface Uttrekk {
	id: number;
	tittel: string;
	opprettetTidspunkt: string;
	status: UttrekkStatus;
	query: OppgaveQuery;
	lagretSøkId: number;
	antall: number | null;
	feilmelding: string | null;
	startetTidspunkt: string | null;
	fullførtTidspunkt: string | null;
}

export type CelleVerdi = string | number | boolean | null;

export interface UttrekkResultat {
	kolonner: SelectFelt[];
	rader: { id: string; kolonner: CelleVerdi[] }[];
	totaltAntall: number;
	offset: number;
	limit: number | null;
}

const useInvaliderUttrekk = () => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	return () => queryClient.invalidateQueries({ queryKey: getHentUttrekkQueryKey(urlSegment) });
};

export const useHentAlleUttrekk = () => {
	const { urlSegment } = useOmråde();
	return useQuery<Uttrekk[]>({
		queryKey: getHentUttrekkQueryKey(urlSegment),
		queryFn: async ({ signal }) =>
			(await hentUttrekk(urlSegment, undefined, signal)).map(
				(uttrekk) => ({ ...uttrekk, query: fraKlientQuery(uttrekk.query) }) as Uttrekk,
			),
		// Henter på nytt hvert sekund så lenge et uttrekk venter eller kjører.
		refetchInterval: (query) =>
			query.state.data?.some(
				(uttrekk) => uttrekk.status === UttrekkStatus.OPPRETTET || uttrekk.status === UttrekkStatus.KJØRER,
			)
				? 1000
				: false,
	});
};

export const useOpprettUttrekk = (callback?: () => void) => {
	const { urlSegment } = useOmråde();
	const invalider = useInvaliderUttrekk();
	return useMutation({
		mutationFn: (data: { lagretSokId: number; tittel: string; limit?: number | null; offset?: number | null }) =>
			opprettUttrekk(urlSegment, data),
		onSuccess: async () => {
			await invalider();
			callback?.();
		},
	});
};

export const useEndreUttrekkTittel = (onSuccess?: () => void) => {
	const { urlSegment } = useOmråde();
	const invalider = useInvaliderUttrekk();
	return useMutation({
		mutationFn: ({ id, tittel }: { id: number; tittel: string }) => endreTittelPåUttrekk(urlSegment, id, { tittel }),
		onSuccess: () => {
			invalider();
			onSuccess?.();
		},
	});
};

export const useSlettUttrekk = (callback?: () => void) => {
	const { urlSegment } = useOmråde();
	const invalider = useInvaliderUttrekk();
	return useMutation({
		mutationFn: (uttrekk: Uttrekk) => slettUttrekk(urlSegment, uttrekk.id),
		onSuccess: async () => {
			await invalider();
			callback?.();
		},
	});
};

export const useSlettUttrekkForLagretSøk = (callback?: () => void) => {
	const { urlSegment } = useOmråde();
	const invalider = useInvaliderUttrekk();
	return useMutation({
		mutationFn: (lagretSokId: number) => slettUttrekkForLagretSøk(urlSegment, lagretSokId),
		onSuccess: async () => {
			await invalider();
			callback?.();
		},
	});
};

export const useHentUttrekkResultat = (id: number, offset: number, limit: number, enabled: boolean) => {
	const { urlSegment } = useOmråde();
	return useQuery<UttrekkResultat>({
		queryKey: getHentUttrekksresultatSomJsonQueryKey(urlSegment, id, { offset, limit }),
		queryFn: ({ signal }) =>
			hentUttrekksresultatSomJson(
				urlSegment,
				id,
				{ offset, limit },
				undefined,
				signal,
			) as unknown as Promise<UttrekkResultat>,
		enabled,
		placeholderData: keepPreviousData,
	});
};

/** Lenke for å laste ned et uttrekk som CSV, via proxyen. */
export const useLastNedUttrekkCsvLenke = () => {
	const { urlSegment } = useOmråde();
	return (id: number) => tilProxySti(getLastNedUttrekkSomCsvQueryKey(urlSegment, id)[0]);
};
