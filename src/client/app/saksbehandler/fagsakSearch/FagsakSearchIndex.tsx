import React, { FunctionComponent, useState } from 'react';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useRestApiRunner } from 'api/rest-api-hooks';
import { getK9punsjRef, getK9sakHref } from 'app/paths';
import ValgtOppgaveModal from 'saksbehandler/components/ValgtOppgaveModal';
import Oppgave from 'saksbehandler/oppgaveTsType';
import OppgaveSystem from '../../types/OppgaveSystem';
import FagsakSearch from './components/FagsakSearch';

interface OwnProps {
	k9sakUrl: string;
	k9punsjUrl: string;
}

/**
 * FagsakSearchIndex
 *
 * Container komponent. Har ansvar for å vise søkeskjermbildet og å håndtere fagsaksøket
 * mot server og lagringen av resultatet i klientens state.
 */

const FagsakSearchIndex: FunctionComponent<OwnProps> = ({ k9sakUrl, k9punsjUrl }) => {
	const [valgtOppgave, setValgtOppgave] = useState<Oppgave>();

	const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);

	const goToFagsak = (oppgave: Oppgave) => {
		leggTilBehandletOppgave(oppgave.oppgaveNøkkel).then(() => {
			switch (oppgave.system) {
				case OppgaveSystem.K9SAK:
					window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
					break;
				case OppgaveSystem.K9TILBAKE:
					window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
					break;
				case OppgaveSystem.PUNSJ:
					window.location.assign(getK9punsjRef(k9punsjUrl, oppgave.journalpostId));
					break;
				default:
					window.location.assign(getK9sakHref(k9sakUrl, oppgave.saksnummer, oppgave.behandlingId));
			}
		});
	};

	return (
		<>
			<FagsakSearch setOppgave={setValgtOppgave} goToFagsak={goToFagsak} />
			{valgtOppgave && (
				<ValgtOppgaveModal oppgave={valgtOppgave} setValgtOppgave={setValgtOppgave} goToFagsak={goToFagsak} />
			)}
		</>
	);
};

export default FagsakSearchIndex;
