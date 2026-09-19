import { BodyShort, InlineMessage, VStack } from '@navikt/ds-react';
import type { OppgaveSammendragDto, SokeresultatSammendrag } from 'api/generated/los.schemas';
import { useSøk } from 'fleromrade/api/saksbehandlerQueries';
import { useMount } from 'hooks/UseMount';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { PersonInfo } from 'saksbehandler/sokeboks/PersonInfo';
import { SøkForm } from 'saksbehandler/sokeboks/SøkForm';
import OppgaveModal from '../oppgave/OppgaveModal';
import OppgaveTabell from '../oppgave/OppgaveTabell';

const saksnummerEllerJournalpostId = /^(?:\w{5}|\w{7}|\d{9})$/;

const Søkeresultat = ({
	resultat,
	onVelgOppgave,
}: {
	resultat: SokeresultatSammendrag;
	onVelgOppgave: (oppgave: OppgaveSammendragDto) => void;
}) => {
	if (resultat.type === 'IKKE_TILGANG') {
		return <BodyShort>Du har ikke tilgang til å slå opp denne personen</BodyShort>;
	}
	if (!('oppgaver' in resultat) || resultat.oppgaver.length === 0) {
		return <BodyShort>Søket ga ingen treff</BodyShort>;
	}

	const personer = new Set(resultat.oppgaver.map((oppgave) => oppgave.person?.fnr));
	const person = personer.size === 1 ? resultat.oppgaver[0].person : undefined;

	return (
		<VStack gap="space-16">
			{person && <PersonInfo person={person} />}
			<OppgaveTabell oppgaver={resultat.oppgaver} velg={{ med: 'rad', onVelgOppgave }} />
		</VStack>
	);
};

const Søkeboks = () => {
	const [søkeparametere] = useSearchParams();
	const søkeordFraUrl = søkeparametere.get('sok');
	const gyldigSøkeordFraUrl =
		søkeordFraUrl && saksnummerEllerJournalpostId.test(søkeordFraUrl) ? søkeordFraUrl : undefined;
	const { søk, isPending, isError, data: resultat, reset } = useSøk();
	const [valgtOppgave, setValgtOppgave] = useState<OppgaveSammendragDto>();

	// Søker kun på søkeordet som lå i URL-en ved førstegangsvisning. Senere søk styres av skjemaet.
	useMount(() => {
		if (gyldigSøkeordFraUrl) {
			søk(gyldigSøkeordFraUrl);
		}
	});

	return (
		<VStack gap="space-16">
			<SøkForm
				utførSøk={({ søkeord }) => søk(søkeord)}
				loading={isPending}
				nullstillSøk={reset}
				søkeordFraUrl={gyldigSøkeordFraUrl}
			/>
			{isError && <InlineMessage status="error">Søket feilet. Prøv igjen senere.</InlineMessage>}
			{resultat && <Søkeresultat resultat={resultat} onVelgOppgave={setValgtOppgave} />}
			{valgtOppgave && <OppgaveModal oppgave={valgtOppgave} lukk={() => setValgtOppgave(undefined)} />}
		</VStack>
	);
};

export default Søkeboks;
