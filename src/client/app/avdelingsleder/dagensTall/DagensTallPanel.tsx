import React, { FunctionComponent, useMemo } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { BodyShort } from '@navikt/ds-react';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import EnkelTeller from 'avdelingsleder/dagensTall/EnkelTeller';
import ApneBehandlinger from 'avdelingsleder/dagensTall/apneBehandlingerTsType';
import { behandlingstypeOrder, punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import behandlingType from 'kodeverk/behandlingType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverkFraKode, getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import * as styles from './dagensTallPanel.css';

interface OwnProps {
	totaltIdag: number;
	dagensTall: ApneBehandlinger[];
}

const DagensTallPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({ totaltIdag, dagensTall }) => {
	const sortedDagensTall = (tall: ApneBehandlinger[]) =>
		useMemo(
			() =>
				tall.sort(
					(dt1, dt2) =>
						behandlingstypeOrder.indexOf(dt1.behandlingType) - behandlingstypeOrder.indexOf(dt2.behandlingType),
				),
			[dagensTall],
		);

	const behandlingstyperSist = [];
	const behandlingstyperForst = [];
	const behandlingsKoderSomSkalVisesForst = [
		behandlingType.ANKE,
		behandlingType.FORSTEGANGSSOKNAD,
		behandlingType.INNSYN,
		behandlingType.KLAGE,
		behandlingType.REVURDERING,
		behandlingType.TILBAKEBETALING,
	];

	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	const punsjBehandlinger = [];
	sortedDagensTall(dagensTall).forEach((dt) => {
		if (behandlingsKoderSomSkalVisesForst.includes(dt.behandlingType)) behandlingstyperForst.push(dt);
		else if (
			dt.behandlingType &&
			getKodeverkFraKode(dt.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) === punsjKodeverkNavn
		)
			punsjBehandlinger.push(dt);
		else behandlingstyperSist.push(dt);
	});

	const punsjTall = {
		antall: 0,
		behandlingType: 'Punsj',
	};

	punsjBehandlinger.forEach((behandlingstype) => {
		punsjTall.antall += behandlingstype.antall;
	});

	const dagensTallIRettRekkefoljd = [...behandlingstyperForst, ...behandlingstyperSist, punsjTall];

	const getTekst = (behandlingTypeFraDagensTall: string) => {
		const tekst = getKodeverknavnFraKode(behandlingTypeFraDagensTall, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk);
		if (tekst === 'Førstegangsbehandling') {
			return `Førstegangs-\
      behandling`;
		}
		return tekst;
	};

	return (
		<div>
			<BodyShort className={styles.header}>Status</BodyShort>
			<div className={styles.container}>
				<EnkelTeller antall={totaltIdag} tekst="Åpne behandlinger" />

				{dagensTall &&
					dagensTallIRettRekkefoljd.map((dt) => (
						<EnkelTeller
							key={
								dt.behandlingType === 'Punsj'
									? 'Punsj'
									: getKodeverknavnFraKode(dt.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk)
							}
							antall={dt.antall}
							tekst={dt.behandlingType === 'Punsj' ? 'Punsj' : getTekst(dt.behandlingType)}
						/>
					))}
			</div>
		</div>
	);
};

export default injectIntl(DagensTallPanel);
