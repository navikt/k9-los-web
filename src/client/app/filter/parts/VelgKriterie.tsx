import { BodyLong, Button, Label, UNSAFE_Combobox } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterContext } from 'filter/FilterContext';
import {
	FELT_SENTINELLER,
	type Feltreferanse,
	feltIdentitet,
	feltreferanseFraIdentitet,
	finnFelt,
	sammeFelt,
} from 'filter/feltIdentitet';
import type { IdentifiedFeltverdiOppgavefilter } from 'filter/filterFrontendTypes';
import { type Oppgavefelt, type Oppgavefilter, Synlighet } from 'filter/filterTsTypes';
import { type QueryFunction, removeFilter, updateFilter } from 'filter/queryUtils';
import { COMBOBOX_SEPARATOR_VALUE, comboboxSeparatorStyle } from 'filter/utils';
import { useContext, useMemo, useState } from 'react';

type ComboboxOption = {
	label: string;
	value: string;
};

interface Props {
	oppgavefilter: IdentifiedFeltverdiOppgavefilter;
	addGruppeOperation: QueryFunction;
	paakrevdeFelter: Feltreferanse[];
}

const VelgKriterie = ({ oppgavefilter, addGruppeOperation, paakrevdeFelter = [] }: Props) => {
	const { updateQuery, errors } = useContext(FilterContext);
	const { felter } = useContext(AppContext);
	const [valgtKriterie, setValgtKriterie] = useState<Oppgavefelt | typeof FELT_SENTINELLER.gruppe>();
	const [fritekst, setFritekst] = useState('');
	const [klikketLeggTilUtenÅVelgeKriterie, setKlikketLeggTilUtenÅVelgeKriterie] = useState(false);
	// error fra modellen
	const errorMessage =
		klikketLeggTilUtenÅVelgeKriterie && !valgtKriterie
			? 'Du må velge et kriterie'
			: errors.find((e) => e._nodeId === oppgavefilter._nodeId && e.felt === 'kode')?.message;

	const kriterierSomKanVelges = useMemo(
		() => felter.filter((kriterie) => !paakrevdeFelter.some((påkrevd) => sammeFelt(påkrevd, kriterie))),
		[felter, paakrevdeFelter],
	);

	// Avledet direkte fra kriterierSomKanVelges. Lå tidligere i state satt fra en useEffect,
	// noe som ga en ekstra render med tom liste før optionene kom på plass.
	const options = useMemo<ComboboxOption[]>(() => {
		const primærvalg = kriterierSomKanVelges?.filter((v) => v.synlighet === Synlighet.OverStreken);
		const avanserteValg = kriterierSomKanVelges?.filter((v) => v.synlighet === Synlighet.UnderStreken);

		const optionsList = primærvalg.map((v) => ({ value: feltIdentitet(v), label: v.visningsnavn }));
		if (avanserteValg?.length > 0) {
			optionsList.push({ value: COMBOBOX_SEPARATOR_VALUE, label: '' });
			optionsList.push(...avanserteValg.map((v) => ({ value: feltIdentitet(v), label: v.visningsnavn })));
		}
		optionsList.push({ label: 'Gruppe', value: FELT_SENTINELLER.gruppe });
		return optionsList;
	}, [kriterierSomKanVelges]);

	const handleSelect = (value: string) => {
		if (value === COMBOBOX_SEPARATOR_VALUE) return;
		if (value === FELT_SENTINELLER.gruppe) {
			setValgtKriterie(value);
			return;
		}

		const referanse = feltreferanseFraIdentitet(value);
		const kriterie = referanse ? finnFelt(kriterierSomKanVelges, referanse) : undefined;
		setValgtKriterie(kriterie);
	};

	const leggTil = (kriterie: Oppgavefelt | string) => {
		if (!kriterie) {
			setKlikketLeggTilUtenÅVelgeKriterie(true);
			return;
		}

		if (typeof kriterie === 'string') {
			if (kriterie === FELT_SENTINELLER.gruppe) {
				const operations = [removeFilter(oppgavefilter._nodeId), addGruppeOperation];
				updateQuery(operations);
				return;
			}
			return;
		}

		const { område, kode } = kriterie;

		const updateData: Partial<Oppgavefilter> = { område, kode, verdi: undefined };
		updateQuery([updateFilter(oppgavefilter._nodeId, updateData)]);
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
					<Button variant="secondary" size="small" onClick={() => updateQuery([removeFilter(oppgavefilter._nodeId)])}>
						Avbryt
					</Button>
				</div>
			</div>
			{valgtKriterie !== FELT_SENTINELLER.gruppe && valgtKriterie?.beskrivelse && (
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
