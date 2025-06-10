import React, { FunctionComponent, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { BodyShort } from '@navikt/ds-react';
import HistoriskData from 'avdelingsleder/nokkeltall/historiskDataTsType';
import { behandlingstypeOrder } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import behandlingType from 'kodeverk/behandlingType';
import KodeverkMedNavn from 'kodeverk/kodeverkMedNavnTsType';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { dateFormat } from 'utils/dateUtils';
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
import Koordinat from '../../types/Koordinat';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const behandlingstypeFarger = {
	[behandlingType.FORSTEGANGSSOKNAD]: '#0067C5',
	[behandlingType.REVURDERING]: '#66CBEC',
	// [behandlingType.ANKE]: '#BA3A26',
	[behandlingType.INNSYN]: '#FF9100',
	// [behandlingType.KLAGE]: '#634689',
	[behandlingType.TILBAKEBETALING]: '#06893A',
};

// Denne bestemmer rekkeföljd på graferna. Alltså forstegangssoknad skal lengst bak etc. Klage og anke er utkommentert då det ikke skal vises nå.
const behandlingstyperSomSkalVises = [
	behandlingType.FORSTEGANGSSOKNAD,
	behandlingType.REVURDERING,
	behandlingType.TILBAKEBETALING,
	behandlingType.INNSYN,
	// [behandlingType.ANKE]: '#BA3A26',
	// [behandlingType.KLAGE]: '#634689',
];

const sorterBehandlingtyper = (b1, b2) => {
	const index1 = behandlingstypeOrder.indexOf(b1);
	const index2 = behandlingstypeOrder.indexOf(b2);
	if (index1 === index2) {
		return 0;
	}
	return index1 > index2 ? -1 : 1;
};

const konverterTilKoordinaterGruppertPaBehandlingstype = (
	oppgaverForAvdeling: HistoriskData[],
): Record<string, Koordinat[]> =>
	oppgaverForAvdeling.reduce(
		(acc, o) => {
			const nyKoordinat = {
				x: dayjs(o.dato).startOf('day').toDate(),
				y: o.antall,
			};

			const eksisterendeKoordinater = acc[o.behandlingType];

			return {
				...acc,
				[o.behandlingType]: eksisterendeKoordinater ? eksisterendeKoordinater.concat(nyKoordinat) : [nyKoordinat],
			};
		},
		{} as Record<string, Koordinat[]>,
	);

const fyllInnManglendeDatoerOgSorterEtterDato = (
	data: Record<string, Koordinat[]>,
	periodeStart: dayjs.Dayjs,
	periodeSlutt: dayjs.Dayjs,
): Record<string, Date[][]> =>
	Object.keys(data).reduce((acc, behandlingstype) => {
		const behandlingstypeData = data[behandlingstype];

		const koordinater = [];

		for (let dato = dayjs(periodeStart); dato.isSameOrBefore(periodeSlutt); dato = dato.add(1, 'days')) {
			const funnetDato = behandlingstypeData.find((d) => dayjs(d.x).startOf('day').isSame(dato.startOf('day')));
			koordinater.push(
				funnetDato ? [dayjs(funnetDato.x).format(ISO_DATE_FORMAT), funnetDato.y] : [dato.format(ISO_DATE_FORMAT), 0],
			);
		}

		return {
			...acc,
			[behandlingstype]: koordinater,
		};
	}, {});

const finnBehandlingTypeNavn = (behandlingTyper, behandlingTypeKode: string) => {
	const type = behandlingTyper.find((bt) => bt.kode === behandlingTypeKode);
	return type ? type.navn : '';
};

interface OwnProps {
	behandlingTyper: KodeverkMedNavn[];
	historiskData: HistoriskData[];
	isFireUkerValgt: boolean;
}

export const lagKoordinater = (oppgaverPerForsteStonadsdag): Koordinat[] =>
	oppgaverPerForsteStonadsdag.map((o) => ({
		x: dayjs(o.dato).startOf('day').toDate().getTime(),
		y: o.antall,
	}));
/**
 * TilBehandlingGraf.
 */
const HistorikkGraf: FunctionComponent<OwnProps> = ({ historiskData, isFireUkerValgt, behandlingTyper }) => {
	const periodeStart = dayjs().subtract(isFireUkerValgt ? 4 : 2, 'w');
	const periodeSlutt = dayjs().subtract(1, 'd');

	const oppgaverInomValgtPeriode: HistoriskData[] = historiskData.filter(
		(oppgave) =>
			oppgave.antall > 0 &&
			dayjs(oppgave.dato).isSameOrBefore(periodeSlutt, 'day') &&
			dayjs(oppgave.dato).isSameOrAfter(periodeStart, 'day'),
	);

	const koordinater = useMemo(
		() => konverterTilKoordinaterGruppertPaBehandlingstype(oppgaverInomValgtPeriode),
		[historiskData],
	);
	const data = useMemo(
		() => fyllInnManglendeDatoerOgSorterEtterDato(koordinater, periodeStart, periodeSlutt),
		[koordinater, periodeStart, periodeSlutt],
	);

	const alleBehandlingstyperSortert = behandlingstyperSomSkalVises;
	const sorterteBehandlingstyper = Object.keys(data).sort(sorterBehandlingtyper);
	const reversertSorterteBehandlingstyper = sorterteBehandlingstyper.slice().reverse();

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
								return dateFormat(params.value as string);
							},
						},
					},
					textStyle: tooltipTextStyle,
				},
				legend: {
					...legendStyle,
					data: reversertSorterteBehandlingstyper.map((type) => finnBehandlingTypeNavn(behandlingTyper, type)),
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
				series: alleBehandlingstyperSortert.map((type) => ({
					name: finnBehandlingTypeNavn(behandlingTyper, type),
					type: 'line',
					emphasis: {
						focus: 'series',
					},
					...seriesStyleAvdelningslederNokkeltall,
					data: data[type],
					color: behandlingstypeFarger[type],
					areaStyle: {
						opacity: graferOpacity,
					},
				})),
			}}
		/>
	);
};

export default HistorikkGraf;
