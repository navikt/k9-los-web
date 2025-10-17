import React, { FunctionComponent } from 'react';
import { useKodeverk } from 'api/queries/kodeverkQueries';
import SearchDropdownMedPredefinerteVerdier, {
	SearchDropdownPredefinerteVerdierProps,
} from 'filter/parts/SearchDropdownMedPredefinerteVerdier';
import kodeverkTyper from 'kodeverk/kodeverkTyper';

const AksjonspunktVelger: FunctionComponent<
	SearchDropdownPredefinerteVerdierProps & { skjulValgteVerdierUnderDropdown?: boolean }
> = ({ onChange, feltdefinisjon, oppgavefilter, error, skjulValgteVerdierUnderDropdown }) => {
	const { data: alleKodeverk } = useKodeverk();
	const oppgavekoder = alleKodeverk?.[kodeverkTyper.OPPGAVE_KODE] || [];
	const formaterteOppgavekoder = oppgavekoder
		.map((oppgavekode) => ({
			value: oppgavekode.kode,
			label: `${oppgavekode.kode} - ${oppgavekode.navn}`,
			group: oppgavekode.gruppering,
		}))
		.sort((a, b) => Number(a.value) - Number(b.value));
	const grupper = [...new Set(formaterteOppgavekoder.map((oppgavekode) => oppgavekode.group))].sort();
	return (
		<SearchDropdownMedPredefinerteVerdier
			feltdefinisjon={feltdefinisjon}
			onChange={onChange}
			oppgavefilter={oppgavefilter}
			suggestions={formaterteOppgavekoder}
			groups={grupper}
			error={error}
			skjulValgteVerdierUnderDropdown={skjulValgteVerdierUnderDropdown}
		/>
	);
};

export default AksjonspunktVelger;
