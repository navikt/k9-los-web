import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Normaltekst } from 'nav-frontend-typografi';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Box, Button, Detail, HGrid, HStack, Heading, Loader, Select, ToggleGroup } from '@navikt/ds-react';
import { useHentDagensTall, useOppdaterDagensTall } from 'api/queries/avdelingslederQueries';
import Teller from 'avdelingsleder/nokkeltall/components/dagensTallPanel/Teller';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

export default function DagensTall() {
	const [valgtHovedgruppe, setValgtHovedgruppe] = useState('ALLE');
	const { data, isFetching, isSuccess } = useHentDagensTall();
	const [tidsområde, setTidsområde] = useState('I_DAG');
	const [oppdaterer, setOppdaterer] = useState(false);
	const [henter, setHenter] = useState(false);

	const { mutate: oppdaterDagensTall, isPending } = useOppdaterDagensTall();

	useEffect(() => {
		setOppdaterer(false);
		setHenter(false);
	}, [data?.oppdatertTidspunkt]);

	return (
		<Box padding="4" borderWidth="1" borderColor="border-default">
			<HStack align="center" justify="space-between">
				<Heading size="small">Dagens tall</Heading>
				{!data?.feilmelding && (
					<Button
						size="small"
						variant="tertiary"
						loading={isPending}
						disabled={oppdaterer}
						icon={oppdaterer ? <ArrowCirclepathIcon className="animate-spin" /> : <ArrowCirclepathIcon />}
						onClick={() => {
							setOppdaterer(true);
							oppdaterDagensTall();
						}}
					>
						{oppdaterer ? 'Oppdaterer data ...' : 'Oppdater'}
					</Button>
				)}
			</HStack>
			<VerticalSpacer eightPx />
			{isFetching && <Loader />}
			{isSuccess && data.feilmelding && (
				<div>
					<Normaltekst className="mb-4">{data.feilmelding}</Normaltekst>
					<Button
						variant="secondary"
						size="medium"
						loading={isPending}
						disabled={henter}
						icon={henter ? <ArrowCirclepathIcon className="animate-spin" /> : <ArrowCirclepathIcon />}
						onClick={() => {
							setHenter(true);
							oppdaterDagensTall();
						}}
					>
						{henter ? 'Henter data ...' : 'Hent data'}
					</Button>
				</div>
			)}
			{isSuccess && !data.feilmelding && (
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
