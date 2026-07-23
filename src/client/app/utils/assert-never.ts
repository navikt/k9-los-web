/**
 * Utility funksjon som brukes for å sikre at alle mulige tilfeller er håndtert i en switch-setning eller lignende.
 */
export function assertNever(value: never): never {
	throw new Error(`Uventet verdi: ${String(value)}`);
}
