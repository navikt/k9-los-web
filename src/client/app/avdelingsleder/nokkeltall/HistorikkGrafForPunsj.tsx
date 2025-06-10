import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { BodyShort } from '@navikt/ds-react';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { momentDateFormat } from 'utils/dateUtils';
import { ISO_DATE_FORMAT } from 'utils/formats';
import {
	eChartXAxisTickDefAvdelningslederNokkeltall,
	grafHeight,
	graferOpacity,
	gridDef,
	legendStyle,
	seriesStyleAvdelningslederNokkeltall,
	tooltipTextStyle,
	xAxisFontSizeAvdelningslederNokkeltall,
	yAxisFontSizeAvdelningslederNokkeltall,
	yAxisMarginTextBarAvdelningslederNokkeltall,
} from '../../../styles/echartStyle';
import useKodeverk from '../../api/rest-api-hooks/src/global-data/useKodeverk';
import Koordinat from '../../types/Koordinat';
import omsorgsdagerYtelsetyper from '../../types/OmsorgsdagerYtelsetyper';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const samletNavnForOmsorgsdager = 'OMD';
const fagytelseTyperFarger = {
	[fagsakYtelseType.PLEIEPENGER_SYKT_BARN]: '#0067C5',
	[fagsakYtelseType.OMSORGSPENGER]: '#66CBEC',
	[samletNavnForOmsorgsdager]: '#FF9100',
};

export const fagytelseTyperSomSkalVises = [
	fagsakYtelseType.PLEIEPENGER_SYKT_BARN,
	fagsakYtelseType.OMSORGSPENGER,
	samletNavnForOmsorgsdager,
];

const konverterTilKoordinaterGruppertPaFagytelsetype = (
	oppgaverForAvdeling: HistoriskData[],
): Record<string, Koordinat[]> =>
	oppgaverForAvdeling.reduce(
		(acc, o) => {
			const nyKoordinat = {
				x: dayjs(o.dato).startOf('day').toDate(),
				y: o.antall,
			};

			if (omsorgsdagerYtelsetyper.includes(o.fagsakYtelseType)) {
				const eksisterendeKoordinater = acc[samletNavnForOmsorgsdager];

				return {
					...acc,
					[samletNavnForOmsorgsdager]: eksisterendeKoordinater
						? eksisterendeKoordinater.concat(nyKoordinat)
						: [nyKoordinat],
				};
			}

			const eksisterendeKoordinater = acc[o.fagsakYtelseType];

			return {
				...acc,
				[o.fagsakYtelseType]: eksisterendeKoordinater ? eksisterendeKoordinater.concat(nyKoordinat) : [nyKoordinat],
			};
		},
		{} as Record<string, Koordinat[]>,
	);

const fyllInnManglendeDatoerOgSorterEtterDato = (
	data: Record<string, Koordinat[]>,
	periodeStart: dayjs.Dayjs,
	periodeSlutt: dayjs.Dayjs,
): Record<string, Date[][]> =>
	Object.keys(data).reduce((acc, fagytelsetype) => {
		const fagytelsetypeData = data[fagytelsetype];
		const koordinater = [];

		for (let dato = dayjs(periodeStart); dato.isSameOrBefore(periodeSlutt, 'day'); dato = dato.add(1, 'days')) {
			const funnetDato = fagytelsetypeData.find((d) => dayjs(d.x).startOf('day').isSame(dato.startOf('day')));
			koordinater.push(
				funnetDato ? [dayjs(funnetDato.x).format(ISO_DATE_FORMAT), funnetDato.y] : [dato.format(ISO_DATE_FORMAT), 0],
			);
		}

		return {
			...acc,
			[fagytelsetype]: koordinater,
		};
	}, {});

const finnFagytelsetypeNavn = (fagytelseTyper, fagytelsetypeKode: string) => {
	const type = fagytelseTyper.find((bt) => bt.kode === fagytelsetypeKode);
	if (fagytelsetypeKode === samletNavnForOmsorgsdager) {
		return 'Omsorgsdager';
	}
	return type ? type.navn : '';
};

interface OwnProps {
	historiskData: HistoriskData[];
	isFireUkerValgt: boolean;
}

/**
 * TilBehandlingGraf.
 */
const HistorikkGrafForPunsj: FunctionComponent<OwnProps> = ({ historiskData, isFireUkerValgt }) => {
	const fagytelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);
	const periodeStart = dayjs().subtract(isFireUkerValgt ? 4 : 2, 'w');
	const periodeSlutt = dayjs().subtract(1, 'd');
	const oppgaverInomValgtPeriode: HistoriskData[] = historiskData.filter(
		(oppgave) =>
			oppgave.antall > 0 &&
			dayjs(oppgave.dato).isSameOrBefore(periodeSlutt, 'day') &&
			dayjs(oppgave.dato).isSameOrAfter(periodeStart, 'day'),
	);

	const koordinater = useMemo(
		() => konverterTilKoordinaterGruppertPaFagytelsetype(oppgaverInomValgtPeriode),
		[historiskData],
	);
	const data = useMemo(
		() => fyllInnManglendeDatoerOgSorterEtterDato(koordinater, periodeStart, periodeSlutt),
		[koordinater, periodeStart, periodeSlutt],
	);

	if (oppgaverInomValgtPeriode.length === 0) {
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
			height={grafHeight}
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
					data: fagytelseTyperSomSkalVises.map((type) => finnFagytelsetypeNavn(fagytelseTyper, type)),
				},
				grid: gridDef,
				xAxis: [
					{
						// bruker category istedet for time for att vise alle dato og ikke bara hvert femte.
						type: 'category',
						// boundaryGap ser till att dato hamnar på en linje istället for mellom.
						boundaryGap: false,
						axisTick: eChartXAxisTickDefAvdelningslederNokkeltall,
						axisLabel: {
							// viser månad og dato dersom det er valgt fire uker og dato dersom åtte uker er valgt.
							formatter(value) {
								const oppstykketDato = value.split('-');
								if (oppstykketDato[1] && oppstykketDato[2]) {
									return `${oppstykketDato[2]}.${oppstykketDato[1]}`;
								}
								return value;
							},
							fontSize: xAxisFontSizeAvdelningslederNokkeltall,
							margin: yAxisMarginTextBarAvdelningslederNokkeltall,
						},
						// Denne setter de horisontala linjerna sammen med axisTick.
						splitLine: {
							show: true,
						},
					},
				],
				yAxis: [
					{
						type: 'value',
						axisLabel: {
							fontSize: yAxisFontSizeAvdelningslederNokkeltall,
							margin: yAxisMarginTextBarAvdelningslederNokkeltall,
						},
					},
				],
				series: fagytelseTyperSomSkalVises.map((type) => ({
					name: finnFagytelsetypeNavn(fagytelseTyper, type),
					type: 'line',
					emphasis: {
						focus: 'series',
					},
					...seriesStyleAvdelningslederNokkeltall,
					data: data[type],
					color: fagytelseTyperFarger[type],
					areaStyle: {
						opacity: graferOpacity,
					},
				})),
			}}
		/>
	);
};

export default HistorikkGrafForPunsj;
