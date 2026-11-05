import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import { useReserverOppgaveForSaksbehandler } from 'fleromrade/api/saksbehandlerQueries';
import { mutationResultat, queryResultat } from 'fleromrade/testUtils';
import { describe, expect, it, vi } from 'vitest';
import { innloggetBruker, lagOppgaveSammendrag } from '../testdata';
import OppgaveTabell from './OppgaveTabell';

vi.mock('fleromrade/api/innloggetBrukerQueries');
vi.mock('fleromrade/api/saksbehandlerQueries');
vi.mock('./useOppgaveHandlinger', () => ({ useOppgaveHandlinger: () => ({}) }));

const oppgave = lagOppgaveSammendrag({ saksnummer: '238' });

describe('OppgaveTabell', () => {
	it('viser kopiknapper uten å gjøre raden klikkbar', async () => {
		const user = userEvent.setup();
		vi.mocked(useInnloggetBruker).mockReturnValue(queryResultat(innloggetBruker));
		vi.mocked(useReserverOppgaveForSaksbehandler).mockReturnValue(mutationResultat());
		render(<OppgaveTabell oppgaver={[oppgave]} visHandlinger />);
		const rad = screen.getAllByRole('row')[1];

		expect(rad).not.toHaveAttribute('tabindex');
		expect(within(rad).getByRole('button', { name: 'Kopier fødselsnummer' })).toBeInTheDocument();
		expect(within(rad).getByRole('button', { name: 'Kopier saksnummer' })).toBeInTheDocument();
		expect(within(rad).getByRole('button', { name: 'Reserver oppgave 238' })).toBeInTheDocument();
		expect(within(rad).getByRole('button', { name: 'Handlinger på oppgave 238' })).toBeInTheDocument();
		await user.click(within(rad).getByText('Kari Nordmann'));
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('viser ikke handlingsmenyen når fritt valg er slått av', () => {
		render(<OppgaveTabell oppgaver={[oppgave]} />);

		expect(screen.queryByRole('columnheader', { name: 'Handlinger' })).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /Handlinger på oppgave/ })).not.toBeInTheDocument();
	});

	it('viser kopiknapp på journalpost-id når oppgaven ikke har saksnummer', () => {
		render(<OppgaveTabell oppgaver={[lagOppgaveSammendrag({ saksnummer: null, journalpostId: '000111222' })]} />);

		expect(screen.getByRole('button', { name: 'Kopier journalpost-id' })).toBeInTheDocument();
	});

	it('lar hele søkeresultatraden velges med mus, Enter og mellomrom uten kopiknapper', async () => {
		const user = userEvent.setup();
		const velg = vi.fn();
		render(<OppgaveTabell oppgaver={[oppgave]} onVelgOppgave={velg} />);
		const rad = screen.getByRole('row', { name: /238/ });
		expect(rad).toHaveAttribute('tabindex', '0');
		expect(within(rad).queryByRole('button')).not.toBeInTheDocument();
		await user.click(rad);
		rad.focus();
		await user.keyboard('{Enter} ');
		expect(velg).toHaveBeenCalledTimes(3);
		expect(velg).toHaveBeenLastCalledWith(oppgave);
	});
});
