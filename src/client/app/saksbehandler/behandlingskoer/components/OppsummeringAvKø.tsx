import React, { useContext } from 'react';
import { BodyShort, Detail } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { FilterBeskrivelseListe } from 'filter/FilterBeskrivelseListe';
import { utledFilterBeskrivelseUtenStandardverdier } from 'filter/queryBeskrivelseUtils';
import { useNyVisning } from 'saksbehandler/NyVisningContext';
import { OppgavekøV3 } from 'types/OppgavekøV3Type';

interface OwnProps {
	oppgavekø: OppgavekøV3;
}
const OppsummeringAvKø = ({ oppgavekø }: OwnProps) => {
	const { felter } = useContext(AppContext);
	const { nyVisning } = useNyVisning();

	if (!oppgavekø || !('tittel' in oppgavekø)) {
		return null;
	}

	const kriterieBeskrivelse = utledFilterBeskrivelseUtenStandardverdier(oppgavekø.oppgaveQuery, felter);

	return (
		<div className="flex flex-col gap-4">
			{oppgavekø.beskrivelse.length > 0 && (
				<div>
					<Detail>Beskrivelse av køen</Detail>
					<BodyShort className="mt-4">{oppgavekø.beskrivelse}</BodyShort>
				</div>
			)}
			{nyVisning && kriterieBeskrivelse.length > 0 && (
				<div>
					<Detail>Kriterier</Detail>
					<FilterBeskrivelseListe queryBeskrivelse={kriterieBeskrivelse} />
				</div>
			)}
		</div>
	);
};

export default OppsummeringAvKø;
