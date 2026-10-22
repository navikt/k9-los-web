import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { Heading, HelpText, HStack, InlineMessage, Select, VStack } from '@navikt/ds-react';
import { keepPreviousData } from '@tanstack/react-query';
import { useHentSaksbehandlerNøkkeltall } from 'api/generated/los';
import dayjs from 'dayjs';
import type { EChartsOption } from 'echarts';
import { erIkkeImplementert, nøkkeltallQueryOptions } from 'fleromrade/api/nøkkeltallQueryOptions';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { useState } from 'react';
import { graferOpacity, grafHeight, legendStyle } from '../../../../styles/echartStyle';

function Nøkkeltall() {
	const { urlSegment } = useOmråde();
	const [gruppe, setGruppe] = useState('ALLE');
	const { data, error } = useHentSaksbehandlerNøkkeltall(
		urlSegment,
		{ gruppe },
		{ query: { ...nøkkeltallQueryOptions, placeholderData: keepPreviousData } },
	);

	if (erIkkeImplementert(error)) return null;
	if (error) return <InlineMessage status="error">Kunne ikke hente nye og ferdigstilte oppgaver</InlineMessage>;
	if (!data) return null;

	const chartOption: EChartsOption = {
		tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
		legend: legendStyle,
		xAxis: { type: 'category', data: data.kolonner, axisTick: { alignWithLabel: true } },
		yAxis: {},
		series: data.serier.map((serie) => ({
			type: 'line',
			name: serie.navn,
			data: serie.data,
			emphasis: { focus: 'series' },
			areaStyle: { opacity: graferOpacity },
		})),
	};

	return (
		<VStack gap="space-16">
			<HStack gap="space-8" align="center">
				<Heading size="xsmall" level="2">
					Nye og ferdigstilte oppgaver siste 7 dager
				</Heading>
				{data.oppdatertTidspunkt && (
					<HelpText title="Om nøkkeltallene">
						Tallene oppdateres periodisk. Sist oppdatert{' '}
						{dayjs(data.oppdatertTidspunkt).format('DD.MM.YYYY kl. HH:mm:ss')}.
					</HelpText>
				)}
			</HStack>
			<Select
				size="small"
				label="Valgt ytelse"
				hideLabel
				value={gruppe}
				onChange={(event) => setGruppe(event.currentTarget.value)}
				style={{ width: 'auto' }}
			>
				{data.grupper.map(({ kode, navn }) => (
					<option key={kode} value={kode}>
						{navn}
					</option>
				))}
			</Select>
			<ReactECharts option={chartOption} height={grafHeight} />
		</VStack>
	);
}

export default function SaksbehandlerNøkkeltall() {
	const { urlSegment } = useOmråde();
	return <Nøkkeltall key={urlSegment} />;
}
