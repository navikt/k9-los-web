import React from 'react';
import { useSearchParams } from 'react-router';
import { useSøkOppgaveV3 } from 'api/queries/saksbehandlerQueries';
import { useMount } from 'hooks/UseMount';
import { SøkForm } from 'saksbehandler/sokeboks/SøkForm';
import { SøkResultat } from 'saksbehandler/sokeboks/SøkResultat';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

const saksnummerEllerJournalpostId = /^(?:\w{5}|\w{7}|\d{9})$/;

export function Søkeboks() {
	const [searchParams] = useSearchParams();
	const søkeordFraUrl = searchParams.get('sok');
	const gyldigSøkeordFraUrl =
		søkeordFraUrl && saksnummerEllerJournalpostId.test(søkeordFraUrl) ? søkeordFraUrl : undefined;
	const { mutate: utførSøk, isPending, data, reset: nullstillSøk } = useSøkOppgaveV3();

	// Søker kun på søkeordet som lå i URL-en ved førstegangsvisning. Senere søk
	// styres av SøkForm, så effekten skal ikke fyre på nytt ved URL-endringer.
	useMount(() => {
		if (gyldigSøkeordFraUrl) {
			utførSøk({ søkeord: gyldigSøkeordFraUrl });
		}
	});

	return (
		<>
			<SøkForm
				utførSøk={utførSøk}
				loading={isPending}
				nullstillSøk={nullstillSøk}
				søkeordFraUrl={gyldigSøkeordFraUrl}
			/>
			<VerticalSpacer sixteenPx />
			<SøkResultat søkeresultat={data} />
		</>
	);
}
