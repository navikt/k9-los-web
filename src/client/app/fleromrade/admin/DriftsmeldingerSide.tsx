import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, Heading, HStack, Modal, Switch, Table, TextField, VStack } from '@navikt/ds-react';
import type { DriftsmeldingDto } from 'api/generated/los.schemas';
import {
	useDriftsmeldinger,
	useFjernDriftsmelding,
	useLeggTilDriftsmelding,
	useSettDriftsmeldingAktiv,
} from 'fleromrade/api/driftsmeldingQueries';
import { type SubmitEvent, useState } from 'react';
import { dateTimeFormat } from 'utils/dateUtils';

const LeggTilDriftsmelding = () => {
	const [melding, setMelding] = useState('');
	const { leggTil, isPending } = useLeggTilDriftsmelding();

	const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (melding.trim()) {
			leggTil(melding.trim(), { onSuccess: () => setMelding('') });
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<HStack gap="space-16" align="end">
				<TextField label="Ny driftsmelding" value={melding} onChange={(event) => setMelding(event.target.value)} />
				<Button type="submit" loading={isPending}>
					Legg til
				</Button>
			</HStack>
		</form>
	);
};

const DriftsmeldingerSide = () => {
	const { data: driftsmeldinger = [] } = useDriftsmeldinger();
	const { fjern } = useFjernDriftsmelding();
	const { settAktiv } = useSettDriftsmeldingAktiv();
	const [skalSlettes, setSkalSlettes] = useState<DriftsmeldingDto>();

	const sorterte = [...driftsmeldinger].sort((a, b) => b.dato.localeCompare(a.dato));

	return (
		<Box as="main" padding={{ xs: 'space-16', md: 'space-40' }}>
			<Box maxWidth="64rem" marginInline="auto">
				<VStack gap="space-24">
					<Heading level="1" size="large">
						Driftsmeldinger
					</Heading>
					{sorterte.length === 0 ? (
						<BodyShort>Ingen driftsmeldinger</BodyShort>
					) : (
						<Table>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell scope="col">Melding</Table.HeaderCell>
									<Table.HeaderCell scope="col">Aktiv</Table.HeaderCell>
									<Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
									<Table.HeaderCell scope="col">
										<span className="sr-only">Handlinger</span>
									</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{sorterte.map((driftsmelding) => (
									<Table.Row key={driftsmelding.id}>
										<Table.DataCell>{driftsmelding.melding}</Table.DataCell>
										<Table.DataCell>
											<Switch
												size="small"
												hideLabel
												checked={driftsmelding.aktiv}
												onChange={(event) => settAktiv(driftsmelding.id, event.target.checked)}
											>
												{`Aktiv: ${driftsmelding.melding}`}
											</Switch>
										</Table.DataCell>
										<Table.DataCell>{dateTimeFormat(driftsmelding.dato)}</Table.DataCell>
										<Table.DataCell align="right">
											<Button
												variant="tertiary"
												size="small"
												icon={<TrashIcon title={`Slett ${driftsmelding.melding}`} />}
												onClick={() => setSkalSlettes(driftsmelding)}
											/>
										</Table.DataCell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					)}
					<LeggTilDriftsmelding />
				</VStack>
			</Box>
			<Modal
				open={skalSlettes !== undefined}
				onClose={() => setSkalSlettes(undefined)}
				header={{ heading: 'Slette driftsmelding?' }}
				width="small"
			>
				<Modal.Body>
					<BodyShort>{skalSlettes?.melding}</BodyShort>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={() => {
							fjern(skalSlettes.id);
							setSkalSlettes(undefined);
						}}
					>
						Slett
					</Button>
					<Button variant="secondary" onClick={() => setSkalSlettes(undefined)}>
						Avbryt
					</Button>
				</Modal.Footer>
			</Modal>
		</Box>
	);
};

export default DriftsmeldingerSide;
