import React, { useState } from 'react';
import dayjs from 'dayjs';
import { EChartsOption } from 'echarts';
import { HStack, Heading, HelpText, Select } from '@navikt/ds-react';
import { useHentNyeOgFerdigstilteSisteSyvDager } from 'api/queries/saksbehandlerQueries';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { grafHeight, graferOpacity, legendStyle } from '../../../../styles/echartStyle';

export default function SaksbehandlerNøkkeltall() {
	const [gruppe, setGruppe] = useState('ALLE');
	const { data, isSuccess } = useHentNyeOgFerdigstilteSisteSyvDager(gruppe);

	if (!isSuccess) return null;

	const chartOption: EChartsOption = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: legendStyle,
		xAxis: {
			type: 'category',
			data: data.kolonner,
			axisTick: {
				alignWithLabel: true,
			},
		},
		yAxis: {},
		series: data.serier.map((serie) => ({
			type: 'line',
			name: serie.navn,
			data: serie.data,
			emphasis: {
				focus: 'series',
			},
			areaStyle: {
				opacity: graferOpacity,
			},
		})),
	};

	return (
		<div>
			<Heading size="xsmall">
				<HStack gap="2">
					<span>Nye og ferdigstilte oppgaver siste 7 dager</span>
					<HelpText>
						Tallene oppdateres periodisk. Sist oppdatert{' '}
						{dayjs(data.oppdatertTidspunkt).format('DD.MM.YYYY kl. HH:mm:ss')}.
					</HelpText>
				</HStack>
			</Heading>
			<VerticalSpacer sixteenPx />
			<Select
				size="small"
				label="Valgt ytelse"
				hideLabel
				value={gruppe}
				onChange={({ currentTarget: { value: nyGruppe } }) => setGruppe(nyGruppe)}
				style={{ width: 'auto' }}
			>
				{data.grupper.map(({ kode, navn }) => (
					<option key={kode} value={kode}>
						{navn}
					</option>
				))}
			</Select>
			<ReactECharts option={chartOption} height={grafHeight} />
		</div>
	);
}
