import React, { useContext } from 'react';
import dayjs from 'dayjs';
import {
	Checkbox,
	CheckboxGroup,
	DatePicker,
	Select,
	TextField,
	useDatepicker,
	useRangeDatepicker,
} from '@navikt/ds-react';
import AksjonspunktVelger from 'avdelingsleder/behandlingskoerV3/components/AksjonspunktVelger';
import { FilterContext } from 'filter/FilterContext';
import { FeltverdiOppgavefilter, Oppgavefelt, OppgavefilterKode, TolkesSom } from 'filter/filterTsTypes';
import { aksjonspunktKoder } from 'filter/konstanter';
import { updateFilter } from 'filter/queryUtils';
import { OPERATORS, calculateDays, mapBooleanToStringArray, mapStringToBooleanArray } from 'filter/utils';
import { enkeltverdi } from 'utils/enkeltverdi';
import * as styles from '../filterIndex.css';
import MultiSelectKriterie from './MultiSelectKriterie';

const useChangeValue = (oppgavefilter, updateQuery) => (value) => {
	const trimmedValue = typeof value === 'string' ? value.trim() : value;
	updateQuery([
		updateFilter(oppgavefilter.id, {
			verdi: trimmedValue,
		}),
	]);
};

const KriterieVerdi = ({
	feltdefinisjon,
	oppgavefilter,
	readOnly,
}: {
	feltdefinisjon?: Oppgavefelt;
	oppgavefilter: FeltverdiOppgavefilter;
	readOnly?: boolean;
}) => {
	const { updateQuery, errors } = useContext(FilterContext);
	const errorMessage = errors.find((e) => e.id === oppgavefilter.id && e.felt === 'verdi')?.message;

	const handleChangeValue = useChangeValue(oppgavefilter, updateQuery);

	const handleChangeBoolean = (values: string[]) => {
		const mappedValues: (string | null)[] = mapStringToBooleanArray(values);

		updateQuery([
			updateFilter(oppgavefilter.id, {
				verdi: mappedValues,
			}),
		]);
	};
	const onDateChange = (date) => {
		if (!date) {
			return;
		}
		const timezoneOffset = date.getTimezoneOffset() * 60000;
		const newDate = new Date(date.getTime() - timezoneOffset).toISOString().split('T')[0];
		handleChangeValue(newDate);
	};
	const initialDate =
		oppgavefilter.verdi && dayjs(new Date(enkeltverdi(oppgavefilter.verdi))).isValid()
			? new Date(enkeltverdi(oppgavefilter.verdi))
			: undefined;
	const { datepickerProps, inputProps } = useDatepicker({
		fromDate: new Date('23 2017'),
		onDateChange,
		defaultSelected: initialDate,
	});

	const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDays = parseFloat(e.target.value);
		const newDuration = dayjs.duration(newDays, 'days').toISOString();
		handleChangeValue([newDuration]);
	};

	const onRangeChange = (range) => {
		if (!range.from || !range.to) {
			return;
		}
		const timezoneOffset = range.from.getTimezoneOffset() * 60000;
		const newFrom = new Date(range.from.getTime() - timezoneOffset).toISOString().split('T')[0];
		const newTo = new Date(range.to.getTime() - timezoneOffset).toISOString().split('T')[0];
		handleChangeValue([newFrom, newTo]);
	};
	const initialFromDate =
		oppgavefilter.verdi && dayjs(new Date(oppgavefilter.verdi[0])).isValid()
			? new Date(oppgavefilter.verdi[0])
			: undefined;
	const initialToDate =
		oppgavefilter.verdi && dayjs(new Date(oppgavefilter.verdi[1])).isValid()
			? new Date(oppgavefilter.verdi[1])
			: undefined;
	const {
		datepickerProps: rangeDatepickerProps,
		toInputProps,
		fromInputProps,
	} = useRangeDatepicker({
		defaultSelected: { to: initialToDate, from: initialFromDate },
		onRangeChange,
	});

	if (aksjonspunktKoder.includes(feltdefinisjon?.kode)) {
		return (
			<AksjonspunktVelger
				onChange={handleChangeValue}
				feltdefinisjon={feltdefinisjon}
				oppgavefilter={oppgavefilter}
				error={errorMessage}
				skjulValgteVerdierUnderDropdown
			/>
		);
	}

	if (feltdefinisjon?.kode === OppgavefilterKode.Personbeskyttelse) {
		return (
			<Select
				label="Personbeskyttelse"
				hideLabel
				size="small"
				value={enkeltverdi(oppgavefilter.verdi)}
				onChange={(e) => handleChangeValue(e.target.value)}
				error={errorMessage}
				readOnly={readOnly}
			>
				{feltdefinisjon.verdiforklaringer.map((verdiforklaring) => (
					<option key={verdiforklaring.visningsnavn} value={verdiforklaring.verdi}>
						{verdiforklaring.visningsnavn}
					</option>
				))}
			</Select>
		);
	}

	if (feltdefinisjon?.tolkes_som === TolkesSom.Duration) {
		return (
			<TextField
				label="Antall dager"
				size="small"
				hideLabel
				value={calculateDays(oppgavefilter.verdi)}
				onChange={handleDaysChange}
				error={errorMessage}
				type="number"
				placeholder="Antall dager"
				min="0"
				readOnly={readOnly}
			/>
		);
	}
	if (feltdefinisjon?.tolkes_som === TolkesSom.Timestamp && oppgavefilter.operator === OPERATORS.INTERVAL) {
		return (
			<DatePicker {...rangeDatepickerProps}>
				<div className="flex">
					<DatePicker.Input {...fromInputProps} error={errorMessage} size="small" label="Fra" hideLabel />
					<div className="mx-1">-</div>
					<DatePicker.Input {...toInputProps} error={errorMessage} size="small" label="Til" hideLabel />
				</div>
			</DatePicker>
		);
	}

	if (feltdefinisjon?.tolkes_som === TolkesSom.Timestamp) {
		return (
			<DatePicker {...datepickerProps}>
				<DatePicker.Input {...inputProps} size="small" error={errorMessage} label="Velg dato" hideLabel />
			</DatePicker>
		);
	}

	if (feltdefinisjon?.tolkes_som === TolkesSom.Boolean) {
		return (
			<CheckboxGroup
				size="small"
				className={`${styles.feltvalgCheckboxes}`}
				hideLegend
				legend={feltdefinisjon.visningsnavn}
				onChange={handleChangeBoolean}
				value={mapBooleanToStringArray(oppgavefilter.verdi || [])}
				error={errorMessage}
				readOnly={readOnly}
			>
				<Checkbox value="ja">Ja</Checkbox>
				{feltdefinisjon.kode !== OppgavefilterKode.Hastesak ? <Checkbox value="nei">Nei</Checkbox> : null}
			</CheckboxGroup>
		);
	}

	if (
		feltdefinisjon?.tolkes_som === TolkesSom.String &&
		Array.isArray(feltdefinisjon.verdiforklaringer) &&
		feltdefinisjon.verdiforklaringer.length &&
		feltdefinisjon.verdiforklaringer.length < 0
	) {
		return (
			<CheckboxGroup
				className={`${styles.feltvalgCheckboxes}`}
				size="small"
				hideLegend
				legend={feltdefinisjon.visningsnavn}
				onChange={handleChangeValue}
				value={oppgavefilter.verdi}
				error={errorMessage}
				readOnly={readOnly}
			>
				{feltdefinisjon.verdiforklaringer.map((verdiforklaring) => (
					<Checkbox key={verdiforklaring.visningsnavn} value={verdiforklaring.verdi}>
						{verdiforklaring.visningsnavn}
					</Checkbox>
				))}
			</CheckboxGroup>
		);
	}

	if (
		feltdefinisjon?.tolkes_som === TolkesSom.String &&
		Array.isArray(feltdefinisjon.verdiforklaringer) &&
		feltdefinisjon.verdiforklaringer.length &&
		feltdefinisjon.verdiforklaringer.length > 0
	) {
		return (
			<MultiSelectKriterie
				feltdefinisjon={feltdefinisjon}
				oppgavefilter={oppgavefilter}
				error={errorMessage}
				readOnly={readOnly}
			/>
		);
	}

	return (
		<TextField
			label="Skriv fritekst"
			size="small"
			hideLabel
			error={errorMessage}
			value={enkeltverdi(oppgavefilter.verdi)}
			onChange={(e) => handleChangeValue(e.target.value)}
		/>
	);
};

export default KriterieVerdi;
