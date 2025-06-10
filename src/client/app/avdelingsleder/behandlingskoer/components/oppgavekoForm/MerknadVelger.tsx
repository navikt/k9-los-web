import React, { Fragment, FunctionComponent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Label } from '@navikt/ds-react';
import { K9LosApiKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { Kriterie } from 'avdelingsleder/behandlingskoer/oppgavekoTsType';
import { CheckboxField } from 'form/FinalFields';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import KriterierType from '../../../../types/KriterierType';

interface OwnProps {
	valgtOppgavekoId: string;
	values: any;
	hentOppgaveko: (id: string) => void;
}

const MerknadVelger: FunctionComponent<OwnProps> = ({ valgtOppgavekoId, values, hentOppgaveko }) => {
	const merknadsTyper = useKodeverk(kodeverkTyper.MERKNAD_TYPE);
	const { startRequest: lagreOppgavekoMerknader } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_KRITERIER);

	const merknadValues = values.kriterier?.filter(
		(kriterier: Kriterie) => kriterier.kriterierType.felttypeKodeverk === kodeverkTyper.MERKNAD_TYPE,
	);
	const aktiveMerknader = merknadValues[0]?.koder || [];

	if (!merknadsTyper || merknadsTyper?.length === 0) {
		return null;
	}
	return (
		<>
			<VerticalSpacer twentyPx />
			<Label size="small" style={{ color: '#262626' }}>
				<FormattedMessage id="UtvalgskriterierForOppgavekoForm.Merknader" />
			</Label>
			{merknadsTyper.map((merknad) => (
				<Fragment key={merknad.kode}>
					<VerticalSpacer fourPx />
					<CheckboxField
						key={merknad.kode}
						name={merknad.kode}
						label={merknad.navn}
						checked={aktiveMerknader.includes(merknad.kode)}
						onChange={(isChecked) =>
							lagreOppgavekoMerknader({
								id: valgtOppgavekoId,
								kriterierType: KriterierType.MerknadType,
								koder: isChecked
									? [...aktiveMerknader, merknad.kode]
									: aktiveMerknader.filter((aktivMerknad) => aktivMerknad !== merknad.kode),
							}).then(() => {
								hentOppgaveko(valgtOppgavekoId);
							})
						}
					/>
				</Fragment>
			))}
			<VerticalSpacer twentyPx />
		</>
	);
};

export default MerknadVelger;
