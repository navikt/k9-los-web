import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Checkbox, Label } from '@navikt/ds-react';
import { useSlettDriftsmelding, useToggleDriftsmelding } from 'api/queries/driftsmeldingQueries';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import SletteDriftsmeldingerModal from './SletteDriftsmeldingerModal';
import { Driftsmelding } from './driftsmeldingTsType';

const headerTextCodes = ['DriftsmeldingTabell.Tekst', 'DriftsmeldingTabell.Aktiv', 'DriftsmeldingTabell.Dato'];

interface OwnProps {
	driftsmeldinger: Driftsmelding[];
}

const boldChunks = (...chunks) => <b>{chunks}</b>;

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
			<Label>
				<FormattedMessage id="DriftsmeldingerTabell.Driftsmeldinger" />
			</Label>
			{sorterteDriftsmeldinger.length === 0 && (
				<>
					<VerticalSpacer eightPx />
					<BodyShort size="small">
						<FormattedMessage id="DriftsmeldingerTabell.IngenDriftsmeldinger" />
					</BodyShort>
					<VerticalSpacer eightPx />
				</>
			)}
			{sorterteDriftsmeldinger.length > 0 && (
				<Table headerTextCodes={headerTextCodes} noHover>
					{sorterteDriftsmeldinger.map((driftsmelding) => (
						<TableRow key={driftsmelding.id}>
							<TableColumn>{driftsmelding.melding}</TableColumn>
							<TableColumn>
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
							</TableColumn>
							<TableColumn>
								<FormattedMessage
									id="DriftsmeldingerTabell.Dato"
									values={{
										...getDateAndTime(driftsmelding.dato),
										b: boldChunks,
									}}
								/>
							</TableColumn>
							<TableColumn>
								<Button
									className="p-0"
									icon={<TrashIcon />}
									variant="tertiary"
									onClick={() => showSletteDriftsmeldingModal(driftsmelding)}
									tabIndex={0}
								/>
							</TableColumn>
						</TableRow>
					))}
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
