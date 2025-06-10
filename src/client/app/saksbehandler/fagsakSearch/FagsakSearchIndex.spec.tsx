/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { unitTestHandlers } from 'mocks/unitTestHandlers';
import { http } from 'msw';
import { setupServer } from 'msw/node';
import apiPaths from 'api/apiPaths';
import { renderWithAllProviders } from '../../../../../setup/testHelpers/testUtils';
import FagsakSearchIndex from './FagsakSearchIndex';

const server = setupServer(...unitTestHandlers, ureservertOppgaveHandler());
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('FagsakSearchIndex', () => {
	it('Kan åpne eller reservere oppgave som er reservert av annen saksbehandler', async () => {
		server.use(reservertOppgaveHandler());
		const { getByText, getByRole } = renderWithAllProviders(<FagsakSearchIndex k9punsjUrl="test" k9sakUrl="test" />);
		await userEvent.type(getByText('Søk på saksnummer, personnummer eller journalpost-id'), '5YC1S');
		const searchButton = getByRole('button', { name: 'Søk' });
		expect(searchButton).toBeEnabled();
		await userEvent.click(searchButton);
		const row = await waitFor(() => getByText('5YC1S (2024)'));
		await userEvent.click(row);
		expect(getByRole('button', { name: 'Avbryt' })).toBeEnabled();
		expect(getByRole('button', { name: 'Åpne oppgaven' })).toBeEnabled();
		expect(getByRole('button', { name: 'Reserver og åpne oppgave' })).toBeEnabled();
	});

	it('kan åpne oppgave som er på vent', async () => {
		server.use(paaVentOppgaveHandler());
		const { getByText, getByRole } = renderWithAllProviders(<FagsakSearchIndex k9punsjUrl="test" k9sakUrl="test" />);
		await userEvent.type(getByText('Søk på saksnummer, personnummer eller journalpost-id'), '5YC1S');
		const searchButton = getByRole('button', { name: 'Søk' });
		expect(searchButton).toBeEnabled();
		await userEvent.click(searchButton);
		const row = await waitFor(() => getByText('5YC1S (2024)'));
		await userEvent.click(row);
		expect(getByText('Oppgaven er satt på vent')).toBeDefined();
		expect(getByRole('button', { name: 'Avbryt' })).toBeEnabled();
		expect(getByRole('button', { name: 'Åpne oppgaven' })).toBeEnabled();
	});

	it('kan åpne eller reservere oppgave som ikke er reservert', async () => {
		server.use(ureservertOppgaveHandler());
		const { getByText, getByRole } = renderWithAllProviders(<FagsakSearchIndex k9punsjUrl="test" k9sakUrl="test" />);
		await userEvent.type(getByText('Søk på saksnummer, personnummer eller journalpost-id'), '5YC1S');
		const searchButton = getByRole('button', { name: 'Søk' });
		expect(searchButton).toBeEnabled();
		await userEvent.click(searchButton);
		const row = await waitFor(() => getByText('5YC1S (2024)'));
		await userEvent.click(row);
		expect(getByText('Hva ønsker du å gjøre med oppgaven?')).toBeDefined();
		expect(getByRole('button', { name: 'Avbryt' })).toBeEnabled();
		expect(getByRole('button', { name: 'Reserver og åpne oppgave' })).toBeEnabled();
		expect(getByRole('button', { name: 'Åpne oppgaven' })).toBeEnabled();
	});

	it('kan åpne oppgave eller legge tilbake i kø hvis innlogget bruker har reservert oppgaven fra før av', async () => {
		server.use(oppgaveReservertAvInnloggetBruker());
		const { getByText, getByRole } = renderWithAllProviders(<FagsakSearchIndex k9punsjUrl="test" k9sakUrl="test" />);
		await userEvent.type(getByText('Søk på saksnummer, personnummer eller journalpost-id'), '5YC1S');
		const searchButton = getByRole('button', { name: 'Søk' });
		expect(searchButton).toBeEnabled();
		await userEvent.click(searchButton);
		const row = await waitFor(() => getByText('5YC1S (2024)'));
		await userEvent.click(row);
	});
});

function ureservertOppgaveHandler() {
	return http.post(
		apiPaths.sok,
		() =>
			new Response(
				JSON.stringify({
					ikkeTilgang: false,
					person: null,
					oppgaver: [
						{
							status: {
								erReservert: false,
								erReservertAvInnloggetBruker: false,
							},
							behandlingId: null,
							journalpostId: null,
							saksnummer: '5YC1S',
							navn: 'ForkortetNavn',
							system: 'K9SAK',
							personnummer: '012345678901',
							behandlingstype: {
								kode: 'BT-002',
								navn: 'Førstegangsbehandling',
								kodeverk: 'ae0034',
							},
							fagsakYtelseType: {
								kode: 'PSB',
								navn: 'Pleiepenger sykt barn',
								kodeverk: 'FAGSAK_YTELSE_TYPE',
							},
							behandlingStatus: {
								kode: 'UTRED',
								navn: 'Utredes',
								kodeverk: 'BEHANDLING_TYPE',
							},
							erTilSaksbehandling: true,
							opprettetTidspunkt: '2024-07-09T09:35:58',
							behandlingsfrist: '2024-08-20T00:00:00',
							eksternId: 'eeae15c0-0011-4ace-a8af-7ddc523c38a5',
							tilBeslutter: false,
							utbetalingTilBruker: false,
							avklarArbeidsforhold: false,
							selvstendigFrilans: false,
							søktGradering: false,
							fagsakPeriode: {
								fom: '2024-06-11',
								tom: '2024-08-11',
							},
							paaVent: null,
							merknad: null,
							oppgaveNøkkel: {
								oppgaveEksternId: 'eeae15c0-0011-4ace-a8af-7ddc523c38a5',
								oppgaveTypeEksternId: 'V1Oppgave',
								områdeEksternId: 'V1Oppgave',
							},
							endretAvNavn: null,
						},
					],
				}),
			),
	);
}

function reservertOppgaveHandler() {
	return http.post(
		apiPaths.sok,
		() =>
			new Response(
				JSON.stringify({
					ikkeTilgang: false,
					person: null,
					oppgaver: [
						{
							status: {
								erReservert: true,
								reservertTilTidspunkt: '2024-07-11T23:59:00',
								erReservertAvInnloggetBruker: false,
								reservertAv: 'Z654321',
								reservertAvNavn: 'Saksbehandler Klara',
								flyttetReservasjon: null,
								kanOverstyres: false,
								beskjed: null,
							},
							behandlingId: null,
							journalpostId: null,
							saksnummer: '5YC1S',
							navn: 'ForkortetNavn',
							system: 'K9SAK',
							personnummer: '012345678901',
							behandlingstype: {
								kode: 'BT-002',
								navn: 'Førstegangsbehandling',
								kodeverk: 'ae0034',
							},
							fagsakYtelseType: {
								kode: 'PSB',
								navn: 'Pleiepenger sykt barn',
								kodeverk: 'FAGSAK_YTELSE_TYPE',
							},
							behandlingStatus: {
								kode: 'UTRED',
								navn: 'Utredes',
								kodeverk: 'BEHANDLING_TYPE',
							},
							erTilSaksbehandling: true,
							opprettetTidspunkt: '2024-07-09T09:35:58',
							behandlingsfrist: '2024-08-20T00:00:00',
							eksternId: 'eeae15c0-0011-4ace-a8af-7ddc523c38a5',
							tilBeslutter: false,
							utbetalingTilBruker: false,
							avklarArbeidsforhold: false,
							selvstendigFrilans: false,
							søktGradering: false,
							fagsakPeriode: {
								fom: '2024-06-11',
								tom: '2024-08-11',
							},
							paaVent: null,
							merknad: null,
							oppgaveNøkkel: {
								oppgaveEksternId: 'eeae15c0-0011-4ace-a8af-7ddc523c38a5',
								oppgaveTypeEksternId: 'V1Oppgave',
								områdeEksternId: 'V1Oppgave',
							},
							endretAvNavn: null,
						},
					],
				}),
			),
	);
}

function paaVentOppgaveHandler() {
	return http.post(
		apiPaths.sok,
		() =>
			new Response(
				JSON.stringify({
					ikkeTilgang: false,
					person: null,
					oppgaver: [
						{
							status: {
								erReservert: false,
								reservertTilTidspunkt: '2024-07-11T23:59:00',
								erReservertAvInnloggetBruker: false,
								reservertAv: 'Z654321',
								reservertAvNavn: 'Saksbehandler Klara',
								flyttetReservasjon: null,
								kanOverstyres: false,
								beskjed: null,
							},
							behandlingId: null,
							journalpostId: null,
							saksnummer: '5YC1S',
							navn: 'ForkortetNavn',
							system: 'K9SAK',
							personnummer: '012345678901',
							behandlingstype: {
								kode: 'BT-002',
								navn: 'Førstegangsbehandling',
								kodeverk: 'ae0034',
							},
							fagsakYtelseType: {
								kode: 'PSB',
								navn: 'Pleiepenger sykt barn',
								kodeverk: 'FAGSAK_YTELSE_TYPE',
							},
							behandlingStatus: {
								kode: 'UTRED',
								navn: 'Utredes',
								kodeverk: 'BEHANDLING_TYPE',
							},
							erTilSaksbehandling: true,
							opprettetTidspunkt: '2024-07-09T09:35:58',
							behandlingsfrist: '2024-08-20T00:00:00',
							eksternId: 'eeae15c0-0011-4ace-a8af-7ddc523c38a5',
							tilBeslutter: false,
							utbetalingTilBruker: false,
							avklarArbeidsforhold: false,
							selvstendigFrilans: false,
							søktGradering: false,
							fagsakPeriode: {
								fom: '2024-06-11',
								tom: '2024-08-11',
							},
							paaVent: true,
							merknad: null,
							oppgaveNøkkel: {
								oppgaveEksternId: 'eeae15c0-0011-4ace-a8af-7ddc523c38a5',
								oppgaveTypeEksternId: 'V1Oppgave',
								områdeEksternId: 'V1Oppgave',
							},
							endretAvNavn: null,
						},
					],
				}),
			),
	);
}

function oppgaveReservertAvInnloggetBruker() {
	return http.post(
		apiPaths.sok,
		() =>
			new Response(
				JSON.stringify({
					ikkeTilgang: false,
					person: null,
					oppgaver: [
						{
							status: {
								erReservert: true,
								reservertTilTidspunkt: '2024-07-11T23:59:00',
								erReservertAvInnloggetBruker: true,
								reservertAv: 'Z123456',
								reservertAvNavn: 'Saksbehandler Sara',
								flyttetReservasjon: null,
								kanOverstyres: false,
								beskjed: null,
							},
							behandlingId: null,
							journalpostId: null,
							saksnummer: '5YC1S',
							navn: 'ForkortetNavn',
							system: 'K9SAK',
							personnummer: '012345678901',
							behandlingstype: {
								kode: 'BT-002',
								navn: 'Førstegangsbehandling',
								kodeverk: 'ae0034',
							},
							fagsakYtelseType: {
								kode: 'PSB',
								navn: 'Pleiepenger sykt barn',
								kodeverk: 'FAGSAK_YTELSE_TYPE',
							},
							behandlingStatus: {
								kode: 'UTRED',
								navn: 'Utredes',
								kodeverk: 'BEHANDLING_TYPE',
							},
							erTilSaksbehandling: true,
							opprettetTidspunkt: '2024-07-09T09:35:58',
							behandlingsfrist: '2024-08-20T00:00:00',
							eksternId: 'eeae15c0-0011-4ace-a8af-7ddc523c38a5',
							tilBeslutter: false,
							utbetalingTilBruker: false,
							avklarArbeidsforhold: false,
							selvstendigFrilans: false,
							søktGradering: false,
							fagsakPeriode: {
								fom: '2024-06-11',
								tom: '2024-08-11',
							},
							paaVent: null,
							merknad: null,
							oppgaveNøkkel: {
								oppgaveEksternId: 'eeae15c0-0011-4ace-a8af-7ddc523c38a5',
								oppgaveTypeEksternId: 'V1Oppgave',
								områdeEksternId: 'V1Oppgave',
							},
							endretAvNavn: null,
						},
					],
				}),
			),
	);
}
