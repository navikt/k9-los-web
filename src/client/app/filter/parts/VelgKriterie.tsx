import React, { useContext, useEffect, useState } from 'react';
import { BodyLong, Button, Checkbox, UNSAFE_Combobox as Combobox, Label } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter, OppgaveQuery, Oppgavefelt, OppgavefilterKode } from 'filter/filterTsTypes';
import { removeFilter, updateFilter } from 'filter/queryUtils';
import { feltverdiKey, kodeFraKey } from 'filter/utils';

interface Props {
	oppgavefilter: FeltverdiOppgavefilter;
	addGruppeOperation: (model: OppgaveQuery) => OppgaveQuery;
	paakrevdeKoder: OppgavefilterKode[];
	køvisning: boolean;
}

const VelgKriterie = ({ oppgavefilter, addGruppeOperation, køvisning, paakrevdeKoder = [] }: Props) => {
	const { updateQuery, errors } = useContext(FilterContext);
	const { felter } = useContext(AppContext);
	const [valgtKriterie, setValgtKriterie] = useState<Oppgavefelt | string>();
	const [options, setOptions] = useState([]);
	const [selectedChildIndex, setSelectedChildIndex] = useState(undefined);
	const [fritekst, setFritekst] = useState('');
	const [visAvanserteValg, setVisAvanserteValg] = useState('nei');
	const [klikketLeggTilUtenÅVelgeKriterie, setKlikketLeggTilUtenÅVelgeKriterie] = useState(false);
	// error fra modellen
	const errorMessage =
		klikketLeggTilUtenÅVelgeKriterie && !valgtKriterie
			? 'Du må velge et kriterie'
			: errors.find((e) => e.id === oppgavefilter.id && e.felt === 'kode')?.message;

	// TODO: fjern når de er fjernet i backend
	const kriterierUtenEgenAnsattOgAdressebeskyttelse = felter.filter(
		(v) => v.kode !== 'beskyttelse' && v.kode !== 'egenAnsatt',
	);

	const kriterierSomKanVelges = paakrevdeKoder.length
		? kriterierUtenEgenAnsattOgAdressebeskyttelse.filter((kriterie) => paakrevdeKoder.some((v) => v !== kriterie.kode))
		: kriterierUtenEgenAnsattOgAdressebeskyttelse;

	const getOptions = () => {
		const primærvalg = kriterierSomKanVelges?.filter((v) => v.kokriterie);
		const avanserteValg = kriterierSomKanVelges?.filter((v) => !v.kokriterie);

		if (visAvanserteValg === 'ja' || !køvisning) {
			const valg = [...primærvalg, ...avanserteValg];
			const selectedChild = valg.findIndex((v) => v === avanserteValg[0]);
			if (selectedChild !== -1) {
				setSelectedChildIndex(selectedChild + 2);
			}
			const optionList = valg.map((v) => ({ value: feltverdiKey(v), label: v.visningsnavn }));
			return [{ label: 'Gruppe', value: '__gruppe' }, ...optionList];
		}
		const optionList = primærvalg.map((v) => ({ value: feltverdiKey(v), label: v.visningsnavn }));
		return [{ label: 'Gruppe', value: '__gruppe' }, ...optionList];
	};

	useEffect(() => {
		setOptions(getOptions());
	}, [JSON.stringify(kriterierSomKanVelges), visAvanserteValg]);

	const toggleAvanserteValg = () => {
		setVisAvanserteValg((prevState) => (prevState === 'nei' ? 'ja' : 'nei'));
	};

	const handleSelect = (value: string) => {
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
		<div className="flex gap-7 border-dashed border-[1px] border-surface-action rounded-sm pt-4 pr-7 pb-5 pl-4">
			<div className="basis-5/12 velgKriterie">
				<style>
					{`.velgKriterie ul > li:nth-child(${selectedChildIndex}) {
           border-top: 2px solid black; 
        }`}
				</style>
				<Combobox
					label="Velg kriterie:"
					size="small"
					value={fritekst}
					onChange={setFritekst}
					onToggleSelected={handleSelect}
					options={options}
					error={errorMessage}
				/>
				{køvisning && (
					<Checkbox value="ja" size="small" onClick={toggleAvanserteValg}>
						Avanserte valg
					</Checkbox>
				)}
				<div className="flex gap-4 mt-4">
					<Button variant="primary" size="small" onClick={() => leggTil(valgtKriterie)}>
						Legg til
					</Button>
					<Button variant="secondary" size="small" onClick={() => updateQuery([removeFilter(oppgavefilter.id)])}>
						Avbryt
					</Button>
				</div>
			</div>
			<div className="mt-[-0.125rem]">
				{valgtKriterie && (
					<>
						<Label size="small">Beskrivelse:</Label>
						<BodyLong className="mt-1" size="small">
							Her vil det komme en beskrivelse for hva dette kriteriet er
						</BodyLong>
					</>
				)}
			</div>
		</div>
	);
};

export default VelgKriterie;
