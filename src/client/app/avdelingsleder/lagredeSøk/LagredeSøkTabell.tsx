import React from 'react';
import { useQueries } from '@tanstack/react-query';
import apiPaths from 'api/apiPaths';
import { LagretSøk } from 'api/queries/avdelingslederQueries';
import { LagretSøkKort } from 'avdelingsleder/lagredeSøk/LagretSøkKort';
import { axiosInstance } from 'utils/reactQueryConfig';

export function LagredeSøkTabell(props: { lagredeSøk: LagretSøk[] }) {
	const antallQueries = useQueries({
		queries: props.lagredeSøk.map((søk) => ({
			queryKey: [apiPaths.hentAntallLagretSøk(søk.id.toString())],
			queryFn: () =>
				axiosInstance.get(apiPaths.hentAntallLagretSøk(søk.id.toString())).then((response) => response.data),
		})),
	});

	return (
		<div>
			{props.lagredeSøk.map((lagretSøk, index) => (
				<LagretSøkKort
					key={lagretSøk.id}
					lagretSøk={lagretSøk}
					antall={antallQueries[index]?.data}
					antallLoading={antallQueries[index]?.isLoading ?? false}
				/>
			))}
		</div>
	);
}
