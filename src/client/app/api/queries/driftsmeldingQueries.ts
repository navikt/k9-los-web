import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiPaths from 'api/apiPaths';
import { axiosInstance } from 'utils/reactQueryConfig';
import { Driftsmelding } from '../../admin/driftsmeldinger/driftsmeldingTsType';

export const useHentDriftsmeldinger = () =>
	useQuery<Driftsmelding[], unknown, Driftsmelding[]>({
		queryKey: [apiPaths.driftsmeldinger],
	});

export const useLagreDriftsmelding = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { driftsmelding: string }) => axiosInstance.post(apiPaths.lagreDriftsmelding, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [apiPaths.driftsmeldinger],
			}),
	});
};

export const useSlettDriftsmelding = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { id: string }) => axiosInstance.post(apiPaths.slettDriftsmelding, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [apiPaths.driftsmeldinger],
			}),
	});
};

export const useToggleDriftsmelding = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { id: string; aktiv: boolean }) => axiosInstance.post(apiPaths.toggleDriftsmelding, data),
		onSuccess: () =>
			queryClient.invalidateQueries({
				queryKey: [apiPaths.driftsmeldinger],
			}),
	});
};
