import ReactECharts from 'sharedComponents/echart/ReactEcharts';
import { Box, Detail, Heading, HStack, InlineMessage, Select, ToggleGroup, VStack } from '@navikt/ds-react';
import { useHentFerdigstiltePerEnhet } from 'api/generated/los';
import type { FerdigstiltePerEnhetGruppe } from 'api/generated/los.schemas';
import dayjs from 'dayjs';
import type { EChartsOption } from 'echarts';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { useState } from 'react';
import { grafHeight } from '../../../../styles/echartStyle';
import { erIkkeImplementert, nøkkeltallQueryOptions } from './nøkkeltallQueryOptions';

export default function FerdigstiltePerEnhet() {
	const { urlSegment } = useOmråde();
	const [gruppe, setGruppe] = useState<FerdigstiltePerEnhetGruppe>('ALLE');
	const [uker, setUker] = useState('2');
	const { data, error } = useHentFerdigstiltePerEnhet(
		urlSegment,
		{ gruppe, uker: Number(uker) },
		{ query: nøkkeltallQueryOptions },
	);

	if (erIkkeImplementert(error)) return null;
	if (error) return <InlineMessage status="error">Kunne ikke hente ferdigstilte per enhet</InlineMessage>;
	if (!data) return null;

	const chartOption: EChartsOption = {
		tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
		legend: {},
		xAxis: { type: 'category', data: data.kolonner, axisTick: { alignWithLabel: true } },
		yAxis: { type: 'value' },
		series: data.serier.map((serie) => ({
			type: 'bar',
			name: serie.navn,
			data: serie.data,
			emphasis: { focus: 'series' },
		})),
	};

	return (
		<Box padding="space-16" borderWidth="1" borderColor="neutral">
			<VStack gap="space-16">
				<Heading size="small" level="2">
					Ferdigstilte behandlinger og oppgaver per enhet
				</Heading>
				{!data.oppdatertTidspunkt ? (
					<p>Ingen data for øyeblikket</p>
				) : (
					<>
						<Detail>Oppdatert {dayjs(data.oppdatertTidspunkt).format('DD.MM.YYYY kl. HH:mm:ss')}</Detail>
						<HStack gap="space-16">
							<Select
								label="Valgt ytelse"
								hideLabel
								value={gruppe}
								onChange={(event) => {
									const valgtGruppe = data.grupper.find(({ kode }) => kode === event.currentTarget.value);
									if (valgtGruppe) setGruppe(valgtGruppe.kode as FerdigstiltePerEnhetGruppe);
								}}
							>
								{data.grupper.map(({ kode, navn }) => (
									<option key={kode} value={kode}>
										{navn}
									</option>
								))}
							</Select>
							<ToggleGroup value={uker} onChange={setUker}>
								<ToggleGroup.Item value="2" label="Siste 2 uker" />
								<ToggleGroup.Item value="4" label="Siste 4 uker" />
							</ToggleGroup>
						</HStack>
						<ReactECharts option={chartOption} height={grafHeight} />
					</>
				)}
			</VStack>
		</Box>
	);
}
