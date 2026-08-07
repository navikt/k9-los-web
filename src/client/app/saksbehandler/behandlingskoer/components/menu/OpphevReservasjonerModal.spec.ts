import { describe, expect, it } from 'vitest';
import { opphevReservasjonerTekst } from './OpphevReservasjonerModal';

describe('opphevReservasjonerTekst', () => {
	it('beholder teksten for en reservasjon med en oppgave', () => {
		expect(opphevReservasjonerTekst(1, 1)).toBe('Er du sikker på at du vil oppheve reservasjonen?');
	});

	it('viser hvor mange oppgaver reservasjonen gjelder', () => {
		expect(opphevReservasjonerTekst(1, 3)).toBe('Er du sikker på at du vil oppheve reservasjonen av 3 oppgaver?');
	});

	it('beholder teksten for flere valgte reservasjoner', () => {
		expect(opphevReservasjonerTekst(2)).toBe('Er du sikker på at du vil oppheve 2 reservasjoner?');
	});
});
