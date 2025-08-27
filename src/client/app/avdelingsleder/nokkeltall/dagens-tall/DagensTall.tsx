import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Detail, HGrid, HStack, Heading, Select, ToggleGroup } from '@navikt/ds-react';
import { useHentDagensTall } from 'api/queries/avdelingslederQueries';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Teller3 from './Teller3';

export default function DagensTall() {
	const [valgtHovedgruppe, setValgtHovedgruppe] = useState('ALLE');
	const { data } = useHentDagensTall();
	const [tidsområde, setTidsområde] = useState('I_DAG');

	// Henter alltid fra direkte fra cache, så bruker kort tid på loading
	if (data === undefined) return null;

	return (
		<Box padding="4" borderWidth="1" borderColor="border-default">
			<HStack align="center" justify="space-between">
				<Heading size="small">Dagens tall</Heading>
			</HStack>
			<VerticalSpacer eightPx />
			{!data.oppdatertTidspunkt && <p>Ingen data for øyeblikket</p>}
			{data.oppdatertTidspunkt && (
				<>
					<Detail>Oppdatert {dayjs(data.oppdatertTidspunkt).format('DD.MM.YYYY kl. HH:mm:ss')}</Detail>
					<HStack className="mt-4 mb-6" gap="4">
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
						<ToggleGroup value={tidsområde} onChange={(nyttTidsområde) => setTidsområde(nyttTidsområde)}>
							<ToggleGroup.Item value="I_DAG" label="I dag" />
							<ToggleGroup.Item value="SISTE_7" label="Siste 7 dager" />
						</ToggleGroup>
					</HStack>
					<HGrid gap="2" columns={3}>
						{data.tall
							.filter(({ hovedgruppe }) => hovedgruppe === valgtHovedgruppe)
							.map((value) => {
								const venstreTall = tidsområde === 'I_DAG' ? value.nyeIDag : value.nyeSiste7Dager;
								const høyreTall = tidsområde === 'I_DAG' ? value.ferdigstilteIDag : value.ferdigstilteSiste7Dager;
								const høyreAndreTall =
									tidsområde === 'I_DAG'
										? value.ferdigstilteHelautomatiskIDag
										: value.ferdigstilteHelautomatiskSiste7Dager;
								return (
									<Teller3
										key={value.undergruppe}
										forklaring={data.undergrupper.find(({ kode }) => kode === value.undergruppe).navn}
										venstreTall={venstreTall}
										hoyreTall={høyreTall}
										hoyreAndreTall={høyreAndreTall}
									/>
								);
							})}
					</HGrid>
				</>
			)}
		</Box>
	);
}
