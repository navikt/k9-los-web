import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Detail, HGrid, HStack, Heading, Select, ToggleGroup } from '@navikt/ds-react';
import { useHentDagensTall } from 'api/queries/avdelingslederQueries';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Teller3 from './Teller3';

const serieLabels: Record<string, string> = {
	idag: 'I dag',
	siste7Dager: 'Siste 7 dager',
	siste14Dager: 'Siste 14 dager',
	siste28Dager: 'Siste 28 dager',
};

export default function DagensTall() {
	const [valgtHovedgruppe, setValgtHovedgruppe] = useState('ALLE');
	const { data } = useHentDagensTall();
	const [valgtSerie, setValgtSerie] = useState('idag');

	// Henter alltid fra direkte fra cache, så bruker kort tid på loading
	if (data === undefined) return null;

	const filtrerteTall = data.tall.filter(({ hovedgruppe }) => hovedgruppe === valgtHovedgruppe);
	const tilgjengeligeSerier = filtrerteTall.length > 0 ? Object.keys(filtrerteTall[0].serier) : [];
	const aktivSerie = tilgjengeligeSerier.includes(valgtSerie) ? valgtSerie : tilgjengeligeSerier[0];

	return (
        <Box padding="space-16" borderWidth="1" borderColor="neutral">
            <HStack align="center" justify="space-between">
				<Heading size="small">Dagens tall</Heading>
			</HStack>
            <VerticalSpacer eightPx />
            {!data.oppdatertTidspunkt && <p>Ingen data for øyeblikket</p>}
            {data.oppdatertTidspunkt && (
				<>
					<Detail>Oppdatert {dayjs(data.oppdatertTidspunkt).format('DD.MM.YYYY kl. HH:mm:ss')}</Detail>
					<HStack className="mt-4 mb-6" gap="space-16">
						<Select
							label="Valgt ytelse"
							hideLabel
							value={valgtHovedgruppe}
							onChange={(event) => setValgtHovedgruppe(event.currentTarget.value)}
						>
							{data.hovedgrupper?.map(({ kode, navn }) => (
								<option key={kode} value={kode}>
									{navn}
								</option>
							))}
						</Select>
						<ToggleGroup value={aktivSerie} onChange={(nySerie) => setValgtSerie(nySerie)}>
							{tilgjengeligeSerier.map((key) => (
								<ToggleGroup.Item key={key} value={key} label={serieLabels[key] ?? key} />
							))}
						</ToggleGroup>
					</HStack>
					<HGrid gap="space-24" columns={{ md: 2, lg: 3, xl: 4 }}>
						{filtrerteTall.map((value) => (
							<Teller3
								key={value.undergruppe}
								forklaring={data.undergrupper.find(({ kode }) => kode === value.undergruppe).navn}
								tall={value.serier[aktivSerie]}
							/>
						))}
					</HGrid>
				</>
			)}
        </Box>
    );
}
