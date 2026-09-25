import { useQueryClient } from '@tanstack/react-query';
import {
	getHentDriftsmeldingerQueryKey,
	useEndreDriftsmeldingstatus,
	useHentDriftsmeldinger,
	useOpprettDriftsmelding,
	useSlettDriftsmelding,
} from 'api/generated/los';
import { useOmråde } from 'fleromrade/OmrådeContext';

export const useDriftsmeldinger = () => {
	const { urlSegment } = useOmråde();
	return useHentDriftsmeldinger(urlSegment);
};

const useInvaliderDriftsmeldinger = () => {
	const queryClient = useQueryClient();
	const { urlSegment } = useOmråde();
	return () => queryClient.invalidateQueries({ queryKey: getHentDriftsmeldingerQueryKey(urlSegment) });
};

export const useLeggTilDriftsmelding = () => {
	const { urlSegment } = useOmråde();
	const onSuccess = useInvaliderDriftsmeldinger();
	const { mutate, ...resten } = useOpprettDriftsmelding({ mutation: { onSuccess } });
	return {
		...resten,
		leggTil: (melding: string, options?: Parameters<typeof mutate>[1]) =>
			mutate({ omrade: urlSegment, data: { driftsmelding: melding } }, options),
	};
};

export const useFjernDriftsmelding = () => {
	const { urlSegment } = useOmråde();
	const onSuccess = useInvaliderDriftsmeldinger();
	const { mutate, ...resten } = useSlettDriftsmelding({ mutation: { onSuccess } });
	return { ...resten, fjern: (id: string) => mutate({ omrade: urlSegment, data: { id } }) };
};

export const useSettDriftsmeldingAktiv = () => {
	const { urlSegment } = useOmråde();
	const onSuccess = useInvaliderDriftsmeldinger();
	const { mutate, ...resten } = useEndreDriftsmeldingstatus({ mutation: { onSuccess } });
	return { ...resten, settAktiv: (id: string, aktiv: boolean) => mutate({ omrade: urlSegment, data: { id, aktiv } }) };
};
