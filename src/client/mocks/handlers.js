/* eslint-disable import/no-mutable-exports */
import { rest } from 'msw';
import avdelningsledareReservasjoner from './avdelningsledareReservasjoner';
import behandlingerSomGårAvVent from './behandlingerSomGårAvVent';
import behandlingerSomGårAvVentÅrsaker from './behandlingerSomGårAvVentÅrsaker';
import behandlingerUnderArbeid from './behandlingerUnderArbeid';
import dagensTall from './dagensTall';
import ferdigstilteHistorikk from './ferdigstilteHistorikk';
import løsteAksjonspunkterPerEnhet from './løsteAksjonspunkterPerEnhet';
import { giRandomDato } from './mockUtils';
import nyeOgFerdigstilteOppgaver from './nyeOgFerdigstilteOppgaver';
import nyeOgFerdigstilteOppgaverMedStonadstype from './nyeOgFerdigstilteOppgaverMedStonadstype';
import saksbehandlerOppgaveko from './saksbehandlerOppgaveko';
import saksbehandlerOppgaver from './saksbehandlerOppgaver';
import saksbehandlerReservasjoner from './saksbehandlerReservasjoner';
import saksbehandlereIOppgaveko from './saksbehandlereIOppgaveko';
import soek from './soek';

// Alle handlers som ligger direkte i dette arrayet vil gjelde
// Requesten treffer handlerne i stedet for eventuelle eksisterende APIer
// f.eks hvis vi har handlere til alle APIene vi bruker her, vil vi aldri treffe den faktiske backenden når vi kjører opp lokalt.
// Derfor burde nok ting kun legges i dette arrayet midlertidig
let handlers = [];

export const developmentHandlers = {
	ferdigstilteHistorikk: rest.get('/api/avdelingsleder/nokkeltall/ferdigstilte-historikk', (req, res, ctx) =>
		res(ctx.json(giRandomDato(ferdigstilteHistorikk, 14))),
	),
	dagensTall: rest.get('/api/avdelingsleder/nokkeltall//dagens-tall', (req, res, ctx) => res(ctx.json(dagensTall))),
	allePaaVent: rest.get('/api/avdelingsleder/nokkeltall/alle-paa-vent_v2', (req, res, ctx) =>
		res(ctx.json({ påVent: behandlingerSomGårAvVent, påVentMedVenteårsak: behandlingerSomGårAvVentÅrsaker })),
	),
	nyeOgFerdigstilteOppgaver: rest.get('/api/saksbehandler/nokkeltall/nye-og-ferdigstilte-oppgaver', (req, res, ctx) =>
		res(ctx.json(giRandomDato(nyeOgFerdigstilteOppgaver, 7))),
	),
	behandlingerUnderArbeid: rest.get('/api/avdelingsleder/nokkeltall/behandlinger-under-arbeid', (req, res, ctx) =>
		res(ctx.json(behandlingerUnderArbeid)),
	),
	beholdningPerDato: rest.get('/api/avdelingsleder/nokkeltall/beholdning-historikk', (req, res, ctx) =>
		res(ctx.json(giRandomDato(ferdigstilteHistorikk, 14))),
	),
	nyePerDato: rest.get('/api/avdelingsleder/nokkeltall/nye-historikk', (req, res, ctx) =>
		res(ctx.json(giRandomDato(ferdigstilteHistorikk, 14))),
	),
	nyeFerdigstilteOppsummering: rest.get(
		'/api/avdelingsleder/nokkeltall/nye-ferdigstilte-oppsummering',
		(req, res, ctx) => res(ctx.json(giRandomDato(nyeOgFerdigstilteOppgaverMedStonadstype, 7))),
	),
	aksjonspunkterPerEnhet: rest.get(
		'/api/avdelingsleder/nokkeltall/aksjonspunkter-per-enhet-historikk',
		(req, res, ctx) => res(ctx.json(giRandomDato(løsteAksjonspunkterPerEnhet, 7))),
	),
	avdelinglederReservasjoner: rest.get('/api/avdelingsleder/reservasjoner', (req, res, ctx) =>
		res(ctx.json(avdelningsledareReservasjoner)),
	),
	saksbehandlerReservasjoner: rest.get('/api/saksbehandler/oppgaver/reserverte', (req, res, ctx) =>
		res(ctx.json(saksbehandlerReservasjoner)),
	),
	saksbehandlerOppgaver: rest.get('/api/saksbehandler/oppgaver', (req, res, ctx) =>
		res(ctx.json(saksbehandlerOppgaver)),
	),
	saksbehandlereIOppgaveko: rest.get('/api/saksbehandler/oppgaveko/saksbehandlere', (req, res, ctx) =>
		res(ctx.json(saksbehandlereIOppgaveko)),
	),
	oppgaver: rest.get('/api/saksbehandler/oppgaver/antall', (req, res, ctx) => res(ctx.json(10))),
	oppgavekoer: rest.get('/api/saksbehandler/oppgaveko', (req, res, ctx) => res(ctx.json(saksbehandlerOppgaveko))),
	sok: rest.post('/api/fagsak/sok', (req, res, ctx) => res(ctx.json(soek))),
	saksbehandlere: rest.get('/api/avdelingsleder/saksbehandlere', (req, res, ctx) =>
		res(
			ctx.json([
				{ navn: 'Ping Pong Paul', brukernavn: 'M088876', epost: 'pingpongpaul@nav.no' },
				{ navn: 'Strenge Stian', brukernavn: 'M111111', epost: 'saksbehandler1@nav.no' },
				{ navn: 'Helmut Hageberg', brukernavn: 'M222222', epost: 'saksbehandler2@nav.no' },
				{ navn: 'Avslå Altesen', brukernavn: 'M333333', epost: 'saksbehandler3@nav.no' },
				{ navn: 'Conrad Coinflip', brukernavn: 'M444444', epost: 'saksbehandler4@nav.no' },
				{
					navn: 'Jeg Har Mange Navn Og Bruker Helst Alle',
					brukernavn: 'M555555',
					epost: 'saksbehandler5@nav.no',
				},
				{ navn: 'Hacker Jørgen', brukernavn: 'M666666', epost: 'saksbehandler6@nav.no' },
				{ navn: 'Jorge Hermansen', brukernavn: 'M777777', epost: 'saksbehandler7@nav.no' },
				{ navn: 'Rettferdige Reidun', brukernavn: 'M888888', epost: 'saksbehandler8@nav.no' },
			]),
		),
	),
	oppgavemodellV2OpprettKø: rest.post('/api/opprett/v2', async (req, res, ctx) => {
		const data = await req.json();
		return res(
			ctx.json({
				id: '1',
				tittel: data.tittel,
			}),
		);
	}),
	oppgavemodellV2OppdaterKø: rest.post('/api/oppdater/v2', async (req, res, ctx) => {
		const data = await req.json();
		return res(
			ctx.json({
				id: '1',
				tittel: 'Beskrivende tittel',
				forklaring: 'godt forklart tekst om hva formålet med køen er',
				oppgavequery: [],
				saksbehandlere: [],
				...data,
				versjon: data.versjon ? data.versjon + 1 : 1,
			}),
		);
	}),
	oppgavemodellV2HentKø: rest.get('/api/hent/v2', async (req, res, ctx) =>
		res(
			ctx.json({
				id: '1',
				tittel: 'Beskrivende tittel',
				forklaring: 'godt forklart tekst om hva formålet med køen er',
				oppgavequery: [],
				saksbehandlere: [],
				versjon: 1,
			}),
		),
	),
	oppgavemodellV2HentAlleKø: rest.get('/api/alleKøer/v2', async (req, res, ctx) =>
		res(
			ctx.json([
				{
					id: '1',
					tittel: 'Beskrivende tittel',
					forklaring: 'godt forklart tekst om hva formålet med køen er',
					oppgavequery: [],
					saksbehandlere: [],
					versjon: 1,
				},
			]),
		),
	),
};

if (process.env.MSW_MODE === 'dev') {
	handlers = handlers.concat(Object.values(developmentHandlers));
}

export default handlers;
