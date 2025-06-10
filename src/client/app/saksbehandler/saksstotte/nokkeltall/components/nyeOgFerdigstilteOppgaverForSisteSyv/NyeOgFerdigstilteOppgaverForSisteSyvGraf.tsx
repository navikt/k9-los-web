import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import dayjs from 'dayjs';
import { BodyShort } from '@navikt/ds-react';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { momentDateFormat } from 'utils/dateUtils';
import {
	fargerForLegendsForMineNyeFerdigstilte,
	graferOpacity,
	gridDef,
	legendStyle,
	tooltipTextStyle,
	yAxisDef,
	yXAxisFontSizeSaksbehandlerNokkeltall,
} from '../../../../../../styles/echartStyle';

interface OwnProps {
	height: number;
	nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

export const slaSammenBehandlingstyperOgFyllInnTomme = (
	nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[],
): { antallNye: number; antallFerdigstilte: number; antallFerdigstilteMine: number; dato: Date }[] => {
	const oppgaver = [];
	if (nyeOgFerdigstilteOppgaver.length > 0) {
		const iDag = dayjs().startOf('day');
		const atteDagerSiden = dayjs().subtract(7, 'days').startOf('day');

		for (let dato = atteDagerSiden; dato.isBefore(iDag); dato = dato.add(1, 'days')) {
			const dataForDato = nyeOgFerdigstilteOppgaver.filter((o) => dayjs(o.dato).startOf('day').isSame(dato));
			if (dataForDato.length === 0) {
				oppgaver.push({
					antallNye: 0,
					antallFerdigstilte: 0,
					antallFerdigstilteMine: 0,
					dato: dato.toDate(),
				});
			} else {
				oppgaver.push({
					antallNye: dataForDato.reduce((acc, d) => acc + d.antallNye, 0),
					antallFerdigstilte: dataForDato.reduce((acc, d) => acc + d.antallFerdigstilte, 0),
					antallFerdigstilteMine: dataForDato.reduce((acc, d) => acc + d.antallFerdigstilteMine, 0),
					dato: dato.toDate(),
				});
			}
		}
	}

	return oppgaver;
};

/**
 * NyeOgFerdigstilteOppgaverForSisteSyvGraf
 */
const NyeOgFerdigstilteOppgaverForSisteSyvGraf: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	intl,
	height,
	nyeOgFerdigstilteOppgaver,
}) => {
	const ferdigLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForSisteSyvGraf.Ferdigstilte' });
	const nyLabel = intl.formatMessage({ id: 'NyeOgFerdigstilteOppgaverForSisteSyvGraf.Nye' });

	const sammenslatteOppgaver = useMemo(
		() => slaSammenBehandlingstyperOgFyllInnTomme(nyeOgFerdigstilteOppgaver),
		[nyeOgFerdigstilteOppgaver],
	);
	const ferdigstilteOppgaver = useMemo(
		() => sammenslatteOppgaver.map((o) => [o.dato.getTime(), o.antallFerdigstilte]),
		[sammenslatteOppgaver],
	);
	const nyeOppgaver = useMemo(
		() => sammenslatteOppgaver.map((o) => [o.dato.getTime(), o.antallNye]),
		[sammenslatteOppgaver],
	);

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
			height={height}
			option={{
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line',
						lineStyle: {
							type: 'solid',
						},
						label: {
							formatter: (params) => {
								if (params.axisDimension === 'y') {
									return parseInt(params.value as string, 10).toString();
								}
								return momentDateFormat(params.value as string);
							},
						},
					},
					textStyle: tooltipTextStyle,
				},
				legend: {
					...legendStyle,
					data: [nyLabel, ferdigLabel],
				},
				grid: gridDef,
				xAxis: [
					{
						type: 'time',
						axisLabel: {
							formatter: '{dd}.{MM}',
							fontSize: yXAxisFontSizeSaksbehandlerNokkeltall,
							margin: 15,
						},
						splitLine: {
							show: true,
						},
					},
				],
				yAxis: yAxisDef,
				series: [
					{
						name: nyLabel,
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						data: nyeOppgaver,
						color: fargerForLegendsForMineNyeFerdigstilte[0],
						areaStyle: {
							opacity: graferOpacity,
						},
					},
					{
						name: ferdigLabel,
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						data: ferdigstilteOppgaver,
						color: fargerForLegendsForMineNyeFerdigstilte[1],
						areaStyle: {
							opacity: graferOpacity,
						},
					},
				],
			}}
		/>
	);
};

export default injectIntl(NyeOgFerdigstilteOppgaverForSisteSyvGraf);
