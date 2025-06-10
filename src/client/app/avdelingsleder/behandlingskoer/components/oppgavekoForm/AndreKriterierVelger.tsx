import React, { Fragment, FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { K9LosApiKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { CheckboxField, RadioGroupField, RadioOption } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import ArrowBox from 'sharedComponents/ArrowBox';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import * as styles from './andreKriterierVelger.css';

interface OwnProps {
	valgtOppgavekoId: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	values: any;
	hentOppgaveko: (id: string) => void;
}

/**
 * AndreKriterierVelger
 * @deprecated
 */
const AndreKriterierVelger: FunctionComponent<OwnProps> = ({ valgtOppgavekoId, values, hentOppgaveko }) => {
	const andreKriterierTyper = useKodeverk(kodeverkTyper.ANDRE_KRITERIER_TYPE);
	const { startRequest: lagreOppgavekoAndreKriterier } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_ANDRE_KRITERIER);

	return (
		<div>
			{andreKriterierTyper.map((akt) => (
				<Fragment key={akt.kode}>
					<VerticalSpacer fourPx />
					<CheckboxField
						key={akt.kode}
						name={akt.kode}
						label={akt.navn}
						onChange={(isChecked) =>
							lagreOppgavekoAndreKriterier({
								id: valgtOppgavekoId,
								andreKriterierType: akt.kode,
								checked: isChecked,
								inkluder: true,
							}).then(() => {
								hentOppgaveko(valgtOppgavekoId);
							})
						}
					/>
					{values[akt.kode] && (
						<>
							<VerticalSpacer sixteenPx />
							<div className={styles.arrowbox}>
								<ArrowBox alignOffset={30}>
									<RadioGroupField
										name={`${akt.kode}_inkluder`}
										onChange={(skalInkludere) =>
											lagreOppgavekoAndreKriterier({
												id: valgtOppgavekoId,
												andreKriterierType: akt.kode,
												checked: true,
												inkluder: skalInkludere,
											}).then(() => {
												hentOppgaveko(valgtOppgavekoId);
											})
										}
									>
										<RadioOption value label={<FormattedMessage id="AndreKriterierVelger.TaMed" />} />
										<RadioOption value={false} label={<FormattedMessage id="AndreKriterierVelger.Fjern" />} />
									</RadioGroupField>
								</ArrowBox>
							</div>
						</>
					)}
				</Fragment>
			))}
		</div>
	);
};

export default AndreKriterierVelger;
