import React, { FunctionComponent, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import { BodyShort } from '@navikt/ds-react';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { CheckboxField } from 'form/FinalFields';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import behandlingType from 'kodeverk/behandlingType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getKodeverkFraKode } from 'utils/kodeverkUtils';
import punsjBehandlingstyper from '../../../../types/PunsjBehandlingstyper';
import * as styles from './utvalgskriterierForOppgavekoForm.css';

const behandlingstypeOrder = Object.values(behandlingType);

interface OwnProps {
	valgtOppgavekoId: string;
	hentOppgaveko: (id: string) => void;
	valgteBehandlingstyper: string[];
}

interface ValgtBehandlingstype {
	behandlingType: string;
	checked: boolean;
}
/**
 * BehandlingstypeVelger
 */
const BehandlingstypeVelger: FunctionComponent<OwnProps> = ({
	valgtOppgavekoId,
	hentOppgaveko,
	valgteBehandlingstyper = [],
}) => {
	const { startRequest: lagreOppgavekoBehandlingstype } = useRestApiRunner(
		K9LosApiKeys.LAGRE_OPPGAVEKO_BEHANDLINGSTYPE,
	);

	const alleBehandlingTyper = useKodeverk(kodeverkTyper.BEHANDLING_TYPE);
	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	const behandlingTyper = behandlingstypeOrder.map((kode) => alleBehandlingTyper.find((bt) => bt.kode === kode));
	const behandlingTyperIkkePunsj = useMemo(
		() => behandlingTyper.filter((type) => !punsjBehandlingstyper.includes(type.kode)),
		[],
	);
	const behandlingTyperPunsj = useMemo(
		() => behandlingTyper.filter((type) => punsjBehandlingstyper.includes(type.kode)),
		[],
	);
	const [visPunsj, setVisPunsj] = useState<boolean>(
		valgteBehandlingstyper
			? valgteBehandlingstyper.some(
					(bt) => getKodeverkFraKode(bt, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) === punsjKodeverkNavn,
				)
			: false,
	);

	const sisteValgteBehandlingstyper: ValgtBehandlingstype[] = valgteBehandlingstyper.map((kode) => ({
		behandlingType: kode,
		checked: true,
	}));

	const oppdatereValgteBehandlingstyper = () => {
		lagreOppgavekoBehandlingstype({
			id: valgtOppgavekoId,
			behandlingsTyper: sisteValgteBehandlingstyper.filter((bt) => bt.checked),
		}).then(() => {
			hentOppgaveko(valgtOppgavekoId);
		});
	};

	const oppdaterBehandlingstype = (behandlingstype: string, checked: boolean) => {
		const index = sisteValgteBehandlingstyper.findIndex((bt) => bt.behandlingType === behandlingstype);
		if (index !== -1) {
			sisteValgteBehandlingstyper[index].checked = checked;
		} else {
			sisteValgteBehandlingstyper.push({ behandlingType: behandlingstype, checked });
		}
	};

	return (
		<>
			<BodyShort size="small" className={styles.label}>
				<FormattedMessage id="BehandlingstypeVelger.Behandlingstype" />
			</BodyShort>
			<VerticalSpacer eightPx />
			{behandlingTyperIkkePunsj.map((bt) => (
				<React.Fragment key={bt.kode}>
					<VerticalSpacer fourPx />
					<CheckboxField
						name={bt.kode}
						label={bt.navn}
						onChange={(isChecked) => {
							oppdaterBehandlingstype(bt.kode, isChecked);
							oppdatereValgteBehandlingstyper();
						}}
						checked={sisteValgteBehandlingstyper.some(
							(behandlingstype) => behandlingstype.behandlingType === bt.kode && behandlingstype.checked,
						)}
					/>
				</React.Fragment>
			))}

			<button type="button" className={styles.punsjVal} onClick={() => setVisPunsj(!visPunsj)}>
				<NavFrontendChevron type={visPunsj ? 'ned' : 'høyre'} />
				<BodyShort size="small" className={styles.punsjTekst}>
					Punsj
				</BodyShort>
			</button>

			{visPunsj && (
				<div className={styles.punsjUndervalg}>
					{behandlingTyperPunsj.map((bt) => (
						<React.Fragment key={bt.kode}>
							<VerticalSpacer fourPx />
							<CheckboxField
								name={bt.kode}
								label={bt.navn}
								onChange={(isChecked) => {
									oppdaterBehandlingstype(bt.kode, isChecked);
									oppdatereValgteBehandlingstyper();
								}}
								checked={sisteValgteBehandlingstyper.some(
									(behandlingstype) => behandlingstype.behandlingType === bt.kode && behandlingstype.checked,
								)}
							/>
						</React.Fragment>
					))}
				</div>
			)}
		</>
	);
};
export default BehandlingstypeVelger;
