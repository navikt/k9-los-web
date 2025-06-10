import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { BodyShort } from '@navikt/ds-react';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData, useKodeverk } from 'api/rest-api-hooks';
import { fagytelseTyperSomSkalVises } from 'avdelingsleder/nokkeltall/HistorikkGrafForPunsj';
import { punsjKodeverkNavn } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import behandlingType from 'kodeverk/behandlingType';
import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { getKodeverkFraKode } from 'utils/kodeverkUtils';
import {
	fargerForLegendsForMineNyeFerdigstilte,
	gridDef,
	legendStyle,
	maxBarWith,
	tooltipTextStyle,
	yXAxisFontSizeSaksbehandlerNokkeltall,
} from '../../../../../../styles/echartStyle';
import NyeOgFerdigstilteOppgaver from '../nyeOgFerdigstilteOppgaverTsType';

const behandlingstypeOrder = [
	behandlingType.TILBAKEBETALING,
	behandlingType.INNSYN,
	// behandlingType.ANKE,
	// behandlingType.KLAGE,
	behandlingType.REVURDERING,
	behandlingType.FORSTEGANGSSOKNAD,
];

interface OwnProps {
	behandlingTyper: KodeverkMedNavn[];
	nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
	skalPunsjbehandlingerVises: boolean;
}

/**
 * NyeOgFerdigstilteOppgaverForIdagGraf
 */
const NyeOgFerdigstilteOppgaverForIdagGraf: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	intl,
	nyeOgFerdigstilteOppgaver,
	behandlingTyper,
	skalPunsjbehandlingerVises,
}) => {
	const fagytelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);
	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	const behandlingTypeNavnForYAkse = useMemo(() => {
		if (skalPunsjbehandlingerVises) {
			return fagytelseTyperSomSkalVises.map((t) => {
				const type = fagytelseTyper.find((ytelse) => ytelse.kode === t);
				return type ? type.navn : '';
			});
		}
		return behandlingstypeOrder.map((bType) => {
			if (bType === behandlingType.FORSTEGANGSSOKNAD) {
				return intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Førstegangsbehandling' });
			}
			const type = behandlingTyper.find((bt) => bt.kode === bType);
			return type ? type.navn : '';
		});
	}, [behandlingTyper, skalPunsjbehandlingerVises]);

	const ferdigLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Ferdigstilte' });
	const nyLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForIdagGraf.Nye' });

	const filtrereUtRelevanteOppgaver = (valgtProperty: string): number[] => {
		if (skalPunsjbehandlingerVises) {
			return fagytelseTyperSomSkalVises.map((type) => {
				const oppgave = nyeOgFerdigstilteOppgaver.find(
					(o) =>
						o.fagsakYtelseType === type &&
						getKodeverkFraKode(o.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) === punsjKodeverkNavn,
				);

				if (oppgave) {
					return oppgave[valgtProperty];
				}
				return 0;
			});
		}

		return behandlingstypeOrder.map((type) => {
			const oppgave = nyeOgFerdigstilteOppgaver.find(
				(o) =>
					o.behandlingType === type &&
					getKodeverkFraKode(o.behandlingType, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk) !== punsjKodeverkNavn,
			);
			if (oppgave) {
				return oppgave[valgtProperty];
			}
			return 0;
		});
	};

	const dataFerdigstilte = useMemo(
		() => filtrereUtRelevanteOppgaver('antallFerdigstilte'),
		[nyeOgFerdigstilteOppgaver],
	);
	const dataNye = useMemo(() => filtrereUtRelevanteOppgaver('antallNye'), [nyeOgFerdigstilteOppgaver]);

	if (nyeOgFerdigstilteOppgaver.length === 0) {
		return (
			<div>
				<BodyShort size="small">
					<FormattedMessage id="InngangOgFerdigstiltePanel.IngenTall" />
				</BodyShort>
			</div>
		);
	}

	return (
		<ReactECharts
			height={230}
			option={{
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
					textStyle: tooltipTextStyle,
				},
				legend: {
					...legendStyle,
					data: [nyLabel, ferdigLabel],
				},
				grid: gridDef,
				xAxis: {
					type: 'value',
					axisLabel: {
						fontSize: yXAxisFontSizeSaksbehandlerNokkeltall,
					},
					boundaryGap: [0, 0.01],
				},
				yAxis: {
					type: 'category',
					axisLabel: {
						fontSize: yXAxisFontSizeSaksbehandlerNokkeltall,
						margin: 15,
					},
					data: behandlingTypeNavnForYAkse,
				},
				series: [
					{
						name: nyLabel,
						type: 'bar',
						data: dataNye,
						barMaxWidth: maxBarWith,
						color: fargerForLegendsForMineNyeFerdigstilte[0],
					},
					{
						name: ferdigLabel,
						type: 'bar',
						data: dataFerdigstilte,
						barMaxWidth: maxBarWith,
						color: fargerForLegendsForMineNyeFerdigstilte[1],
					},
				],
			}}
		/>
	);
};

export default injectIntl(NyeOgFerdigstilteOppgaverForIdagGraf);
