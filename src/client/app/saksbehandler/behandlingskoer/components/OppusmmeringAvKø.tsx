import React from 'react';
import { BodyShort, Detail } from '@navikt/ds-react';
import { OppgavekøV3 } from 'types/OppgavekøV3Type';

interface OwnProps {
	oppgavekø: OppgavekøV3;
}
const OppsummeringAvKø = ({ oppgavekø }: OwnProps) => {
	if (!oppgavekø || !('tittel' in oppgavekø)) {
		return null;
	}

	return (
		<div>
			<Detail>Beskrivelse av køen</Detail>
			<BodyShort className="mt-4">{oppgavekø.beskrivelse}</BodyShort>
		</div>
	);
};

export default OppsummeringAvKø;
