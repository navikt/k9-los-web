import type { OppgaveQuery as GenerertOppgaveQuery } from 'api/generated/los.schemas';
import type { OppgaveQuery } from 'filter/filterTsTypes';

/**
 * Konverterer mellom query-typene i `filter/` og den genererte klienten.
 *
 * OpenAPI-spec-en mangler `type`-diskriminatoren (`feltverdi`, `combine`, `enkel`, `aggregert`) og typer
 * `verdi` som objekter, mens backend faktisk sender og tar imot samme form som `filter/filterTsTypes`.
 * Til spec-en er rettet bruker vi de håndskrevne typene og konverterer ved grensen mot klienten.
 */
export const tilKlientQuery = (query: OppgaveQuery) => query as unknown as GenerertOppgaveQuery;

export const fraKlientQuery = (query: GenerertOppgaveQuery) => query as unknown as OppgaveQuery;
