/**
 * Henter visningsnavnet fra et kodeverkfelt.
 *
 * OpenAPI-spec-en typer f.eks. `GenerellOppgaveV3Dto.behandlingstype` som en enum-streng, mens backend
 * faktisk sender et objekt med `kode` og `navn`. Til spec-en er rettet håndterer vi begge formene.
 */
export const visningsnavn = (verdi: unknown): string => {
	if (typeof verdi === 'string') {
		return verdi;
	}
	if (typeof verdi === 'object' && verdi !== null && 'navn' in verdi && typeof verdi.navn === 'string') {
		return verdi.navn;
	}
	return '';
};
