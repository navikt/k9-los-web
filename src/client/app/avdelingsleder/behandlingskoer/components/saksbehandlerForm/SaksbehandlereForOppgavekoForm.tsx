import React, { FunctionComponent } from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { K9LosApiKeys } from 'api/k9LosApi';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import { CheckboxField } from 'form/FinalFields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Oppgaveko } from '../../oppgavekoTsType';
import * as styles from './saksbehandlereForOppgavekoForm.css';

interface OwnProps {
	valgtOppgaveko: Oppgaveko;
	alleSaksbehandlere: Saksbehandler[];
	hentOppgaveko: (id: string) => void;
}

/**
 * SaksbehandlereForOppgavekoForm
 */
const SaksbehandlereForOppgavekoForm: FunctionComponent<OwnProps> = ({
	valgtOppgaveko,
	alleSaksbehandlere,
	hentOppgaveko,
}) => {
	const buildInitialValues = () => {
		const identer = valgtOppgaveko.saksbehandlere
			? valgtOppgaveko.saksbehandlere.reduce((acc, sb) => ({ ...acc, [sb.epost.replace(/\./g, '')]: true }), {})
			: {};
		return {
			...identer,
		};
	};

	const pos = Math.ceil(alleSaksbehandlere.length / 2);
	const alleSaksbehandlereVenstreListe = alleSaksbehandlere.slice(0, pos);
	const alleSaksbehandlereHoyreListe = alleSaksbehandlere.slice(pos);

	const { startRequest: knyttSaksbehandlerTilOppgaveko } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_SAKSBEHANDLER);

	return (
		<Form
			onSubmit={() => undefined}
			initialValues={buildInitialValues()}
			render={() => (
				<div className={styles.panel}>
					<VerticalSpacer sixteenPx />
					{alleSaksbehandlere.length === 0 && (
						<FormattedMessage id="SaksbehandlereForOppgavekoForm.IngenSaksbehandlere" />
					)}
					{alleSaksbehandlere.length > 0 && (
						<Row>
							<Column xs="6">
								{alleSaksbehandlereVenstreListe.map((s) => (
									<div key={s.epost} className={styles.checkBox}>
										<CheckboxField
											key={s.epost}
											name={s.epost.replace(/\./g, '')}
											label={s.navn ? s.navn : s.epost.split('@')[0]}
											onChange={(isChecked) =>
												knyttSaksbehandlerTilOppgaveko({
													id: valgtOppgaveko.id,
													epost: s.epost,
													checked: isChecked,
												}).then(() => {
													hentOppgaveko(valgtOppgaveko.id);
												})
											}
										/>
									</div>
								))}
							</Column>
							<Column xs="6">
								{alleSaksbehandlereHoyreListe.map((s) => (
									<div key={s.epost} className={styles.checkBox}>
										<CheckboxField
											key={s.epost}
											name={s.epost.replace(/\./g, '')}
											label={s.navn ? s.navn : s.epost}
											onChange={(isChecked) =>
												knyttSaksbehandlerTilOppgaveko({
													id: valgtOppgaveko.id,
													epost: s.epost,
													checked: isChecked,
												}).then(() => {
													hentOppgaveko(valgtOppgaveko.id);
												})
											}
										/>
									</div>
								))}
							</Column>
						</Row>
					)}
				</div>
			)}
		/>
	);
};

export default SaksbehandlereForOppgavekoForm;
