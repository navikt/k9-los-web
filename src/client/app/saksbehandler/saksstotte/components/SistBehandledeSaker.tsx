import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { getK9punsjRef, getK9sakHref } from 'app/paths';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { Link, BodyShort, Label } from '@navikt/ds-react';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import BehandletOppgave from 'saksbehandler/saksstotte/behandletOppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import OppgaveSystem from 'types/OppgaveSystem';

/**
 * SistBehandledeSaker
 *
 * Denne komponenten viser de ti siste oppgavene en nav-ansatt har behandlet.
 */
const SistBehandledeSaker: FunctionComponent = () => {
	const { data: sistBehandledeSaker = [] } = useRestApi<BehandletOppgave[]>(K9LosApiKeys.BEHANDLEDE_OPPGAVER);
	const k9sakUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.K9SAK_URL);
	const k9punsjUrl = useGlobalStateRestApiData<{ verdi?: string }>(RestApiGlobalStatePathsKeys.PUNSJ_URL);

	const oppgaveUrl = (oppgave: BehandletOppgave) => {
		switch (oppgave.system) {
			case OppgaveSystem.PUNSJ:
				return getK9punsjRef(k9punsjUrl.verdi, oppgave.journalpostId);
			default:
				return getK9sakHref(k9sakUrl.verdi, oppgave.saksnummer, oppgave.behandlingId);
		}
	};

	if (sistBehandledeSaker.length === 0) {
		return (
			<>
				<Label>
					<FormattedMessage id="SistBehandledeSaker.SistBehandledeSaker" />
				</Label>
				<BodyShort className="mt-2">
					<FormattedMessage id="SistBehandledeSaker.IngenBehandlinger" />
				</BodyShort>
			</>
		);
	}
	return (
		<>
			<Label>
				<FormattedMessage id="SistBehandledeSaker.SistBehandledeSaker" />
			</Label>
			<div className="flex flex-col gap-2 mt-2">
				{sistBehandledeSaker.map((oppgave) => (
					<Link key={oppgave.eksternId} href={oppgaveUrl(oppgave)}>{`${oppgave.navn} ${oppgave.personnummer} ${
						oppgave.system === OppgaveSystem.PUNSJ ? '(Punsj)' : '(K9)'
					}`}</Link>
				))}
			</div>
		</>
	);
};

export default SistBehandledeSaker;
