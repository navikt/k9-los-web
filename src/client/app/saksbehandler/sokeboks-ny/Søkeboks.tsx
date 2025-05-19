import React from 'react';
import { useSøkOppgaveV3Ny } from 'api/queries/saksbehandlerQueries';
import { SøkForm } from 'saksbehandler/sokeboks-ny/SøkForm';
import { SøkResultat } from 'saksbehandler/sokeboks-ny/SøkResultat';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

export function Søkeboks() {
	const { mutate: utførSøk, isPending, data, reset: nullstillSøk } = useSøkOppgaveV3Ny();

	return (
		<>
			<SøkForm utførSøk={utførSøk} loading={isPending} nullstillSøk={nullstillSøk} />
			<VerticalSpacer sixteenPx />
			<SøkResultat søkeresultat={data} />
		</>
	);
}
