import {
	DefaultError,
	UseQueryOptions,
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import apiPaths from 'api/apiPaths';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import { OppgaveQuery } from 'filter/filterTsTypes';
import { OppgaveKoIdOgTittel, OppgavekøV3, OppgavekøV3Enkel, OppgavekøerV3 } from 'types/OppgavekøV3Type';
import { axiosInstance } from 'utils/reactQueryConfig';

export const useHentSaksbehandlereAvdelingsleder = () =>
	useQuery<Saksbehandler[], unknown, Saksbehandler[]>({
		queryKey: [apiPaths.hentSaksbehandlereAvdelingsleder],
		staleTime: 1000, // for å unngå flere like kall innenfor samme lasting
	});

export const useLeggTilSaksbehandler = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { epost: string }) => axiosInstance.post(apiPaths.leggTilSaksbehandlerAvdelingsleder, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [apiPaths.hentSaksbehandlereAvdelingsleder],
			}),
	});
};

export const useSlettSaksbehandler = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { epost: string }) => axiosInstance.post(apiPaths.slettSaksbehandler, data),
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries({
					queryKey: [apiPaths.hentSaksbehandlereAvdelingsleder],
				}),
				queryClient.invalidateQueries({
					queryKey: [apiPaths.hentOppgaveko('')],
				}),
				queryClient.invalidateQueries({
					queryKey: [apiPaths.hentOppgavekoer],
				}),
			]),
	});
};

export const useHentAndreSaksbehandleresKøer = (id: number) =>
	useQuery<OppgaveKoIdOgTittel[], unknown, OppgaveKoIdOgTittel[]>({
		queryKey: [apiPaths.hentAndreSaksbehandleresKøerV3, id.toString()],
		queryFn: () =>
			axiosInstance.get(apiPaths.hentAndreSaksbehandleresKøerV3, { params: { id } }).then(({ data }) => data),
	});

export const useAlleKoer = (options = {}) =>
	useQuery<OppgavekøerV3, unknown, OppgavekøV3Enkel[]>({
		queryKey: [apiPaths.hentOppgavekoer],
		select: (v) => v.koer,
		...options,
	});

export const useNyKøMutation = (callback) => {
	const queryClient = useQueryClient();

	return useMutation<OppgavekøV3, unknown, { url: string; body: { tittel: string } }>({
		onSuccess: (data) =>
			queryClient
				.invalidateQueries({
					queryKey: [apiPaths.hentOppgavekoer],
				})
				.then(() => {
					if (callback) callback(data.id);
				}),
	});
};

interface KopierKøPayload {
	kopierFraOppgaveId: string;
	tittel: string;
	taMedQuery: boolean;
	taMedSaksbehandlere: boolean;
}

export const useAvdelingslederReservasjoner = (
	options?: Omit<UseQueryOptions<Reservasjon[], DefaultError, Reservasjon[]>, 'queryKey'>,
) =>
	useQuery<Reservasjon[], unknown, Reservasjon[]>({
		queryKey: [apiPaths.avdelinglederReservasjoner],
		...options,
	});

export const useKopierKøMutation = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: KopierKøPayload) => axiosInstance.post(`${apiPaths.kopierOppgaveko}`, data),
		onSuccess: () =>
			queryClient
				.invalidateQueries({
					queryKey: [apiPaths.hentOppgavekoer],
				})
				.then(() => {
					if (callback) callback();
				}),
	});
};

export const useSlettKøMutation = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => axiosInstance.delete(`${apiPaths.slettOppgaveko}${id}`),
		onSuccess: () =>
			queryClient
				.invalidateQueries({
					queryKey: [apiPaths.hentOppgavekoer],
				})
				.then(() => {
					if (callback) callback();
				}),
	});
};

export const useOppdaterKøMutation = (callback: () => void) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload: { ['key']: string }) =>
			axiosInstance.post(`${apiPaths.oppdaterOppgaveko}`, { ...payload }).then((res) => res.data),

		onSuccess: (props) => {
			const { id } = props;
			Promise.all([
				queryClient.invalidateQueries({
					queryKey: [apiPaths.hentOppgavekoer],
				}),
				queryClient.invalidateQueries({
					queryKey: [apiPaths.hentOppgaveko(id)],
				}),
				queryClient.invalidateQueries({
					queryKey: ['antallOppgaver', id],
				}),
			]).then(() => {
				if (callback) callback();
			});
		},
	});
};

export const useKo = (id: string, options?: Omit<UseQueryOptions<OppgavekøV3>, 'queryKey'>) =>
	useQuery<OppgavekøV3, unknown, OppgavekøV3>({
		...options,
		queryKey: [apiPaths.hentOppgaveko(id)],
	});

export const useHentAvdelingslederStatus = () =>
	useQuery<
		{
			behandlingstype: string;
			antall: number;
		}[]
	>({
		placeholderData: keepPreviousData,
		queryKey: [apiPaths.hentAvdelingslederStatus],
		refetchInterval: 60000,
	});

export const useHentAvdelingslederStatusFordeling = () =>
	useQuery<{
		oppdatertTidspunkt: string;
		tall: {
			tittel: { kode: string; navn: string };
			topplinje: { visningsnavn: string; verdi: number; kildespørring: OppgaveQuery };
			linjer: { visningsnavn: string; verdi: number; kildespørring: OppgaveQuery }[];
			bunnlinje: { visningsnavn: string; verdi: number; kildespørring: OppgaveQuery };
		}[];
	}>({
		placeholderData: keepPreviousData,
		queryKey: [apiPaths.hentAvdelingslederStatusFordeling],
		refetchInterval: 60000,
	});

type DagensTallLinje = { visningsnavn: string; verdi: number; kildespørring: OppgaveQuery };

export type DagensTallHovedtallOgLinjer = {
	hovedtall: DagensTallLinje;
	linjer: DagensTallLinje[];
};

export const useHentDagensTall = () =>
	useQuery<{
		oppdatertTidspunkt?: string;
		hovedgrupper: [{ kode: string; navn: string }];
		undergrupper: [{ kode: string; navn: string }];
		tall: [
			{
				hovedgruppe: string;
				undergruppe: string;
				idag: [DagensTallHovedtallOgLinjer, DagensTallHovedtallOgLinjer];
				siste7Dager: [DagensTallHovedtallOgLinjer, DagensTallHovedtallOgLinjer];
			},
		];
	}>({
		placeholderData: keepPreviousData,
		queryKey: [apiPaths.hentDagensTall],
		refetchInterval: 60000,
	});

export const useHentFerdigstiltePerEnhet = ({ gruppe, uker }: { gruppe: string; uker: string }) =>
	useQuery<{
		oppdatertTidspunkt?: string;
		grupper: { kode: string; navn: string }[];
		kolonner: string[];
		serier: [
			{
				navn: string;
				data: number[];
			},
		];
	}>({
		placeholderData: keepPreviousData,
		queryFn: () =>
			axiosInstance
				.get(apiPaths.hentFerdigstiltePerEnhet, { params: { gruppe, uker } })
				.then((response) => response.data),
		queryKey: [apiPaths.hentFerdigstiltePerEnhet, gruppe, uker],
		refetchInterval: 60000,
	});

export interface FilterBeskrivelse {
	feltnavn: string;
	verdier: Array<string>;
	nektelse: boolean;
}

export interface LagretSøk {
	id: number;
	tittel: string;
	beskrivelse: string;
	query: OppgaveQuery;
	queryBeskrivelse: FilterBeskrivelse[];
	lagetAv: number;
	versjon: number;
	sistEndret: string;
}

interface OpprettLagretSøkRequest {
	tittel: string;
}

interface EndreLagretSøkRequest {
	id: number;
	tittel: string;
	beskrivelse: string;
	query: OppgaveQuery;
	versjon: number;
}

export const useHentLagredeSøk = (
	options?: Omit<UseQueryOptions<LagretSøk[], DefaultError, LagretSøk[]>, 'queryKey'>,
) =>
	useQuery<LagretSøk[], DefaultError, LagretSøk[]>({
		queryKey: [apiPaths.hentLagredeSøk],
		...options,
	});

export const useOpprettLagretSøk = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: OpprettLagretSøkRequest) =>
			axiosInstance.post(apiPaths.opprettLagretSøk, data).then((res) => res.data),
		onSuccess: () =>
			queryClient
				.invalidateQueries({
					queryKey: [apiPaths.hentLagredeSøk],
				})
				.then(() => {
					if (callback) callback();
				}),
	});
};

export const useEndreLagretSøk = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: EndreLagretSøkRequest) =>
			axiosInstance.put(apiPaths.endreLagretSøk(data.id.toString()), data).then((res) => res.data),
		onSuccess: ({ id }) =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: [apiPaths.hentLagredeSøk] }),
				queryClient.invalidateQueries({ queryKey: [apiPaths.hentAntallLagretSøk(id.toString())] }),
			]).then(() => {
				if (callback) callback();
			}),
	});
};

export const useKopierLagretSøk = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { id: number; tittel: string }) =>
			axiosInstance.post(apiPaths.kopierLagretSøk(data.id.toString()), { tittel: data.tittel }),
		onSuccess: () =>
			queryClient
				.invalidateQueries({
					queryKey: [apiPaths.hentLagredeSøk],
				})
				.then(() => {
					if (callback) callback();
				}),
	});
};

export const useSlettLagretSøk = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => axiosInstance.delete(apiPaths.slettLagretSøk(id.toString())),
		onSuccess: () =>
			queryClient
				.invalidateQueries({
					queryKey: [apiPaths.hentLagredeSøk],
				})
				.then(() => {
					if (callback) callback();
				}),
	});
};

export const useHentAntallLagretSøk = (id: number) =>
	useQuery<number, DefaultError, number>({
		queryKey: [apiPaths.hentAntallLagretSøk(id.toString())],
		queryFn: () => axiosInstance.get(apiPaths.hentAntallLagretSøk(id.toString())).then((response) => response.data),
	});

export enum UttrekkStatus {
	OPPRETTET = 'OPPRETTET',
	KJØRER = 'KJØRER',
	FULLFØRT = 'FULLFØRT',
	FEILET = 'FEILET',
}

export enum TypeKjøring {
	ANTALL = 'ANTALL',
	OPPGAVER = 'OPPGAVER',
}

export interface Uttrekk {
	id: number;
	tittel: string;
	opprettetTidspunkt: string;
	status: UttrekkStatus;
	query: OppgaveQuery;
	queryBeskrivelse: string;
	typeKjøring: TypeKjøring;
	antall: number | null;
	feilmelding: string | null;
	startetTidspunkt: string | null;
	fullførtTidspunkt: string | null;
}

interface OpprettUttrekkRequest {
	lagretSokId: number;
	typeKjoring: TypeKjøring;
	limit?: number | null;
	offset?: number | null;
}

export const useHentAlleUttrekk = () =>
	useQuery<Uttrekk[], DefaultError, Uttrekk[]>({
		queryKey: [apiPaths.hentAlleUttrekk],
		queryFn: () => axiosInstance.get(apiPaths.hentAlleUttrekk).then((response) => response.data),
		refetchInterval: (query) => {
			// Refetch hvert 1. sekund hvis det finnes uttrekk med status OPPRETTET eller KJØRER
			const harAktiveUttrekk = query.state.data?.some(
				(uttrekk) => uttrekk.status === UttrekkStatus.OPPRETTET || uttrekk.status === UttrekkStatus.KJØRER,
			);
			return harAktiveUttrekk ? 1000 : false;
		},
	});

export const useOpprettUttrekk = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: OpprettUttrekkRequest) =>
			axiosInstance.post(apiPaths.opprettUttrekk, data).then((res) => res.data),
		onSuccess: () =>
			queryClient
				.invalidateQueries({
					queryKey: [apiPaths.hentAlleUttrekk],
				})
				.then(() => {
					if (callback) callback();
				}),
	});
};

export const useEndreUttrekkTittel = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, tittel }: { id: number; tittel: string }) =>
			axiosInstance.put(apiPaths.endreUttrekkTittel(id.toString()), { tittel }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [apiPaths.hentAlleUttrekk] });
			if (onSuccess) {
				onSuccess();
			}
		},
	});
};

export const useSlettUttrekk = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (uttrekk: Uttrekk) => axiosInstance.delete(apiPaths.slettUttrekk(uttrekk.id.toString())),
		onSuccess: () =>
			queryClient
				.invalidateQueries({
					queryKey: [apiPaths.hentAlleUttrekk],
				})
				.then(() => {
					if (callback) callback();
				}),
	});
};

export interface UttrekkResultatCelle {
	område: string | null;
	kode: string;
	verdi: unknown;
}

export interface UttrekkResultat {
	kolonner: string[];
	rader: { id: { eksternId: string }; felter: UttrekkResultatCelle[] }[];
	totaltAntall: number;
	offset: number;
	limit: number;
}

export const useHentUttrekkResultat = (id: number, offset: number, limit: number, enabled: boolean) =>
	useQuery<UttrekkResultat, DefaultError, UttrekkResultat>({
		queryKey: ['uttrekkResultat', id, offset, limit],
		queryFn: () =>
			axiosInstance.get(apiPaths.hentUttrekkJson(id.toString(), offset, limit)).then((response) => response.data),
		enabled,
		placeholderData: keepPreviousData,
	});
