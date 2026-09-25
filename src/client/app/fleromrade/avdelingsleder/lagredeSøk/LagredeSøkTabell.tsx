import { type LagretSøk, type Uttrekk, useAntallForLagredeSøk } from 'fleromrade/api/avdelingslederQueries';
import { LagretSøkKort } from 'fleromrade/avdelingsleder/lagredeSøk/LagretSøkKort';
import { useState } from 'react';

export function LagredeSøkTabell(props: {
	lagredeSøk: LagretSøk[];
	uttrekk: Uttrekk[];
	nyligOpprettetId?: number | null;
	onNyOpprettet?: (id: number) => void;
}) {
	const [søkMedVistAntall, setSøkMedVistAntall] = useState<number[]>([]);
	const antallQueries = useAntallForLagredeSøk(
		props.lagredeSøk,
		(søk, index) => index < 3 || søkMedVistAntall.includes(søk.id),
	);

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
