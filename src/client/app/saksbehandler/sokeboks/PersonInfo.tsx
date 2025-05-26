import React from 'react';
import { FigureInwardIcon, FigureOutwardIcon } from '@navikt/aksel-icons';
import { Detail, Heading } from '@navikt/ds-react';
import { SøkeboksPersonDto } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';
import { dateFormat } from 'utils/dateUtils';

export function PersonInfo({ person }: { person: SøkeboksPersonDto }) {
	const iconCss = 'mr-3 mt-2';
	return (
		<div className="flex">
			{person.kjønn === 'KVINNE' && <FigureOutwardIcon fontSize={30} className={iconCss} />}
			{person.kjønn === 'MANN' && <FigureInwardIcon fontSize={30} className={iconCss} />}

			<div>
				<Heading size="small">{person.navn}</Heading>
				<Detail>{person.fnr}</Detail>
				{person.dødsdato && <Detail>Dødsdato: {dateFormat(person.dødsdato)}</Detail>}
			</div>
		</div>
	);
}
