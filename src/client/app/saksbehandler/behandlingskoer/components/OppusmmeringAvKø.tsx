import React from 'react';
import { OppgavekøV3 } from 'types/OppgavekøV3Type';
import { BodyShort, Detail } from '@navikt/ds-react';
import { OppgavekøV1 } from '../oppgavekoTsType';

interface OwnProps {
	oppgavekø: OppgavekøV1 | OppgavekøV3;
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
