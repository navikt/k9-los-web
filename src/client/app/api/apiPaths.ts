const apiPaths = {
	antallOppgaverIKoV3: (id: string) => `/api/k9-los-api/ny-oppgavestyring/ko/${id}/antall`,
	antallOppgaverIKoV3UtenReserverte: (id: string) =>
		`/api/k9-los-api/ny-oppgavestyring/ko/${id}/antall-uten-reserverte`,
	avdelinglederReservasjoner: '/api/k9-los-api/avdelingsleder/reservasjoner',
	endreReservasjoner: '/api/k9-los-api/saksbehandler/oppgaver/reservasjon/endre',
	opphevReservasjoner: '/api/k9-los-api/saksbehandler/oppgaver/opphev',
	driftsmeldinger: '/api/k9-los-api/driftsmeldinger',
	hentAlleKoerSaksbehandlerV3: '/api/k9-los-api/ny-oppgavestyring/ko/saksbehandlerskoer',
	hentAndreSaksbehandleresKøerV3: '/api/k9-los-api/ny-oppgavestyring/ko/andre-saksbehandleres-koer',
	hentAvdelingslederStatus: '/api/k9-los-api/ny-oppgavestyring/nokkeltall/status',
	hentDagensTall: '/api/k9-los-api/ny-oppgavestyring/nokkeltall/dagens-tall',
	hentFerdigstiltePerEnhet: '/api/k9-los-api/ny-oppgavestyring/nokkeltall/ferdigstilte-per-enhet',
	hentFelter: '/api/k9-los-api/ny-oppgavestyring/oppgave/felter',
	hentNyeOgFerdigstilteSisteSyvDager: (gruppe: string) =>
		`/api/k9-los-api/ny-oppgavestyring/nye-og-ferdigstilte?gruppe=${gruppe}`,
	hentOppgaveFelter: '/api/k9-los-api/ny-oppgavestyring/oppgave/felter',
	hentOppgaveFraKoV3: (id: string) => `/api/k9-los-api/ny-oppgavestyring/ko/${id}/fa-oppgave`,
	hentOppgaveko: (id: string) => `/api/k9-los-api/ny-oppgavestyring/ko/${id}`,
	hentOppgavekoer: '/api/k9-los-api/ny-oppgavestyring/ko/',
	hentOppgaver: '/api/k9-los-api/ny-oppgavestyring/oppgave/query',
	hentAntallOppgaver: '/api/k9-los-api/ny-oppgavestyring/oppgave/query/antall',
	hentOppgaverSomFil: '/api/k9-los-api/ny-oppgavestyring/oppgave/queryToFile',
	hentSaksbehandlereAvdelingsleder: '/api/k9-los-api/avdelingsleder/saksbehandlere',
	leggTilSaksbehandlerAvdelingsleder: '/api/k9-los-api/avdelingsleder/saksbehandlere/legg-til',
	hentSaksbehandlereSomSaksbehandler: '/api/k9-los-api/saksbehandler/oppgaver/saksbehandlere',
	hentSaksbehandlereIKoV3: (id: string) => `/api/k9-los-api/ny-oppgavestyring/ko/${id}/saksbehandlere`,
	hentTiNesteIKoV3: (id: string) => `/api/k9-los-api/ny-oppgavestyring/ko/${id}/oppgaver`,
	kodeverk: '/api/k9-los-api/kodeverk',
	kopierOppgaveko: '/api/k9-los-api/ny-oppgavestyring/ko/kopier',
	leggTilSaksbehandler: '/api/k9-los-api/ny-oppgavestyring/ko/saksbehandler',
	nyeFerdigstilteOppsummering: '/api/k9-los-api/avdelingsleder/nokkeltall/nye-ferdigstilte-oppsummering',
	oppdaterOppgaveko: '/api/k9-los-api/ny-oppgavestyring/ko',
	oppgaverAntallTotalt: '/api/k9-los-api/avdelingsleder/oppgaver/antall-totalt',
	opprettOppgaveko: '/api/k9-los-api/ny-oppgavestyring/ko/opprett',
	reserverOppgave: '/api/k9-los-api/saksbehandler/oppgaver/reserver',
	saksbehandler: '/api/k9-los-api/saksbehandler',
	saksbehandlerReservasjoner: '/api/k9-los-api/saksbehandler/oppgaver/reserverte',
	slettOppgaveko: '/api/k9-los-api/ny-oppgavestyring/ko/',
	slettSaksbehandler: '/api/k9-los-api/avdelingsleder/saksbehandlere/slett',
	sisteOppgaver: '/api/k9-los-api/ny-oppgavestyring/siste-oppgaver',
	sokV3: '/api/k9-los-api/ny-oppgavestyring/sok',
	validerQuery: '/api/k9-los-api/ny-oppgavestyring/oppgave/validate',
};

export default apiPaths;
