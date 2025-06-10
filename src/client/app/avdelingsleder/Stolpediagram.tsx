import React from 'react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { defaultFontSize, grafHeight, legendStyle } from '../../styles/echartStyle';
import AksjonspunkterPerEnhetType from './nokkeltall/AksjonspunkterPerEnhetType';
import HistoriskData from './nokkeltall/historiskDataTsType';

dayjs.extend(customParseFormat);

interface OwnProps {
	series: IStolpediagramSerie[];
	labels: string[];
	uker: string;
	fremITid?: boolean;
	legendColors?: string[] | { [key: string]: string };
}
interface IStolpediagramSerie {
	name: string;
	itemStyle?: {
		color: string;
	};
	data: HistoriskData[] | AksjonspunkterPerEnhetType[];
}

const mapAntallTilRiktigDato = (data, datoer) => {
	const reducer = (previousValue, currentValue) => previousValue + currentValue;
	return datoer.map((dato) =>
		data
			.filter((v) => dato.isSame(dayjs(v.dato, 'YYYY-MM-DD'), 'day'))
			.map((v) => v.antall)
			.reduce(reducer, 0),
	);
};

const datoTilbakeITid = (daysObject, index, array) => daysObject.subtract(array.length - index, 'days');
const datoFremITid = (daysObject, index) => daysObject.add(index, 'days');

const Stolpediagram = ({ series, labels, legendColors = [], fremITid = false, uker = '2' }: OwnProps) => {
	const intl = useIntl();
	if (!series.length) {
		 
		return <p className="typo-normal">{intl.formatMessage({ id: 'InngangOgFerdigstiltePanel.IngenTall' })} </p>;
	}
	const antallDager = Number(uker) * 7;
	const datoer = Array(antallDager)
		.fill(dayjs())
		.map(fremITid ? datoFremITid : datoTilbakeITid);

	const option = {
		grid: {
			top: '10%',
			left: '1%',
			right: '3%',
			bottom: '30%',
			containLabel: true,
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'line',
				lineStyle: {
					type: 'solid',
				},
				label: {
					formatter: ({ value }) => `${value}.${dayjs().format('YYYY')}`,
				},
			},
		},
		legend: {
			data: labels,
			...legendStyle,
		},
		xAxis: [
			{
				type: 'category',
				axisTick: {
					alignWithLabel: true,
				},
				axisLabel: { fontSize: defaultFontSize },
				data: datoer.map((dato) => dato.format('DD.MM')),
			},
		],
		yAxis: { axisLabel: { fontSize: defaultFontSize } },
		series: series.map((serie, index) => ({
			...serie,
			data: mapAntallTilRiktigDato(serie.data, datoer),
			itemStyle: serie.itemStyle || { color: legendColors[index] },
		})),
	};
	return <ReactECharts height={grafHeight} option={option} />;
};

export default Stolpediagram;
