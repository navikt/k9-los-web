/* eslint-disable import/no-mutable-exports */
import { rest } from 'msw';
import { felter } from 'filter/parts/testdata';
import apiPaths from 'api/apiPaths';
import {
	avdelningsledareReservasjoner,
	behandlingerSomGårAvVent,
	behandlingerSomGårAvVentÅrsaker,
	behandlingerUnderArbeid,
	dagensTall,
	ferdigstilteHistorikk,
	kodeverk,
	løsteAksjonspunkterPerEnhet,
	nyeOgFerdigstilteOppgaver,
	nyeOgFerdigstilteOppgaverMedStonadstype,
	saksbehandlerOppgaveko,
	saksbehandlerOppgaver,
	saksbehandlereIOppgaveko,
	soek,
} from './index';
import { giRandomDato } from './mockUtils';
import nyeOgGamleReservasjoner from './nyeOgGamleReservasjoner';

// Alle handlers som ligger direkte i dette arrayet vil gjelde
// Requesten treffer handlerne i stedet for eventuelle eksisterende APIer
// f.eks hvis vi har handlere til alle APIene vi bruker her, vil vi aldri treffe den faktiske backenden når vi kjører opp lokalt.
// Derfor burde nok ting kun legges i dette arrayet midlertidig
let handlers = [];

export const developmentHandlers = {
	ferdigstilteHistorikk: rest.get(apiPaths.ferdigstilteHistorikk, (req, res, ctx) =>
		res(ctx.json(giRandomDato(ferdigstilteHistorikk, 14))),
	),
	dagensTall: rest.get(apiPaths.dagensTall, (req, res, ctx) => res(ctx.json(dagensTall))),
	allePaaVent: rest.get(apiPaths.allePaaVent, (req, res, ctx) =>
		res(ctx.json({ påVent: behandlingerSomGårAvVent, påVentMedVenteårsak: behandlingerSomGårAvVentÅrsaker })),
	),
	nyeOgFerdigstilteOppgaver: rest.get(apiPaths.nyeOgFerdigstilteOppgaver, (req, res, ctx) =>
		res(ctx.json(giRandomDato(nyeOgFerdigstilteOppgaver, 7))),
	),
	behandlingerUnderArbeid: rest.get(apiPaths.behandlingerUnderArbeid, (req, res, ctx) =>
		res(ctx.json(behandlingerUnderArbeid)),
	),
	beholdningPerDato: rest.get(apiPaths.beholdningPerDato, (req, res, ctx) =>
		res(ctx.json(giRandomDato(ferdigstilteHistorikk, 14))),
	),
	nyePerDato: rest.get(apiPaths.nyePerDato, (req, res, ctx) => res(ctx.json(giRandomDato(ferdigstilteHistorikk, 14)))),
	nyeFerdigstilteOppsummering: rest.get(apiPaths.nyeFerdigstilteOppsummering, (req, res, ctx) =>
		res(ctx.json(giRandomDato(nyeOgFerdigstilteOppgaverMedStonadstype, 7))),
	),
	oppgaverAntallTotalt: rest.get(apiPaths.oppgaverAntallTotalt, (req, res, ctx) => res(ctx.status(200), ctx.json(0))),
	legacyOppgaveKoer: rest.get(apiPaths.legacyOppgaveKoer, (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
	saksbehandler: rest.get(apiPaths.saksbehandler, (req, res, ctx) =>
		res(
			ctx.json({
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
	k9SakUrl: rest.get(apiPaths.k9SakUrl, (req, res, ctx) => res(ctx.json({ verdi: 'http://localhost:8040' }))),
	k9PunsjUrl: rest.get(apiPaths.k9PunsjUrl, (req, res, ctx) => res(ctx.json({ verdi: 'http://localhost:8050' }))),
	refreshUrl: rest.get(apiPaths.refreshUrl, (req, res, ctx) =>
		res(
			ctx.json({
				verdi: 'ws://localhost:8020/ws',
			}),
		),
	),
	driftsmeldinger: rest.get(apiPaths.driftsmeldinger, (req, res, ctx) => res(ctx.json([]))),
	behandlede: rest.get(apiPaths.behandlede, (req, res, ctx) => res(ctx.json([]))),
	kodeverk: rest.get(apiPaths.kodeverk, (req, res, ctx) => res(ctx.json(kodeverk))),
	aksjonspunkterPerEnhet: rest.get(apiPaths.aksjonspunkterPerEnhet, (req, res, ctx) =>
		res(ctx.json(giRandomDato(løsteAksjonspunkterPerEnhet, 7))),
	),
	avdelinglederReservasjoner: rest.get(apiPaths.avdelinglederReservasjoner, (req, res, ctx) =>
		res(ctx.json(avdelningsledareReservasjoner)),
	),
	saksbehandlerReservasjoner: rest.get(apiPaths.saksbehandlerReservasjoner, (req, res, ctx) =>
		res(ctx.json(nyeOgGamleReservasjoner)),
	),
	saksbehandlerOppgaver: rest.get(apiPaths.saksbehandlerNesteOppgaver(''), (req, res, ctx) =>
		res(ctx.json(saksbehandlerOppgaver)),
	),
	saksbehandlereIOppgaveko: rest.get(apiPaths.saksbehandlereIOppgaveko, (req, res, ctx) =>
		res(ctx.json(saksbehandlereIOppgaveko)),
	),
	oppgaver: rest.get(apiPaths.oppgaver, (req, res, ctx) => res(ctx.json(10))),
	oppgavekoer: rest.get(apiPaths.hentAlleKoerSaksbehandlerV1, (req, res, ctx) => res(ctx.json(saksbehandlerOppgaveko))),
	sok: rest.post(apiPaths.sok, (req, res, ctx) => res(ctx.json(soek))),
	saksbehandlere: rest.get(apiPaths.hentSaksbehandlere, (req, res, ctx) =>
		res(
			ctx.json([
				{ navn: 'Ping Pong Paul', brukerIdent: 'M088876', epost: 'pingpongpaul@nav.no' },
				{ navn: 'Strenge Stian', brukerIdent: 'M111111', epost: 'saksbehandler1@nav.no' },
				{ navn: 'Grusomme Geir', brukerIdent: 'M113111', epost: 'saksbehandler111@nav.no' },
				{ navn: 'Super Hans', brukerIdent: 'M011111', epost: 'saksbehandler11671@nav.no' },
				{ navn: 'Helmut Hageberg', brukerIdent: 'M222222', epost: 'saksbehandler2@nav.no' },
				{ navn: 'Avslå Altesen', brukerIdent: 'M333333', epost: 'saksbehandler3@nav.no' },
				{ navn: 'Conrad Coinflip', brukerIdent: 'M444444', epost: 'saksbehandler4@nav.no' },
				{ navn: 'Freddy Fradrag', brukerIdent: 'M212121', epost: 'saksbehandler41@nav.no' },
				{
					navn: 'Jeg Har Mange Navn Og Bruker Helst Alle',
					brukerIdent: 'M555555',
					epost: 'saksbehandler5@nav.no',
				},
				{ navn: 'Hacker Jørgen', brukerIdent: 'M666666', epost: 'saksbehandler6@nav.no' },
				{ navn: 'Jorge Hermansen', brukerIdent: 'M777777', epost: 'saksbehandler7@nav.no' },
				{ navn: 'Rettferdige Reidun', brukerIdent: 'M888888', epost: 'saksbehandler8@nav.no' },
				{ navn: 'Ronny Filtersen', brukerIdent: 'M999999', epost: 'saksbehandler9@nav.no' },
				{ navn: 'Bungalo Bernt', brukerIdent: 'M010101', epost: 'saksbehandler10@nav.no' },
				{ navn: 'Tommy Tilbakekreving', brukerIdent: 'M323212', epost: 'saksbehandler1103@nav.no' },
				{ navn: 'Benny Balltre', brukerIdent: 'M323212', epost: 'saksbehandler11909@nav.no' },
				{ navn: 'Ken Kneskål', brukerIdent: 'M010111', epost: 'saksbehandler11@nav.no' },
			]),
		),
	),
	oppgavemodellV3OppdaterKø: rest.post(apiPaths.oppdaterOppgaveko, async (req, res, ctx) => {
		const data = await req.json();
		return res(
			ctx.json({
				id: '1',
				tittel: 'Beskrivende tittel',
				beskrivelse: 'godt forklart tekst om hva formålet med køen er',
				oppgavequery: [],
				saksbehandlere: [],
				sistEndret: 'dato',
				...data,
				versjon: data.versjon ? data.versjon + 1 : 1,
			}),
		);
	}),
	oppgavemodellV3HentKø4: rest.get(`${apiPaths.hentOppgaveko('4')}`, async (req, res, ctx) =>
		res(
			ctx.json({
				id: 3,
				versjon: 2,
				tittel: 'Stians morokø',
				beskrivelse:
					// eslint-disable-next-line max-len
					'Hvorfor var backend-utvikleren alltid den siste til å forlate kontoret? Fordi han var alltid opptatt med å håndtere køer.\n\nHvordan feirer en backend-utvikler sin bursdag? Han lager en kake og legger den i køen, men får aldri spise den fordi det er alltid en bug som må fikses først.\n\nHvorfor var backend-utvikleren alltid trøtt? Fordi han jobbet i skift - morgen, ettermiddag, kveld og nattskift. Velkommen til livet med køhåndtering!\n\nHva er en backend-utviklers favorittspill? Tetris. Han elsker å sortere blokkene akkurat som han sorterer oppgavene i køen.\n\nHvorfor liker backend-utviklere å se på folk som venter på bussen? Fordi det minner dem om jobben deres - å håndtere køer.\n\nHvorfor ble backend-utvikleren standup-komiker? Fordi han alltid jobber med køer, så han er god på å få ting til å bevege seg raskt.\n',
				oppgaveQuery: {
					filtere: [
						{
							type: 'feltverdi',
							område: 'K9',
							kode: 'vedtaksdato',
							operator: 'EQUALS',
							verdi: ['2023-06-01'],
						},
						{
							type: 'feltverdi',
							område: 'K9',
							kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
							operator: 'EQUALS',
							verdi: ['P3D'],
						},
						{
							type: 'feltverdi',
							område: 'K9',
							kode: 'aktivtAksjonspunkt',
							operator: 'EQUALS',
							verdi: ['5038', '5039', '5046', '5047', '5049', '5052', '5058', '5084', '6014', '6015'],
						},
						{
							type: 'feltverdi',
							område: 'K9',
							kode: 'ytelsestype',
							operator: 'EQUALS',
							verdi: ['PSB', 'OMP'],
						},
						{
							type: 'feltverdi',
							område: 'K9',
							kode: 'saksnummer',
							operator: 'EQUALS',
							verdi: ['MB4P3'],
						},
						{
							type: 'feltverdi',
							område: 'K9',
							kode: 'avventerTekniskFeil',
							operator: 'EQUALS',
							verdi: ['true'],
						},
					],
					select: [],
					order: [],
					limit: 10,
				},
				frittValgAvOppgave: false,
				saksbehandlere: ['saksbehandler11@nav.no'],
			}),
		),
	),
	oppgavemodellV3HentKø: rest.get(`${apiPaths.hentOppgaveko('1')}`, async (req, res, ctx) =>
		res(
			ctx.json({
				id: '1',
				tittel: 'Beskrivende tittel',
				beskrivelse: 'godt forklart tekst om hva formålet med køen er',
				oppgaveQuery: { filtere: [], select: [], order: [], limit: 10 },
				saksbehandlere: [],
				antallOppgaver: 5,
				sistEndret: 'dato',
				versjon: 1,
			}),
		),
	),
	hentAlleKoerSaksbehandler: rest.get(apiPaths.hentAlleKoerSaksbehandlerV3, async (req, res, ctx) =>
		res(
			ctx.json([
				{
					id: 1,
					versjon: 2,
					tittel: 'asdfsadffsdasdfasdfa',
					beskrivelse: 'asdfasdfsfdsdfasadfsadfdsfasdfasdfsadf',
					oppgaveQuery: {
						filtere: [
							{
								type: 'feltverdi',
								område: null,
								kode: 'oppgavestatus',
								operator: 'IN',
								verdi: ['AAPEN'],
							},
						],
						select: [],
						order: [
							{
								type: 'enkel',
								område: 'K9',
								kode: 'mottattDato',
								økende: true,
							},
						],
						limit: -1,
					},
					frittValgAvOppgave: false,
					saksbehandlere: ['saksbehandler@nav.no'],
					endretTidspunkt: '2023-10-18T11:34:44.729',
				},
			]),
		),
	),
	oppgavemodellV3HentAlleKø: rest.get(apiPaths.hentOppgavekoer, async (req, res, ctx) =>
		res(
			ctx.json({
				koer: [
					{
						id: '1',
						tittel: 'Beskrivende tittel',
						beskrivelse: 'godt forklart tekst om hva formålet med køen er',
						saksbehandlere: ['saksbehandler1103@nav.no', 'saksbehandler11909@nav.no', 'saksbehandler11@nav.no'],
						antallOppgaver: 5,
						versjon: 1,
						antallSaksbehandlere: 0,
						sistEndret: null,
					},
					{
						id: '2',
						tittel: 'Kø 2',
						beskrivelse:
							'godt forklart tekst om hva formålet med køen er. og den skal være lang lang lang lang lang lang lang lang ' +
							'lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang' +
							'lang lang lang lang lang lang lang |lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang ' +
							'slang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang lang',
						antallOppgaver: 1002,
						antallSaksbehandlere: 6,
						sistEndret: '2023-06-28T08:57:22.4',
					},
					{
						id: '3',
						tittel: 'Kø 3',
						beskrivelse: 'godt forklart tekst om hva formålet med køen er',
						saksbehandlere: [],
						antallOppgaver: 0,
						sistEndret: null,
						versjon: 1,
					},
					{
						id: 4,
						versjon: 2,
						tittel: 'Stians morokø',
						antallSaksbehandlere: 6,
						antallOppgaver: 3,
						sistEndret: '2023-05-28T08:57:22.4',
						beskrivelse:
							// eslint-disable-next-line max-len
							'Hvorfor var backend-utvikleren alltid den siste til å forlate kontoret? Fordi han var alltid opptatt med å håndtere køer.\n\nHvordan feirer en backend-utvikler sin bursdag? Han lager en kake og legger den i køen, men får aldri spise den fordi det er alltid en bug som må fikses først.\n\nHvorfor var backend-utvikleren alltid trøtt? Fordi han jobbet i skift - morgen, ettermiddag, kveld og nattskift. Velkommen til livet med køhåndtering!\n\nHva er en backend-utviklers favorittspill? Tetris. Han elsker å sortere blokkene akkurat som han sorterer oppgavene i køen.\n\nHvorfor liker backend-utviklere å se på folk som venter på bussen? Fordi det minner dem om jobben deres - å håndtere køer.\n\nHvorfor ble backend-utvikleren standup-komiker? Fordi han alltid jobber med køer, så han er god på å få ting til å bevege seg raskt.\n',
						saksbehandlere: ['saksbehandler11@nav.no'],
					},
				],
			}),
		),
	),
	hentFelter: rest.get(apiPaths.hentFelter, async (req, res, ctx) =>
		res(
			ctx.json({
				felter,
			}),
		),
	),
	opprettKo: rest.post(apiPaths.opprettOppgaveko, async (req, res, ctx) => {
		const data = await req.json();
		return res(
			ctx.json({
				id: 43,
				versjon: 0,
				tittel: data.tittel,
				beskrivelse: '',
				oppgaveQuery: { filtere: [], select: [], order: [], limit: 10 },
				frittValgAvOppgave: false,
				saksbehandlere: [],
				endretTidspunkt: '2023-09-18T10:15:56.468',
			}),
		);
	}),
};

if (process.env.MSW_MODE === 'test') {
	handlers = handlers.concat(Object.values(developmentHandlers));
}

if (process.env.MSW_MODE === 'development') {
	handlers = [developmentHandlers.hentAlleKoerSaksbehandler, developmentHandlers.saksbehandlerReservasjoner];
}

export default handlers;
