import React, { FunctionComponent, useState } from 'react';
import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Checkbox, Heading, Table } from '@navikt/ds-react';
import { useSlettDriftsmelding, useToggleDriftsmelding } from 'api/queries/driftsmeldingQueries';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { dateTimeFormat } from 'utils/dateUtils';
import SletteDriftsmeldingerModal from './SletteDriftsmeldingerModal';
import { Driftsmelding } from './driftsmeldingTsType';

interface OwnProps {
	driftsmeldinger: Driftsmelding[];
}

/**
 * DriftsmeldingerTabell
 */
const DriftsmeldingerTabell: FunctionComponent<OwnProps> = ({ driftsmeldinger }) => {
	const [showSlettModal, setShowSlettModal] = useState(false);
	const [valgtDriftsmelding, setValgtDriftsmelding] = useState<Driftsmelding>(undefined);

	const { mutate: slettDriftsmeldingMutation } = useSlettDriftsmelding();
	const { mutate: toggleDriftsmeldingMutation } = useToggleDriftsmelding();

	const showSletteDriftsmeldingModal = (driftsmelding: Driftsmelding) => {
		setShowSlettModal(true);
		setValgtDriftsmelding(driftsmelding);
	};

	const closeSletteModal = () => {
		setShowSlettModal(false);
		setValgtDriftsmelding(undefined);
	};

	const slettDriftsmelding = (dm: Driftsmelding) => {
		slettDriftsmeldingMutation({ id: dm.id });
		closeSletteModal();
	};
	const sorterteDriftsmeldinger = driftsmeldinger.sort((d1, d2) => d1.dato.localeCompare(d2.dato));

	return (
		<>
			<Heading size="small">Driftsmeldinger</Heading>
			{sorterteDriftsmeldinger.length === 0 && (
				<>
					<VerticalSpacer eightPx />
					<BodyShort size="small">Ingen driftsmeldinger</BodyShort>
					<VerticalSpacer eightPx />
				</>
			)}
			{sorterteDriftsmeldinger.length > 0 && (
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Melding</Table.HeaderCell>
							<Table.HeaderCell>Aktiv</Table.HeaderCell>
							<Table.HeaderCell>Dato</Table.HeaderCell>
							<Table.HeaderCell />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{sorterteDriftsmeldinger.map((driftsmelding) => {
							const datoOgTid = dateTimeFormat(driftsmelding.dato);
							return (
								<Table.Row key={driftsmelding.id}>
									<Table.DataCell>{driftsmelding.melding}</Table.DataCell>
									<Table.DataCell>
										<div>
											<Checkbox
												className="p-0 mt-[-4px]"
												hideLabel
												size="small"
												checked={driftsmelding.aktiv}
												onChange={(e) => toggleDriftsmeldingMutation({ id: driftsmelding.id, aktiv: e.target.checked })}
												name="aktiv"
											>
												Toggle driftsmelding
											</Checkbox>
										</div>
									</Table.DataCell>
									<Table.DataCell>{datoOgTid}</Table.DataCell>
									<Table.DataCell>
										<Button
											className="p-0"
											icon={<TrashIcon />}
											variant="tertiary"
											onClick={() => showSletteDriftsmeldingModal(driftsmelding)}
											tabIndex={0}
										/>
									</Table.DataCell>
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
			)}
			{showSlettModal && (
				<SletteDriftsmeldingerModal
					valgtDriftsmelding={valgtDriftsmelding}
					closeSletteModal={closeSletteModal}
					fjernDriftsmelding={slettDriftsmelding}
				/>
			)}
		</>
	);
};

export default DriftsmeldingerTabell;
