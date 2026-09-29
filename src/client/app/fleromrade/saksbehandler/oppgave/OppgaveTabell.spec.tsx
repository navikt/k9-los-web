import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { lagOppgaveSammendrag } from '../testdata';
import OppgaveTabell from './OppgaveTabell';

const oppgave = lagOppgaveSammendrag({ saksnummer: '238' });

const dataRad = () => screen.getAllByRole('row')[1];

describe('OppgaveTabell', () => {
	it('viser en chevron som markerer at raden kan åpnes når hele raden er klikkbar', () => {
		render(<OppgaveTabell oppgaver={[oppgave]} velg={{ med: 'rad', onVelgOppgave: vi.fn() }} />);

		expect(screen.getByRole('columnheader', { name: 'Åpne oppgave' })).toBeInTheDocument();
		const sisteCelle = within(dataRad()).getAllByRole('cell').at(-1);
		expect(sisteCelle?.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
	});

	it('viser ikke chevron når oppgaven velges med knapp', () => {
		render(<OppgaveTabell oppgaver={[oppgave]} velg={{ med: 'knapp', onVelgOppgave: vi.fn() }} />);

		expect(screen.queryByRole('columnheader', { name: 'Åpne oppgave' })).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Velg oppgave 238' })).toBeInTheDocument();
	});

	it('velger oppgaven når raden har fokus og brukeren trykker Enter', async () => {
		const user = userEvent.setup();
		const onVelgOppgave = vi.fn();
		render(<OppgaveTabell oppgaver={[oppgave]} velg={{ med: 'rad', onVelgOppgave }} />);

		await user.tab();
		expect(dataRad()).toHaveFocus();
		await user.keyboard('{Enter}');

		expect(onVelgOppgave).toHaveBeenCalledWith(oppgave);
	});
});
