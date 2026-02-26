import React, { useContext, useMemo } from 'react';
import { Select } from '@navikt/ds-react';
import { FilterContext } from 'filter/FilterContext';
import { addSortering, resetSortering } from 'filter/queryUtils';
import { SORTERING_ALTERNATIVER, mapKodeTilSorteringParams, mapSorteringParamsTilKode } from './sorteringUtils';

const EnkelSortering = () => {
	const { oppgaveQuery, updateQuery } = useContext(FilterContext);

	const selectValue = useMemo(() => {
		if (!oppgaveQuery.order.length) return undefined;

		if (oppgaveQuery.order.length > 1) {
			throw new Error('Kan ikke håndtere flere sorteringer');
		}

		return mapSorteringParamsTilKode(oppgaveQuery.order[0]);
	}, [oppgaveQuery]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const payload = mapKodeTilSorteringParams(e.target.value as SORTERING_ALTERNATIVER);
		if (payload) {
			updateQuery([resetSortering(), addSortering({ type: 'enkel', ...payload })]);
		}
	};

	return (
		<Select label="Sortering:" size="small" onChange={handleChange} value={selectValue}>
			<option value={SORTERING_ALTERNATIVER.mottattDatoEldstTilNyest}>Mottatt dato: eldste til nyeste</option>
			<option value={SORTERING_ALTERNATIVER.mottattDatoNyestTilEldst}>Mottatt dato: nyeste til eldste</option>
			<option value={SORTERING_ALTERNATIVER.feilutbetaltBeløpSynkende}>
				Feilutbetaling: høyeste til laveste beløp (kun tilbakekreving)
			</option>
			<option value={SORTERING_ALTERNATIVER.feilutbetalingsdatoEldstTilNyest}>
				Feilutbetalingsdato: eldste til nyeste (kun tilbakekreving)
			</option>
			<option value={SORTERING_ALTERNATIVER.førsteGangHosBeslutterEldstTilNyest}>
				Tidspunkt første gang hos beslutter: eldste til nyeste
			</option>
		</Select>
	);
};

export default EnkelSortering;
