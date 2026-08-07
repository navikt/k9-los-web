import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { ChatElipsisIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Popover } from '@navikt/ds-react';
import { useId, useRef, useState } from 'react';
import type ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { getDateAndTime } from 'utils/dateUtils';

const KommentarMedMerknad = ({ reservasjon }: { reservasjon: ReservasjonV3 }) => {
	const ref = useRef<HTMLButtonElement>(null);
	const [showTooltip, setShowTooltip] = useState(false);
	const popoverId = useId();
	const { date, time } = getDateAndTime(reservasjon.reservertFra);

	if (!reservasjon?.kommentar) {
		return null;
	}
	return (
		<>
			<Button
				className="p-1"
				icon={<ChatElipsisIcon title="Vis kommentar for reservasjonen" />}
				variant="tertiary"
				ref={ref}
				onClick={() => setShowTooltip(!showTooltip)}
				size="medium"
				aria-expanded={showTooltip}
				aria-controls={showTooltip ? popoverId : undefined}
				data-marker-reservasjonsgruppe
			/>
			<Popover id={popoverId} open={showTooltip} onClose={() => setShowTooltip(false)} anchorEl={ref.current}>
				<Popover.Content>
					<BodyShort size="small">{`Reservasjon endret av ${reservasjon.endretAvNavn || 'Ukjent'}`}</BodyShort>
					<BodyShort size="small">{`${date} ${time}`}</BodyShort>
					<VerticalSpacer sixteenPx />
					<BodyShort size="small">{reservasjon.kommentar}</BodyShort>
				</Popover.Content>
			</Popover>
		</>
	);
};

export default KommentarMedMerknad;
