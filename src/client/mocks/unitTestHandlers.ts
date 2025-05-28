// src/mocks/server.js
import { http } from 'msw';
import apiPaths from 'api/apiPaths';

export const unitTestHandlers = [
	http.get(
		apiPaths.innloggetBruker,
		() =>
			new Response(
				JSON.stringify({
					brukernavn: 'saksbehandler@nav.no',
					navn: 'Saksbehandler Sara',
					brukerIdent: 'Z123456',
					kanSaksbehandle: true,
					kanVeilede: true,
					kanBeslutte: true,
					kanBehandleKodeEgenAnsatt: true,
					kanBehandleKode6: true,
					kanBehandleKode7: true,
					kanOppgavestyre: true,
					kanReservere: true,
					kanDrifte: true,
				}),
			),
	),

	http.get(
		'http://localhost:8031/api/driftsmeldinger',
		() =>
			new Response(
				JSON.stringify([
					{
						id: '1',
						melding: 'CrashMessage',
						dato: '06-09-2021',
						aktiv: true,
						aktivert: '',
					},
				]),
			),
	),
];
