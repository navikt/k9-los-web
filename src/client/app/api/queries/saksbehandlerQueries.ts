import { UseQueryOptions, useMutation, useQuery, useQueryClient } from 'react-query';
import OppgaveV3 from 'types/OppgaveV3';
import { OppgavekøV3Enkel, OppgavekøerV3 } from 'types/OppgavekøV3Type';
import apiPaths from 'api/apiPaths';
import ReservasjonV3, { ReservasjonV3FraKøDto } from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { axiosInstance } from 'utils/reactQueryConfig';
import { SaksbehandlerEnkel } from 'avdelingsleder/bemanning/saksbehandlerTsType';

export const useGetAlleSaksbehandlere = (options: UseQueryOptions<SaksbehandlerEnkel[], Error> = {}) =>
	useQuery<SaksbehandlerEnkel[], Error>(apiPaths.hentSaksbehandlereSomSaksbehandler, options);

export const useAntallOppgaverIKoV3 = (koId: string, options: UseQueryOptions<string, Error> = {}) =>
	useQuery<string, Error>({
		queryKey: [apiPaths.antallOppgaverIKoV3(koId)],
		...options,
	});

export const useAlleSaksbehandlerKoerV1 = (options: UseQueryOptions<OppgavekøV1[], Error> = {}) =>
	useQuery<OppgavekøV1[], Error>({
		queryKey: [apiPaths.hentAlleKoerSaksbehandlerV1],
		...options,
	});

export const useAlleSaksbehandlerKoerV3 = (options: UseQueryOptions<OppgavekøV3Enkel[], Error> = {}) =>
	useQuery<OppgavekøV3Enkel[], Error>({
        queryKey: [apiPaths.hentAlleKoerSaksbehandlerV3],
        ...options,
	});

export const useSaksbehandlerNesteTiV3 = (id: string, options: UseQueryOptions<OppgaveV3[], Error> = {}) =>
	useQuery<OppgaveV3[], Error, OppgaveV3[]>({
		queryKey: [apiPaths.hentTiNesteIKoV3(id)],
		...options,
	});

export const useSaksbehandlerNesteTiV1 = (id: string, options: UseQueryOptions<Oppgave[], Error> = {}) =>
	useQuery<Oppgave[], Error, Oppgave[]>({
		queryKey: [apiPaths.saksbehandlerNesteOppgaver(id)],
		...options,
	});

export const useSaksbehandlerReservasjoner = (options: UseQueryOptions<ReservasjonV3[], Error> = {}) =>
	useQuery<ReservasjonV3[], Error, ReservasjonV3[]>({
		queryKey: [apiPaths.saksbehandlerReservasjoner],
		...options,
	});

export const usePlukkOppgaveMutation = (callback?: (oppgave: ReservasjonV3FraKøDto) => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { oppgaveKøId: string }): Promise<ReservasjonV3FraKøDto> =>
			axiosInstance.post(`${apiPaths.hentOppgaveFraKoV3(data.oppgaveKøId)}`, data).then((response) => response.data),
		onSuccess: (data: ReservasjonV3FraKøDto) => {
			queryClient.invalidateQueries(apiPaths.saksbehandlerReservasjoner).then(() => {
				if (callback) callback(data);
			});
		},
	});
};
