/* eslint-disable camelcase */
/* eslint-disable react/jsx-pascal-case */
import React, { FunctionComponent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { Button, ErrorMessage, Modal, Skeleton, UNSAFE_Combobox } from '@navikt/ds-react';
import { Datepicker, Form, TextAreaField } from '@navikt/ft-form-hooks';
import { dateAfterOrEqualToToday, hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
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
	const { setValue, formState, trigger } = formMethods;
	useEffect(() => {
		formMethods.register('reservertAvIdent', { validate: required });
	}, [formMethods]);

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
		<Form
			formMethods={formMethods}
			onSubmit={(values) => {
				onSubmit(values.reservertAvIdent, values.begrunnelse, values.reserverTil);
			}}
		>
			<Modal
				open={open}
				onClose={closeModal}
				header={{
					heading: reservasjoner.length === 1 ? 'Endre reservasjon' : `Endre ${reservasjoner.length} reservasjoner`,
				}}
				className="min-w-[500px]"
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
						<Datepicker
							label={
								reservasjoner.length === 1
									? 'Velg dato som reservasjonen avsluttes'
									: 'Velg dato som reservasjonene avsluttes'
							}
							description={reservasjoner.length > 1 && 'Behold eksisterende dato ved å la feltet stå tomt'}
							name="reserverTil"
							validate={[dateAfterOrEqualToToday]}
						/>
					</div>
					{!harFlereReservasjoner(reservasjoner) && (
						<TextAreaField
							className="mt-8"
							label="Begrunn endring av reservasjon"
							name="begrunnelse"
							validate={[required, minLength(3), maxLength(1500), hasValidText]}
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
			</Modal>
		</Form>
	);
};

export default FlyttReservasjonerModal;
