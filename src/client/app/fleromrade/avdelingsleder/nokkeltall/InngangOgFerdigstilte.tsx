import { Box, Detail, Heading, HGrid, HStack, InlineMessage, Select, ToggleGroup, VStack } from '@navikt/ds-react';
import { useHentInngangOgFerdigstilte } from 'api/generated/los';
import dayjs from 'dayjs';
import { erIkkeImplementert, nøkkeltallQueryOptions } from 'fleromrade/api/nøkkeltallQueryOptions';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { useState } from 'react';
import Teller from './Teller';

const serieLabels: Record<string, string> = {
	idag: 'I dag',
	sisteUke: 'Siste uke',
	siste2Uker: 'Siste 2 uker',
	siste4Uker: 'Siste 4 uker',
};
const serieRekkefølge = Object.keys(serieLabels);

export default function InngangOgFerdigstilte() {
	const { urlSegment } = useOmråde();
	const { data, error } = useHentInngangOgFerdigstilte(urlSegment, { query: nøkkeltallQueryOptions });
	const [valgtHovedgruppe, setValgtHovedgruppe] = useState('ALLE');
	const [valgtSerie, setValgtSerie] = useState('siste4Uker');

	if (erIkkeImplementert(error)) return null;
	if (error) return <InlineMessage status="error">Kunne ikke hente inngang og ferdigstilte</InlineMessage>;
	if (!data) return null;

	const filtrerteTall = data.tall.filter(({ hovedgruppe }) => hovedgruppe === valgtHovedgruppe);
	const tilgjengeligeSerier =
		filtrerteTall.length > 0
			? Object.keys(filtrerteTall[0].serier).sort((a, b) => serieRekkefølge.indexOf(a) - serieRekkefølge.indexOf(b))
			: [];
	const aktivSerie = tilgjengeligeSerier.includes(valgtSerie) ? valgtSerie : tilgjengeligeSerier[0];

	return (
		<Box padding="space-16" borderWidth="1" borderColor="neutral">
			<VStack gap="space-16">
				<Heading size="small" level="2">
					Inngang og ferdigstilte
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
								value={valgtHovedgruppe}
								onChange={(event) => setValgtHovedgruppe(event.currentTarget.value)}
							>
								{data.hovedgrupper.map(({ kode, navn }) => (
									<option key={kode} value={kode}>
										{navn}
									</option>
								))}
							</Select>
							<ToggleGroup value={aktivSerie} onChange={setValgtSerie}>
								{tilgjengeligeSerier.map((key) => (
									<ToggleGroup.Item key={key} value={key} label={serieLabels[key] ?? key} />
								))}
							</ToggleGroup>
						</HStack>
						<HGrid gap="space-24" columns={{ xs: 1, md: 2, lg: 3, xl: 4 }}>
							{filtrerteTall.map(
								(value) =>
									value.serier[aktivSerie] && (
										<Teller
											key={value.undergruppe}
											forklaring={
												data.undergrupper.find(({ kode }) => kode === value.undergruppe)?.navn ?? value.undergruppe
											}
											tall={value.serier[aktivSerie]}
										/>
									),
							)}
						</HGrid>
					</>
				)}
			</VStack>
		</Box>
	);
}
