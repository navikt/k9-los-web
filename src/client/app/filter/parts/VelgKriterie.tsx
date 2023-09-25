import React, { useContext, useMemo, useState } from 'react';
import { BodyLong, Button, Label, Select } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter, OppgaveQuery, Oppgavefelt } from 'filter/filterTsTypes';
import { removeFilter, updateFilter } from 'filter/queryUtils';
import { feltverdiKey, kodeFraKey } from 'filter/utils';

interface Props {
	oppgavefilter: FeltverdiOppgavefilter;
	addGruppeOperation: (model: OppgaveQuery) => OppgaveQuery;
}

const VelgKriterie = ({ oppgavefilter, addGruppeOperation }: Props) => {
	const { updateQuery } = useContext(FilterContext);
	const { felter: kriterierSomKanVelges } = useContext(AppContext);
	const [valgtKriterie, setValgtKriterie] = useState<Oppgavefelt | string>();
	const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
		if (event.target.value === '__gruppe') {
			setValgtKriterie(event.target.value);
			return;
		}
		const kode = kodeFraKey(event.target.value);
		const kriterie = kriterierSomKanVelges.find((k) => k.kode === kode);
		setValgtKriterie(kriterie);
	};

	const leggTil = (kriterie: Oppgavefelt | string) => {
		if (!kriterie) {
			return;
		}

		if (typeof kriterie === 'string') {
			if (kriterie === '__gruppe') {
				const operations = [removeFilter(oppgavefilter.id), addGruppeOperation];
				updateQuery(operations);
				return;
			}
			return;
		}

		const { område, kode } = kriterie;

		const updateData = { område, kode, verdi: undefined };
		updateQuery([updateFilter(oppgavefilter.id, updateData)]);
	};

	const options = useMemo(
		() =>
			kriterierSomKanVelges.map((v) => (
				<option key={feltverdiKey(v)} value={feltverdiKey(v)}>
					{v.visningsnavn}
				</option>
			)),
		[kriterierSomKanVelges],
	);
	return (
		<div className="flex gap-7 border-dashed border-[1px] border-surface-action rounded-sm pt-4 pr-7 pb-5 pl-4">
			<div className="basis-5/12">
				<Select
					label="Velg kriterie:"
					size="small"
					value={
						valgtKriterie && typeof valgtKriterie === 'object' ? feltverdiKey(valgtKriterie) : (valgtKriterie as string)
					}
					onChange={handleSelect}
				>
					<option>Velg kriterie</option>
					<option value="__gruppe">Gruppe</option>
					{options}
				</Select>
				<div className="flex gap-4 mt-4">
					<Button variant="primary" size="small" onClick={() => leggTil(valgtKriterie)}>
						Legg til
					</Button>
					<Button variant="secondary" size="small" onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}>
						Avbryt
					</Button>
				</div>
			</div>
			<div>
				<Label>Beskrivelse:</Label>
				<BodyLong>Her vil det komme en beskrivelse for hva dette kriteriet er</BodyLong>
			</div>
		</div>
	);
};

export default VelgKriterie;