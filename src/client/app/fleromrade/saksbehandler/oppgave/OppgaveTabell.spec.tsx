import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { lagOppgaveSammendrag } from '../testdata';
import OppgaveTabell from './OppgaveTabell';

vi.mock('./oppgaveMenyViewModel', () => ({ useOppgaveMenyViewModel: () => ({ harHentetData: false }) }));

const oppgave = lagOppgaveSammendrag({ saksnummer: '238' });

describe('OppgaveTabell', () => {
	it('viser kopiknapper uten å gjøre raden klikkbar', async () => {
		const user = userEvent.setup();
		render(<OppgaveTabell oppgaver={[oppgave]} visHandlinger />);
		const rad = screen.getAllByRole('row')[1];

		expect(rad).not.toHaveAttribute('tabindex');
		expect(within(rad).getByRole('button', { name: 'Kopier fødselsnummer' })).toBeInTheDocument();
		expect(within(rad).getByRole('button', { name: 'Kopier saksnummer' })).toBeInTheDocument();
		expect(within(rad).getByRole('button', { name: 'Reserver/åpne oppgave 238' })).toBeInTheDocument();
		await user.click(within(rad).getByText('Kari Nordmann'));
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('viser ikke handlingsmenyen når fritt valg er slått av', () => {
		render(<OppgaveTabell oppgaver={[oppgave]} />);

		expect(screen.queryByRole('columnheader', { name: 'Handlinger' })).not.toBeInTheDocument();
		expect(screen.queryByRole('button', { name: /Reserver\/åpne/ })).not.toBeInTheDocument();
	});

	it('viser kopiknapp på journalpost-id når oppgaven ikke har saksnummer', () => {
		render(<OppgaveTabell oppgaver={[lagOppgaveSammendrag({ saksnummer: null, journalpostId: '000111222' })]} />);

		expect(screen.getByRole('button', { name: 'Kopier journalpost-id' })).toBeInTheDocument();
	});
});
