import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from '@navikt/ds-react';
import { K9LosApiKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { CheckboxField, RadioGroupField, RadioOption } from 'form/FinalFields';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import ArrowBox from 'sharedComponents/ArrowBox';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

interface OwnProps {
	valgtOppgavekoId: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	values: any;
	hentOppgaveko: (id: string) => void;
	kodeverkType: string;
	endepunkt: K9LosApiKeys;
	labelId?: string;
}

/**
 * OppgaveKoKriterieVelger
 * @deprecated
 */
const OppgaveKoKriterieVelger: FunctionComponent<OwnProps> = ({
	valgtOppgavekoId,
	values,
	hentOppgaveko,
	kodeverkType,
	endepunkt,
	labelId,
}) => {
	const koKriterier = useKodeverk<KoSorteringType>(kodeverkTyper.KO_KRITERIER);
	const kriterieKodeverkType = koKriterier.find((kriterie) => kriterie.kode === kodeverkType);
	const { startRequest: lagreKriterie } = useRestApiRunner(endepunkt);
	const kriterieValues = values?.kriterier?.find((kriterie) => kriterie.kriterierType.kode === kodeverkType);
	const isSelected = !!kriterieValues?.checked;
	return (
		<>
			{labelId && (
				<Label size="small" style={{ color: '#262626' }}>
					<FormattedMessage id={labelId} />
				</Label>
			)}
			<VerticalSpacer fourPx />
			<CheckboxField
				name={kriterieKodeverkType.kode}
				label={kriterieKodeverkType.navn}
				checked={isSelected}
				onChange={(isChecked) =>
					lagreKriterie({
						id: valgtOppgavekoId,
						kriterierType: kriterieKodeverkType.kode,
						checked: isChecked,
						inkluder: true,
					}).then(() => {
						hentOppgaveko(valgtOppgavekoId);
					})
				}
			/>
			{isSelected && (
				<>
					<VerticalSpacer sixteenPx />
					<div style={{ width: '75%' }}>
						<ArrowBox alignOffset={30}>
							<RadioGroupField
								name={`${kriterieKodeverkType.kode}_inkluder`}
								onChange={(skalInkludere) =>
									lagreKriterie({
										id: valgtOppgavekoId,
										kriterierType: kriterieKodeverkType.kode,
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
		</>
	);
};

export default OppgaveKoKriterieVelger;
