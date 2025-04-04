import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Box, Detail, HGrid, HStack, Heading, Select, ToggleGroup } from '@navikt/ds-react';
import { useHentDagensTall } from 'api/queries/avdelingslederQueries';
import Teller from 'avdelingsleder/nokkeltall/components/dagensTallPanel/Teller';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

export default function DagensTall() {
	const [valgtHovedgruppe, setValgtHovedgruppe] = useState('ALLE');
	const { data } = useHentDagensTall();
	const [tidsområde, setTidsområde] = useState('I_DAG');

	// Henter alltid fra direkte fra cache, så bruker kort tid på loading
	if (data === undefined) return null;

	// TODO: Fjern denne linja når jobber for å hente data er på plass, gjør det sånn for å slippe å feature toggle
	if (!data.oppdatertTidspunkt) return null;

	// Ikke vis i prod ennå
	const isProd = window.location.hostname.includes('intern.nav.no');
	if (isProd) return null;

	return (
		<Box padding="4" borderWidth="1" borderColor="border-default">
			<HStack align="center" justify="space-between">
				<Heading size="small">Dagens tall (ny)</Heading>
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
					<HGrid gap="2" columns={4}>
						{data.tall
							.filter(({ hovedgruppe }) => hovedgruppe === valgtHovedgruppe)
							.map((value) => {
								const venstreTall = tidsområde === 'I_DAG' ? value.nyeIDag : value.nyeSiste7Dager;
								const høyreTall = tidsområde === 'I_DAG' ? value.ferdigstilteIDag : value.ferdigstilteSiste7Dager;
								return (
									<Teller
										key={value.undergruppe}
										forklaring={data.undergrupper.find(({ kode }) => kode === value.undergruppe).navn}
										venstreTall={venstreTall}
										hoyreTall={høyreTall}
									/>
								);
							})}
					</HGrid>
				</>
			)}
		</Box>
	);
}
