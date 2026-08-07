import { describe, expect, it } from 'vitest';
import { antallOppgaverTekst } from './FlyttReservasjonerModal';

describe('antallOppgaverTekst', () => {
	it('legger ikke til tekst for en reservasjon med en oppgave', () => {
		expect(antallOppgaverTekst(1)).toBeNull();
	});

	it('viser hvor mange oppgaver reservasjonen gjelder', () => {
		expect(antallOppgaverTekst(3)).toBe('Reservasjonen gjelder 3 oppgaver.');
	});
});
