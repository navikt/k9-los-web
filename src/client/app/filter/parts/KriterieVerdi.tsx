import React, { useContext } from 'react';
import dayjs from 'dayjs';
import {
	Checkbox,
	CheckboxGroup,
	DatePicker,
	HStack,
	Select,
	TextField,
	useDatepicker,
	useRangeDatepicker,
} from '@navikt/ds-react';
import GruppertKriterieVelger from 'avdelingsleder/behandlingskoerV3/components/AksjonspunktVelger';
import { FilterContext } from 'filter/FilterContext';
import { IdentifiedFeltverdiOppgavefilter } from 'filter/filterFrontendTypes';
import { Oppgavefelt, OppgavefilterKode, TolkesSom } from 'filter/filterTsTypes';
import { kriterierSomSkalGrupperes } from 'filter/konstanter';
import { updateFilter } from 'filter/queryUtils';
import { OPERATORS, calculateDays, mapBooleanToStringArray, mapStringToBooleanArray } from 'filter/utils';
import MultiSelectKriterie from './MultiSelectKriterie';

const KriterieVerdi = ({
	feltdefinisjon,
	oppgavefilter,
	readOnly,
}: {
	feltdefinisjon: Oppgavefelt;
	oppgavefilter: IdentifiedFeltverdiOppgavefilter;
	readOnly?: boolean;
}) => {
	const { updateQuery, errors } = useContext(FilterContext);
	const errorMessage = errors.find((e) => e._nodeId === oppgavefilter._nodeId && e.felt === 'verdi')?.message;

	const handleChangeBoolean = (values: string[]) => {
		const mappedValues: (string | null)[] = mapStringToBooleanArray(values);

		updateQuery([
			updateFilter(oppgavefilter._nodeId, {
				verdi: mappedValues,
			}),
		]);
	};

	const onDateChange = (date: Date) => {
		if (!date) {
			return;
		}
		const timezoneOffset = date.getTimezoneOffset() * 60000;
		const newDate = new Date(date.getTime() - timezoneOffset).toISOString().split('T')[0];

		updateQuery([
			updateFilter(oppgavefilter._nodeId, {
				verdi: [newDate],
			}),
		]);
	};
	const initialDate =
		oppgavefilter.verdi && dayjs(new Date(oppgavefilter.verdi[0])).isValid()
			? new Date(oppgavefilter.verdi[0])
			: undefined;
	const { datepickerProps, inputProps } = useDatepicker({
		fromDate: new Date('23 2017'),
		onDateChange,
		defaultSelected: initialDate,
	});

	const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDays = parseInt(e.target.value, 10);
		const newDuration = Number.isNaN(newDays) ? 'P0D' : `P${newDays}D`;

		updateQuery([
			updateFilter(oppgavefilter._nodeId, {
				verdi: [newDuration],
			}),
		]);
	};

	const onRangeChange = (range: { from: Date | undefined; to?: Date | undefined }) => {
		if (!range.from || !range.to) {
			return;
		}
		const timezoneOffset = range.from.getTimezoneOffset() * 60000;
		const newFrom = new Date(range.from.getTime() - timezoneOffset).toISOString().split('T')[0];
		const newTo = new Date(range.to.getTime() - timezoneOffset).toISOString().split('T')[0];

		updateQuery([
			updateFilter(oppgavefilter._nodeId, {
				verdi: [newFrom, newTo],
			}),
		]);
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

	if (kriterierSomSkalGrupperes.includes(feltdefinisjon?.kode)) {
		return (
			<GruppertKriterieVelger
				onChange={(value) => {
					updateQuery([
						updateFilter(oppgavefilter._nodeId, {
							verdi: value,
						}),
					]);
				}}
				feltdefinisjon={feltdefinisjon}
				oppgavefilter={oppgavefilter}
				error={errorMessage}
				skjulValgteVerdierUnderDropdown
				readOnly={readOnly}
			/>
		);
	}

	if (feltdefinisjon?.kode === OppgavefilterKode.Personbeskyttelse) {
		return (
			<Select
				label="Personbeskyttelse"
				hideLabel
				size="small"
				value={oppgavefilter.verdi[0]}
				onChange={(e) =>
					updateQuery([
						updateFilter(oppgavefilter._nodeId, {
							verdi: [e.target.value],
						}),
					])
				}
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
				<DatePicker.Input
					{...inputProps}
					size="small"
					error={errorMessage}
					label="Velg dato"
					readOnly={readOnly}
					hideLabel
				/>
			</DatePicker>
		);
	}

	if (feltdefinisjon?.tolkes_som === TolkesSom.Boolean) {
		return (
			<CheckboxGroup
				size="small"
				hideLegend
				legend={feltdefinisjon.visningsnavn}
				onChange={handleChangeBoolean}
				value={mapBooleanToStringArray(oppgavefilter.verdi || [])}
				error={errorMessage}
				readOnly={readOnly}
			>
				<HStack gap="space-20" wrap>
					<Checkbox value="ja">Ja</Checkbox>
					{feltdefinisjon.kode !== OppgavefilterKode.Hastesak ? <Checkbox value="nei">Nei</Checkbox> : null}
				</HStack>
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
				size="small"
				hideLegend
				legend={feltdefinisjon.visningsnavn}
				onChange={(value: string[]) => {
					updateQuery([
						updateFilter(oppgavefilter._nodeId, {
							verdi: value,
						}),
					]);
				}}
				value={oppgavefilter.verdi}
				error={errorMessage}
				readOnly={readOnly}
			>
				<HStack gap="space-8" wrap>
					{feltdefinisjon.verdiforklaringer.map((verdiforklaring) => (
						<Checkbox key={verdiforklaring.visningsnavn} value={verdiforklaring.verdi}>
							{verdiforklaring.visningsnavn}
						</Checkbox>
					))}
				</HStack>
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
			value={oppgavefilter.verdi ? oppgavefilter.verdi[0] : undefined}
			onChange={(e) =>
				updateQuery([
					updateFilter(oppgavefilter._nodeId, {
						verdi: [e.target.value],
					}),
				])
			}
		/>
	);
};

export default KriterieVerdi;
