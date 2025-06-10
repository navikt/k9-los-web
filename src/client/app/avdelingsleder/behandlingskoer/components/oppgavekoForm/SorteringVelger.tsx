import React, { FunctionComponent, useEffect, useState } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { Checkbox, Label } from '@navikt/ds-react';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import BelopSorteringValg from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/BelopSorteringValg';
import { Kriterie } from 'avdelingsleder/behandlingskoer/oppgavekoTsType';
import KoSortering from 'kodeverk/KoSortering';
import KoSorteringType from 'kodeverk/KoSorteringTsType';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import KriterierType from '../../../../types/KriterierType';
import DatoSorteringValg from './DatoSorteringValg';
import * as styles from './utvalgskriterierForOppgavekoForm.css';

interface OwnProps {
	intl: any;
	valgtOppgavekoId: string;
	fomDato: string;
	tomDato: string;
	kriterier: Kriterie[];
	hentOppgaveko: (id: string) => void;
}

/**
 * SorteringVelger
 */
const SorteringVelger: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	intl,
	valgtOppgavekoId,
	fomDato,
	tomDato,
	hentOppgaveko,
	kriterier,
}) => {
	const filtreringPåBelop = kriterier?.find((kriterie) => kriterie.kriterierType.kode === KriterierType.Feilutbetaling);
	const filtreringPåDato = fomDato && tomDato;
	const [valgtFiltrering, setValgtFiltrering] = useState<string[]>([]);

	useEffect(() => {
		setValgtFiltrering([]);
		if (filtreringPåBelop?.inkluder) {
			setValgtFiltrering((arr) => [...arr, KriterierType.Feilutbetaling]);
		} else if (filtreringPåDato) {
			setValgtFiltrering((arr) => [...arr, KoSortering.OPPRETT_BEHANDLING]);
		}
	}, [kriterier, fomDato, tomDato]);

	const { startRequest: lagreOppgavekoSorteringTidsintervallDato } = useRestApiRunner(
		K9LosApiKeys.LAGRE_OPPGAVEKO_SORTERING_TIDSINTERVALL_DATO,
	);
	const { startRequest: lagreOppgavekoKriterie } = useRestApiRunner(K9LosApiKeys.LAGRE_OPPGAVEKO_KRITERIER);

	const koSorteringer = useKodeverk<KoSorteringType>(kodeverkTyper.KO_SORTERING);
	const koKriterier = useKodeverk<KoSorteringType>(kodeverkTyper.KO_KRITERIER);

	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	const lagreFilteringBelopp = (fraBelop: number, tilBelop: number, fjerneBelop?: boolean) =>
		lagreOppgavekoKriterie({
			id: valgtOppgavekoId,
			kriterierType: KriterierType.Feilutbetaling,
			checked: fjerneBelop ? false : valgtFiltrering.includes(KriterierType.Feilutbetaling),
			fom: fraBelop,
			tom: tilBelop,
		}).then(() => {
			hentOppgaveko(valgtOppgavekoId);
		});

	const leggTilEllerFjerneFiltrering = (kode: string, checked: boolean) => {
		const tmpValgtFiltrering = [...valgtFiltrering];
		if (checked && !valgtFiltrering.includes(kode)) {
			tmpValgtFiltrering.push(kode);
		} else {
			const indexSomSkalFjernes = tmpValgtFiltrering.indexOf(kode);
			tmpValgtFiltrering.splice(indexSomSkalFjernes, 1);
		}
		setValgtFiltrering(tmpValgtFiltrering);
	};

	return (
		<>
			<Label size="small" className={styles.label}>
				<FormattedMessage id="FiltreringsVelger.Filtrering" />
			</Label>
			<VerticalSpacer eightPx />
			<div>
				{koSorteringer.map(
					(koSortering) =>
						koSortering.kode === 'OPPRBEH' && (
							<React.Fragment key={koSortering.kode}>
								<Checkbox
									value={koSortering.kode}
									data-testid={`kriterie-${koSortering.kode}`}
									checked
									onChange={(e) => leggTilEllerFjerneFiltrering(e.target.value, e.target.checked)}
								>
									{koSortering.felttype === 'DATO' && (
										<span className={styles.kriterierTitel}>
											{getKodeverknavnFraKode(koSortering.kode, kodeverkTyper.KO_SORTERING, alleKodeverk)}
										</span>
									)}
								</Checkbox>
								{koSortering.felttype === 'DATO' && (
									<DatoSorteringValg
										intl={intl}
										valgtOppgavekoId={valgtOppgavekoId}
										hentOppgaveko={hentOppgaveko}
										lagreOppgavekoSorteringTidsintervallDato={lagreOppgavekoSorteringTidsintervallDato}
										fomDato={fomDato}
										tomDato={tomDato}
									/>
								)}
							</React.Fragment>
						),
				)}

				{koKriterier
					.filter((kriterie) => kriterie.kode === KriterierType.Feilutbetaling)
					.map((koKriterie) => (
						<Checkbox
							key={koKriterie.kode}
							value={koKriterie.kode}
							data-testid={`kriterie-${koKriterie.kode}`}
							checked={valgtFiltrering.includes(koKriterie.kode)}
							onChange={(e) => {
								leggTilEllerFjerneFiltrering(e.target.value, e.target.checked);
								if (!e.target.checked) {
									lagreFilteringBelopp(0, 0, true);
								}
							}}
						>
							<span className={styles.kriterierTitel}>
								{getKodeverknavnFraKode(koKriterie.kode, kodeverkTyper.KO_KRITERIER, alleKodeverk)}
							</span>
							{koKriterie.felttype === 'BELOP' && valgtFiltrering.includes(koKriterie.kode) && (
								<BelopSorteringValg
									til={parseInt(filtreringPåBelop?.tom, 10) || 0}
									fra={parseInt(filtreringPåBelop?.fom, 10) || 0}
									lagreFilteringBelopp={lagreFilteringBelopp}
								/>
							)}
						</Checkbox>
					))}
			</div>
		</>
	);
};

export default injectIntl(SorteringVelger);
