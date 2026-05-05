import React, { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import apiPaths from 'api/apiPaths';
import { LagretSøk, Uttrekk } from 'api/queries/avdelingslederQueries';
import { LagretSøkKort } from 'avdelingsleder/lagredeSøk/LagretSøkKort';
import { axiosInstance } from 'utils/reactQueryConfig';

export function LagredeSøkTabell(props: {
	lagredeSøk: LagretSøk[];
	uttrekk: Uttrekk[];
	nyligOpprettetId?: number | null;
	onNyOpprettet?: (id: number) => void;
}) {
	const [søkMedVistAntall, setSøkMedVistAntall] = useState<number[]>([]);
	const antallQueries = useQueries({
		queries: props.lagredeSøk.map((søk, index) => ({
			queryKey: [apiPaths.hentAntallLagretSøk(søk.id.toString())],
			enabled: index < 3 || søkMedVistAntall.includes(søk.id),
			queryFn: () =>
				axiosInstance.get(apiPaths.hentAntallLagretSøk(søk.id.toString())).then((response) => response.data),
		})),
	});

	const uttrekkPerLagretSøk = (lagretSøkId: number) => props.uttrekk.filter((u) => u.lagretSøkId === lagretSøkId);
	const visAntall = (lagretSøkId: number) =>
		setSøkMedVistAntall((ids) => (ids.includes(lagretSøkId) ? ids : [...ids, lagretSøkId]));

	return (
		<div>
			{props.lagredeSøk.map((lagretSøk, index) => {
				const henterAntallAutomatisk = index < 3;

				return (
					<LagretSøkKort
						key={lagretSøk.id}
						lagretSøk={lagretSøk}
						antall={antallQueries[index]?.data}
						antallLoading={antallQueries[index]?.isLoading ?? false}
						henterAntallAutomatisk={henterAntallAutomatisk}
						visAntall={() => visAntall(lagretSøk.id)}
						uttrekk={uttrekkPerLagretSøk(lagretSøk.id)}
						initiallyExpanded={lagretSøk.id === props.nyligOpprettetId}
						onNyOpprettet={props.onNyOpprettet}
					/>
				);
			})}
		</div>
	);
}
