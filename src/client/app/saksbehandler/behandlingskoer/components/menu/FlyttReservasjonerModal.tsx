/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import {
	Button,
	DatePicker,
	DateValidationT,
	ErrorMessage,
	Modal,
	Skeleton,
	TextField,
	UNSAFE_Combobox,
	useDatepicker,
} from '@navikt/ds-react';
import { useEndreReservasjoner, useGetAlleSaksbehandlere } from 'api/queries/saksbehandlerQueries';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';

interface FlyttReservasjonType {
	oppgaveNøkkel: OppgaveNøkkel;
	begrunnelse: string;
	reserverTil?: string;
	reservertAvIdent?: string;
}

interface OwnProps {
	open: boolean;
	closeModal: () => void;
	reservasjoner?: FlyttReservasjonType[];
}

const harFlereReservasjoner = (reservasjoner: FlyttReservasjonType[]) => reservasjoner && reservasjoner.length > 1;

const initialValues = (reservasjoner: FlyttReservasjonType[]) => {
	if (harFlereReservasjoner(reservasjoner)) {
		return {
			reserverTil: '',
			begrunnelse: null,
			reservertAvIdent: '',
		};
	}
	return {
		reserverTil: reservasjoner[0]?.reserverTil ? dayjs(reservasjoner[0].reserverTil).format('YYYY-MM-DD') : '',
		begrunnelse: reservasjoner[0]?.begrunnelse || null,
		reservertAvIdent: reservasjoner[0]?.reservertAvIdent || '',
	};
};

/**
 * FlyttReservasjonerModal
 *
 * Presentasjonskomponent. Modal som lar en søke opp en saksbehandler som saken skal flyttes til. En kan også begrunne hvorfor saken skal flyttes.
 */
export const FlyttReservasjonerModal: FunctionComponent<OwnProps> = ({ open, closeModal, reservasjoner }) => {
	const { mutate: flyttReservasjoner, isPending } = useEndreReservasjoner(closeModal);
	const { data: saksbehandlere, isLoading, error } = useGetAlleSaksbehandlere({ placeholderData: [] });
	const uniqueSaksbehandlere = Array.from(new Set(saksbehandlere.map((a) => a.brukerIdent))).map((brukerIdent) =>
		saksbehandlere.find((a) => a.brukerIdent === brukerIdent),
	);
	const saksbehandlerOptions = uniqueSaksbehandlere
		.map((v) => ({ value: v.brukerIdent, label: v.navn }))
		.sort((a, b) => a.label.localeCompare(b.label));

	const formMethods = useForm<Omit<FlyttReservasjonType, 'oppgaveNøkkel'>>({
		defaultValues: initialValues(reservasjoner),
		mode: 'onBlur',
		reValidateMode: 'onChange',
	});
	const { setValue, formState, trigger, register, handleSubmit, setError, clearErrors } = formMethods;
	useEffect(() => {
		formMethods.register('reservertAvIdent', { validate: (v) => (!v ? 'Feltet er påkrevd' : undefined) });
	}, [formMethods]);

	const defaultReserverTil = initialValues(reservasjoner).reserverTil;
	const [dateTouched, setDateTouched] = useState(false);
	const lastDateValidation = useRef(null);

	const applyDateValidation = useCallback(
		(validation: DateValidationT) => {
			if (!validation) return;
			if (validation.isInvalid) {
				setError('reserverTil', { type: 'custom', message: 'Ugyldig dato' });
			} else if (validation.isBefore) {
				setError('reserverTil', { type: 'custom', message: 'Dato må være etter eller lik dagens dato' });
			} else {
				clearErrors('reserverTil');
			}
		},
		[setError, clearErrors],
	);

	const { datepickerProps, inputProps } = useDatepicker({
		onValidate: (validation) => {
			lastDateValidation.current = validation;
			if (dateTouched) {
				applyDateValidation(validation);
			}
		},
		fromDate: new Date(),
		defaultSelected: defaultReserverTil ? new Date(defaultReserverTil) : undefined,
		onDateChange: (date) => {
			if (date) clearErrors('reserverTil');
			setValue('reserverTil', date ? dayjs(date).format('YYYY-MM-DD') : '', { shouldDirty: true });
		},
	});

	const handleDateInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setDateTouched(true);
		applyDateValidation(lastDateValidation.current);
		inputProps.onBlur?.(e);
	};

	const saksbehandlerIdent = formMethods.watch('reservertAvIdent');
	const onSubmit = (brukerIdent: string, begrunnelse: string, reserverTil: string) => {
		if (reservasjoner.length === 1) {
			flyttReservasjoner([
				{
					oppgaveNøkkel: reservasjoner[0]?.oppgaveNøkkel,
					brukerIdent,
					begrunnelse,
					reserverTil,
				},
			]);
		} else {
			flyttReservasjoner(
				reservasjoner.map((v) => ({
					oppgaveNøkkel: v.oppgaveNøkkel,
					begrunnelse: v.begrunnelse,
					brukerIdent,
					reserverTil,
				})),
			);
		}
	};

	return (
		<Modal
			open={open}
			onClose={closeModal}
			header={{
				heading: reservasjoner.length === 1 ? 'Endre reservasjon' : `Endre ${reservasjoner.length} reservasjoner`,
			}}
			className="min-w-[500px]"
		>
			<form
				onSubmit={handleSubmit((values) => {
					onSubmit(values.reservertAvIdent, values.begrunnelse, values.reserverTil);
				})}
			>
				<Modal.Body>
					{isLoading && <Skeleton height={80} />}
					{(error || !saksbehandlere) && <ErrorMessage>Noe gikk galt ved henting av saksbehandlere</ErrorMessage>}
					{saksbehandlere.length > 0 && (
						<UNSAFE_Combobox
							label="Velg saksbehandler"
							size="small"
							options={saksbehandlerOptions}
							selectedOptions={
								saksbehandlerIdent && saksbehandlerOptions.find((v) => v.value === saksbehandlerIdent)
									? saksbehandlerOptions.filter((v) => v.value === saksbehandlerIdent)
									: []
							}
							onToggleSelected={(optionValue, isSelected) => {
								if (isSelected) {
									setValue('reservertAvIdent', saksbehandlere.find((v) => v.brukerIdent === optionValue)?.brukerIdent);
									trigger('reservertAvIdent');
								} else {
									setValue('reservertAvIdent', '');
								}
							}}
							shouldAutocomplete
							onBlurCapture={() => trigger('reservertAvIdent')}
							error={formState.errors.reservertAvIdent?.message}
						/>
					)}
					<div className="mt-8">
						<DatePicker {...datepickerProps}>
							<DatePicker.Input
								{...inputProps}
								onBlur={handleDateInputBlur}
								label={
									reservasjoner.length === 1
										? 'Velg dato som reservasjonen avsluttes'
										: 'Velg dato som reservasjonene avsluttes'
								}
								description={reservasjoner.length > 1 ? 'Behold eksisterende dato ved å la feltet stå tomt' : undefined}
								error={formState.errors.reserverTil?.message}
							/>
						</DatePicker>
					</div>
					{!harFlereReservasjoner(reservasjoner) && (
						<TextField
							className="mt-8"
							label="Begrunn endring av reservasjon"
							error={formState.errors.begrunnelse?.message}
							{...register('begrunnelse', {
								required: 'Feltet er påkrevd',
								minLength: { value: 3, message: 'Må være minst 3 tegn' },
								maxLength: { value: 1500, message: 'Maks 1500 tegn' },
							})}
						/>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" disabled={isPending} type="submit">
						Lagre
					</Button>
					<Button variant="secondary" type="button" onClick={closeModal}>
						Avbryt
					</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
};

export default FlyttReservasjonerModal;
