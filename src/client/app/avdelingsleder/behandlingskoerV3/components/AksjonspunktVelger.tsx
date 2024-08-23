import React, { FunctionComponent } from 'react';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import SearchDropdownMedPredefinerteVerdier, {
	SearchDropdownPredefinerteVerdierProps,
} from 'filter/parts/SearchDropdownMedPredefinerteVerdier';
import kodeverkTyper from 'kodeverk/kodeverkTyper';

const AksjonspunktVelger: FunctionComponent<SearchDropdownPredefinerteVerdierProps> = ({
	onChange,
	feltdefinisjon,
	oppgavefilter,
	error,
}) => {
	const oppgavekoder = useKodeverk(kodeverkTyper.OPPGAVE_KODE);
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
		/>
	);
};

export default AksjonspunktVelger;
