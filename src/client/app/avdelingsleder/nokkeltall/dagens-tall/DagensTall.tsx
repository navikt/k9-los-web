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
							<ToggleGroup.Item value="SISTE_UKE" label="Siste uke" />
							<ToggleGroup.Item value="SISTE_2_UKER" label="Siste 2 uker" />
							<ToggleGroup.Item value="SISTE_4_UKER" label="Siste 4 uker" />
						</ToggleGroup>
					</HStack>
					<HGrid gap="space-24" columns={{ md: 2, lg: 3, xl: 4 }}>
						{data.tall
							.filter(({ hovedgruppe }) => hovedgruppe === valgtHovedgruppe)
							.map((value) => {
								const { inngang, manueltFerdigstilt, automatiskFerdigstilt } = (() => {
									switch (tidsområde) {
										case 'I_DAG':
											return {
												inngang: value.nyeIDag,
												manueltFerdigstilt: value.ferdigstilteIDag,
												automatiskFerdigstilt: value.ferdigstilteHelautomatiskIDag,
											};
										case 'SISTE_UKE':
											return {
												inngang: value.nyeSiste7Dager,
												manueltFerdigstilt: value.ferdigstilteSiste7Dager,
												automatiskFerdigstilt: value.ferdigstilteHelautomatiskSiste7Dager,
											};
										case 'SISTE_2_UKER':
											return {
												inngang: value.nyeSiste2Uker,
												manueltFerdigstilt: value.ferdigstilteSiste2Uker,
												automatiskFerdigstilt: value.ferdigstilteHelautomatiskSiste2Uker,
											};
										case 'SISTE_4_UKER':
											return {
												inngang: value.nyeSiste4Uker,
												manueltFerdigstilt: value.ferdigstilteSiste4Uker,
												automatiskFerdigstilt: value.ferdigstilteHelautomatiskSiste4Uker,
											};
										default:
											throw Error('Ukjent tidsområde');
									}
								})();

								return (
									<Teller3
										key={value.undergruppe}
										forklaring={data.undergrupper.find(({ kode }) => kode === value.undergruppe).navn}
										inngang={inngang}
										manuelleFerdigstilt={manueltFerdigstilt}
										automatiskeFerdigstilt={automatiskFerdigstilt}
									/>
								);
							})}
					</HGrid>
				</>
			)}
		</Box>
	);
}
