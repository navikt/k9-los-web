import { UseQueryOptions, useMutation, useQuery, useQueryClient } from 'react-query';
import apiPaths from 'api/apiPaths';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import { OppgavekøV3, OppgavekøV3Enkel, OppgavekøerV3 } from 'types/OppgavekøV3Type';
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
		onSuccess: () => queryClient.invalidateQueries(apiPaths.hentSaksbehandlereAvdelingsleder),
	});
};

export const useSlettSaksbehandler = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { epost: string }) => axiosInstance.post(apiPaths.slettSaksbehandler, data),
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries(apiPaths.hentSaksbehandlereAvdelingsleder),
				// invaliderer alle oppgavekøer, siden dette endepunktet inneholder alle saksbehandlere som er på hver kø
				queryClient.invalidateQueries(apiPaths.hentOppgaveko('')),
				// viser antallet saksbehandlere på kø, denne kan ha endret seg
				queryClient.invalidateQueries(apiPaths.hentOppgavekoer),
			]),
	});
};

// eslint-disable-next-line import/prefer-default-export
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
			queryClient.invalidateQueries(apiPaths.hentOppgavekoer).then(() => {
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

export const useAvdelingslederReservasjoner = (options: UseQueryOptions<Reservasjon[], unknown, Reservasjon[]> = {}) =>
	useQuery<Reservasjon[], unknown, Reservasjon[]>({
		queryKey: [apiPaths.avdelinglederReservasjoner],
		...options,
	});

export const useKopierKøMutation = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: KopierKøPayload) => axiosInstance.post(`${apiPaths.kopierOppgaveko}`, data),
		onSuccess: () =>
			queryClient.invalidateQueries(apiPaths.hentOppgavekoer).then(() => {
				if (callback) callback();
			}),
	});
};

export const useSlettKøMutation = (callback?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => axiosInstance.delete(`${apiPaths.slettOppgaveko}${id}`),
		onSuccess: () =>
			queryClient.invalidateQueries(apiPaths.hentOppgavekoer).then(() => {
				if (callback) callback();
			}),
	});
};

export const useOppdaterKøMutation = (callback: () => void) => {
	const queryClient = useQueryClient();
	return useMutation<OppgavekøV3, unknown, OppgavekøV3>(
		(payload) => axiosInstance.post(`${apiPaths.oppdaterOppgaveko}`, { ...payload }).then((res) => res.data),
		{
			onSuccess: (props) => {
				const { id } = props;
				Promise.all([
					queryClient.invalidateQueries(apiPaths.hentOppgavekoer),
					queryClient.invalidateQueries(apiPaths.hentOppgaveko(id)),
					queryClient.invalidateQueries(apiPaths.antallOppgaverIKoV3(id)),
				]).then(() => {
					if (callback) callback();
				});
			},
		},
	);
};

export const useKo = (id: string, options: UseQueryOptions<OppgavekøV3>) =>
	useQuery<OppgavekøV3, unknown, OppgavekøV3>({
		...options,
		queryKey: [apiPaths.hentOppgaveko(id)],
	});
