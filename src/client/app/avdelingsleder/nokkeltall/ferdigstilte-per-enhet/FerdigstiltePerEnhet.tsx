import React, { useState } from 'react';
import dayjs from 'dayjs';
import { EChartsOption } from 'echarts';
import { Box, Detail, HStack, Heading, Select, Tag, ToggleGroup } from '@navikt/ds-react';
import { useHentFerdigstiltePerEnhet } from 'api/queries/avdelingslederQueries';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { grafHeight } from '../../../../styles/echartStyle';

export default function FerdigstiltePerEnhet() {
	const [gruppe, setGruppe] = useState('ALLE');
	const [uker, setUker] = useState('2');
	const { data } = useHentFerdigstiltePerEnhet({
		gruppe,
		uker,
	});

	// Henter alltid fra direkte fra cache, så bruker kort tid på loading
	if (data === undefined) return null;

	const chartOption: EChartsOption = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
			},
		},
		legend: {},
		xAxis: {
			type: 'category',
			data: data.kolonner,
			axisTick: {
				alignWithLabel: true,
			},
		},
		yAxis: {
			type: 'value',
		},
		series: data.serier.map((serie) => ({
			type: 'bar',
			name: serie.navn,
			data: serie.data,
			emphasis: {
				focus: 'series',
			},
		})),
	};

	return (
		<Box padding="4" borderWidth="1" borderColor="border-default">
			<Heading size="small">Ferdigstilte behandlinger og oppgaver per enhet</Heading>
			<VerticalSpacer eightPx />
			{!data.oppdatertTidspunkt && <p>Ingen data for øyeblikket</p>}
			{data.oppdatertTidspunkt && (
				<>
					<Detail>Oppdatert {dayjs(data.oppdatertTidspunkt).format('DD.MM.YYYY kl. HH:mm:ss')}</Detail>
					<VerticalSpacer eightPx />
					<HStack className="mt-4 mb-6" gap="4">
						<Select
							label="Valgt ytelse"
							hideLabel
							value={gruppe}
							onChange={({ currentTarget: { value: nyGruppe } }) => setGruppe(nyGruppe)}
						>
							{data.grupper.map(({ kode, navn }) => (
								<option key={kode} value={kode}>
									{navn}
								</option>
							))}
						</Select>
						<ToggleGroup value={uker} onChange={(nyVerdi) => setUker(nyVerdi)}>
							<ToggleGroup.Item value="2" label="Siste 2 uker" />
							<ToggleGroup.Item value="4" label="Siste 4 uker" />
						</ToggleGroup>
					</HStack>
					<VerticalSpacer eightPx />
					<ReactECharts option={chartOption} height={grafHeight} />
				</>
			)}
		</Box>
	);
}
