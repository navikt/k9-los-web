import React, { FunctionComponent, useCallback, useEffect } from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import dayjs from 'dayjs';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys } from 'api/k9LosApi';
import RestApiState from 'api/rest-api-hooks/src/RestApiState';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { DatepickerField, InputField, TextAreaField } from 'form/FinalFields';
import Modal from 'sharedComponents/Modal';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import {
	dateAfterOrEqual,
	hasValidDate,
	hasValidText,
	maxLength,
	minLength,
	required,
} from 'utils/validation/validators';
import { Saksbehandler } from '../../saksbehandlerTsType';
import styles from './flyttReservasjonModal.css';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

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
	const {
		startRequest,
		state,
		data: saksbehandler,
		resetRequestData,
	} = useRestApiRunner<Saksbehandler>(K9LosApiKeys.FLYTT_RESERVASJON_SAKSBEHANDLER_SOK);
	const { startRequest: endreOppgaveReservasjon } = useRestApiRunner(K9LosApiKeys.ENDRE_OPPGAVERESERVASJON);
	const intl = useIntl();

	const finnSaksbehandler = useCallback((brukerIdent) => startRequest({ brukerIdent }), []);

	const queryClient = useQueryClient();

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

	const formatText = () => {
		if (state === RestApiState.SUCCESS && !saksbehandler) {
			return intl.formatMessage({ id: 'LeggTilSaksbehandlerForm.FinnesIkke' });
		}
		return saksbehandler.navn || saksbehandler.brukerIdent || '';
	};

	useEffect(
		() => () => {
			resetRequestData();
		},
		[],
	);

	return (
		<Modal
			className={styles.modal}
			isOpen={showModal}
			closeButton={false}
			contentLabel={intl.formatMessage({ id: 'FlyttReservasjonModal.Titel' })}
			onRequestClose={closeModal}
		>
			<Form
				onSubmit={(values) => finnSaksbehandler(values.brukerIdent)}
				initialValues={{ brukerIdent: reservertAvIdent || '' }}
				render={({ handleSubmit, values }) => (
					<form onSubmit={handleSubmit}>
						<Element>
							<FormattedMessage id="FlyttReservasjonModal.Titel" />
						</Element>
						<VerticalSpacer eightPx />
						<FlexContainer>
							<FlexRow>
								<FlexColumn>
									<InputField
										name="brukerIdent"
										label={intl.formatMessage({ id: 'FlyttReservasjonModal.Brukerident' })}
										bredde="S"
										validate={[required]}
										autoFocus
									/>
								</FlexColumn>
								<FlexColumn>
									<Hovedknapp
										mini
										htmlType="submit"
										className={styles.button}
										spinner={state === RestApiState.LOADING}
										disabled={!values.brukerIdent || state === RestApiState.LOADING}
									>
										<FormattedMessage id="FlyttReservasjonModal.Sok" />
									</Hovedknapp>
								</FlexColumn>
							</FlexRow>
						</FlexContainer>
						{state === RestApiState.SUCCESS && (
							<>
								<Normaltekst>{formatText()}</Normaltekst>
								<VerticalSpacer sixteenPx />
							</>
						)}
					</form>
				)}
			/>
			<Form
				onSubmit={(values) =>
					onSubmit(saksbehandler ? saksbehandler.brukerIdent : '', values.begrunnelse, values.reserverTil)
				}
				initialValues={{
					reserverTil: oppgaveReservertTil ? dayjs(oppgaveReservertTil).format('YYYY-MM-DD') : '',
					begrunnelse: eksisterendeBegrunnelse || '',
				}}
				render={({ handleSubmit, values }) => (
					<form onSubmit={handleSubmit}>
						<VerticalSpacer sixteenPx />
						<div className={styles.test}>
							<DatepickerField
								name="reserverTil"
								onBlurValidation
								validate={[hasValidDate, dateAfterOrEqual(new Date())]}
								label={intl.formatMessage({ id: 'FlyttReservasjonModal.FlyttReservasjonText' })}
								alwaysShowCalendar
								disabledDays={{ before: new Date() }}
							/>
						</div>
						<VerticalSpacer sixteenPx />
						<TextAreaField
							name="begrunnelse"
							label={intl.formatMessage({ id: 'FlyttReservasjonModal.Begrunn' })}
							validate={[required, maxLength1500, minLength3, hasValidText]}
							maxLength={1500}
						/>
						<Hovedknapp
							className={styles.submitButton}
							mini
							htmlType="submit"
							disabled={!saksbehandler || !values.begrunnelse || values.begrunnelse.length < 3}
						>
							{intl.formatMessage({ id: 'FlyttReservasjonModal.Ok' })}
						</Hovedknapp>
						<Knapp className={styles.cancelButton} mini htmlType="reset" onClick={closeModal}>
							{intl.formatMessage({ id: 'FlyttReservasjonModal.Avbryt' })}
						</Knapp>
					</form>
				)}
			/>
		</Modal>
	);
};

export default FlyttReservasjonModal;
