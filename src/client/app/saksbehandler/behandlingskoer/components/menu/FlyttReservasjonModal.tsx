import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import Modal from 'sharedComponents/Modal';
import * as styles from './flyttReservasjonModal.css';
import { useGetAlleSaksbehandlere } from 'api/queries/saksbehandlerQueries';
import { ErrorMessage, Skeleton, UNSAFE_Combobox, Heading } from '@navikt/ds-react';
import { SaksbehandlerEnkel } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import { useForm } from 'react-hook-form';
import { Form, TextAreaField, Datepicker } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required, dateAfterOrEqualToToday } from '@navikt/ft-form-validators';

interface OwnProps {
	showModal: boolean;
	oppgaveNøkkel: OppgaveNøkkel;
	oppgaveReservertTil?: Date | string;
	closeModal: () => void;
	eksisterendeBegrunnelse?: string;
	reservertAvIdent: string;
}

/**
 * FlyttReservasjonModal
 *
 * Presentasjonskomponent. Modal som lar en søke opp en saksbehandler som saken skal flyttes til. En kan også begrunne hvorfor saken skal flyttes.
 */
export const FlyttReservasjonModal: FunctionComponent<OwnProps> = ({
	showModal,
	closeModal,
	oppgaveNøkkel,
	oppgaveReservertTil,
	eksisterendeBegrunnelse,
	reservertAvIdent,
}) => {
	const { startRequest: endreOppgaveReservasjon } = useRestApiRunner(K9LosApiKeys.ENDRE_OPPGAVERESERVASJON);
	const intl = useIntl();
	const queryClient = useQueryClient();
	const [saksbehandler, setSaksbehandler] = useState<SaksbehandlerEnkel | undefined>();
	const { data: saksbehandlere, isLoading, error } = useGetAlleSaksbehandlere();
	useEffect(() => {
		if (saksbehandlere && reservertAvIdent && !saksbehandler) {
			setSaksbehandler(saksbehandlere.find((v) => v.brukerIdent === reservertAvIdent));
		}
	}, [saksbehandlere]);

	const fieldnames = {
		reserverTil: 'reserverTil',
		begrunnelse: 'begrunnelse',
		saksbehandler: 'saksbehandler',
	};

	const initialValues = {
		[fieldnames.reserverTil]: oppgaveReservertTil
			? dayjs(oppgaveReservertTil).format('YYYY-MM-DD')
			: dayjs().format('YYYY-MM-DD'),
		[fieldnames.begrunnelse]: eksisterendeBegrunnelse || '',
		[fieldnames.saksbehandler]: reservertAvIdent || '', // TOOODOOOOOO
	};
	const formMethods = useForm({ defaultValues: initialValues });

	const endreReservasjonFn = useCallback(
		(brukerIdent: string, begrunnelse: string, reservertTilDato: string): Promise<any> => {
			const params: {
				oppgaveNøkkel: OppgaveNøkkel;
				brukerIdent: string;
				begrunnelse: string;
				reserverTil?: string;
			} = {
				oppgaveNøkkel,
				brukerIdent,
				begrunnelse,
			};

			if (reservertTilDato) {
				params.reserverTil = reservertTilDato;
			}

			return endreOppgaveReservasjon(params).then(() => {
				closeModal();
				queryClient.invalidateQueries(apiPaths.saksbehandlerReservasjoner);
				queryClient.invalidateQueries(apiPaths.avdelinglederReservasjoner);
			});
		},
		[queryClient],
	);
	const onSubmit = (brukerIdent: string, begrunnelse: string, reservertTilDato: string) => {
		endreReservasjonFn(brukerIdent, begrunnelse, reservertTilDato);
	};

	//validering
	// datepicker må være etter dagens dato, påkrevd og være en gyldig dato
	// begrunnelse må være minst 3 tegn, påkrevd, ha gyldig tekst og maks 1500 tegn

	return (
		<Modal
			className={styles.modal}
			isOpen={showModal}
			closeButton={false}
			contentLabel={intl.formatMessage({ id: 'FlyttReservasjonModal.Tittel' })}
			onRequestClose={closeModal}
		>
			<Heading size="small">{intl.formatMessage({ id: 'FlyttReservasjonModal.Tittel' })}</Heading>
			<Form
				formMethods={formMethods}
				onSubmit={(values) =>
					onSubmit(saksbehandler ? saksbehandler.brukerIdent : '', values.begrunnelse, values.reserverTil)
				}
			>
				{isLoading && <Skeleton height={80} />}
				{error && <ErrorMessage>Noe gikk galt ved henting av saksbehandlere</ErrorMessage>}
				{saksbehandlere.length > 0 && (
					<UNSAFE_Combobox
						label="Velg saksbehandler"
						className="mt-8"
						size="small"
						options={saksbehandlere.map((v) => v.navn)}
						selectedOptions={saksbehandler ? [saksbehandler.navn] : []}
						onToggleSelected={(saksbehandlerOption, isSelected) => {
							if (isSelected) {
								setSaksbehandler(
									saksbehandlere.find((v) => v.navn.toLowerCase() === saksbehandlerOption.toLowerCase()),
								);
							} else {
								setSaksbehandler(undefined);
							}
						}}
						shouldAutocomplete={true}
					/>
				)}
				<div className="mt-8">
					<Datepicker
						label={intl.formatMessage({ id: 'FlyttReservasjonModal.FlyttReservasjonText' })}
						name={fieldnames.reserverTil}
						validate={[dateAfterOrEqualToToday]}
					/>
				</div>
				<TextAreaField
					className="mt-8"
					label={intl.formatMessage({ id: 'FlyttReservasjonModal.Begrunn' })}
					name="begrunnelse"
					validate={[required, minLength(3), maxLength(1500), hasValidText]}
				/>
				<Hovedknapp className={styles.submitButton} mini htmlType="submit">
					{intl.formatMessage({ id: 'FlyttReservasjonModal.Ok' })}
				</Hovedknapp>
				<Knapp className={styles.cancelButton} mini htmlType="reset" onClick={closeModal}>
					{intl.formatMessage({ id: 'FlyttReservasjonModal.Avbryt' })}
				</Knapp>
			</Form>
		</Modal>
	);
};

export default FlyttReservasjonModal;
