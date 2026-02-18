/* eslint-disable react/jsx-pascal-case */
/* eslint-disable camelcase */
import React, { useContext, useEffect, useState } from 'react';
import { BodyLong, Button, Label, UNSAFE_Combobox } from '@navikt/ds-react';
import { ComboboxOption } from '@navikt/ds-react/cjs/form/combobox/types';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter, OppgaveQuery, Oppgavefelt, OppgavefilterKode } from 'filter/filterTsTypes';
import { removeFilter, updateFilter } from 'filter/queryUtils';
import { comboboxSeparatorStyle, COMBOBOX_SEPARATOR_VALUE, feltverdiKey, kodeFraKey } from 'filter/utils';

interface Props {
	oppgavefilter: FeltverdiOppgavefilter;
	addGruppeOperation: (model: OppgaveQuery) => OppgaveQuery;
	paakrevdeKoder: OppgavefilterKode[];
}

const VelgKriterie = ({ oppgavefilter, addGruppeOperation, paakrevdeKoder = [] }: Props) => {
	const { updateQuery, errors } = useContext(FilterContext);
	const { felter } = useContext(AppContext);
	const [valgtKriterie, setValgtKriterie] = useState<Oppgavefelt | '__gruppe'>();
	const [options, setOptions] = useState<ComboboxOption[]>([]);
	const [fritekst, setFritekst] = useState('');
	const [klikketLeggTilUtenÅVelgeKriterie, setKlikketLeggTilUtenÅVelgeKriterie] = useState(false);
	// error fra modellen
	const errorMessage =
		klikketLeggTilUtenÅVelgeKriterie && !valgtKriterie
			? 'Du må velge et kriterie'
			: errors.find((e) => e.id === oppgavefilter.id && e.felt === 'kode')?.message;

	const kriterierSomKanVelges =
		paakrevdeKoder.length > 0 ? felter.filter((kriterie) => paakrevdeKoder.some((v) => v !== kriterie.kode)) : felter;

	const getOptions = () => {
		const primærvalg = kriterierSomKanVelges?.filter((v) => v.kokriterie);
		const avanserteValg = kriterierSomKanVelges?.filter((v) => !v.kokriterie);

		const optionsList = primærvalg.map((v) => ({ value: feltverdiKey(v), label: v.visningsnavn }));
		if (avanserteValg?.length > 0) {
			optionsList.push({ value: COMBOBOX_SEPARATOR_VALUE, label: '' });
			optionsList.push(...avanserteValg.map((v) => ({ value: feltverdiKey(v), label: v.visningsnavn })));
		}
		optionsList.push({ label: 'Gruppe', value: '__gruppe' });
		return optionsList;
	};

	useEffect(() => {
		setOptions(getOptions());
	}, [JSON.stringify(kriterierSomKanVelges)]);

	const handleSelect = (value: string) => {
		if (value === COMBOBOX_SEPARATOR_VALUE) return;
		if (value === '__gruppe') {
			setValgtKriterie(value);
			return;
		}

		const kode = kodeFraKey(value);
		const kriterie = kriterierSomKanVelges.find((k) => k.kode === kode);
		setValgtKriterie(kriterie);
	};

	const leggTil = (kriterie: Oppgavefelt | string) => {
		if (!kriterie) {
			setKlikketLeggTilUtenÅVelgeKriterie(true);
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

	return (
		<div className="flex gap-7 border-dashed border-[1px] border-ax-bg-accent-strong rounded-sm pt-4 pr-7 pb-5 pl-4">
			<div className="basis-5/12 velgKriterie">
				<style>{comboboxSeparatorStyle('velgKriterie')}</style>
				<UNSAFE_Combobox
					label="Velg kriterie:"
					size="small"
					value={fritekst}
					onChange={setFritekst}
					onToggleSelected={handleSelect}
					options={options}
					error={errorMessage}
				/>
				<div className="flex gap-4 mt-4">
					<Button variant="primary" size="small" onClick={() => leggTil(valgtKriterie)}>
						Legg til
					</Button>
					<Button variant="secondary" size="small" onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}>
						Avbryt
					</Button>
				</div>
			</div>
			{valgtKriterie !== '__gruppe' && valgtKriterie?.beskrivelse && (
				<div className="mt-[-0.125rem]">
					<Label size="small">Beskrivelse:</Label>
					<BodyLong className="mt-1" size="small">
						{valgtKriterie.beskrivelse}
					</BodyLong>
				</div>
			)}
		</div>
	);
};

export default VelgKriterie;
