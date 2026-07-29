# Pakkebehandler

Dette prosjektet bruker **pnpm**. Bruk alltid `pnpm` – aldri `npm` eller `yarn`.

- Installere dependencies: `pnpm install`
- Legge til pakke: `pnpm add <pakke>` / `pnpm add -D <pakke>`
- Fjerne pakke: `pnpm remove <pakke>`
- Kjøre script: `pnpm <script>` (f.eks. `pnpm test`, `pnpm build`)

Kun `pnpm-lock.yaml` skal være i repoet.

# Linting og formatering

`pnpm verify` kjører på **hele** prosjektet – både i pre-commit-hooken og i CI.

Vi brukte lint-staged tidligere og fjernet det bevisst (#4337): inkrementell
linting på kun endrede filer lot inkonsistens overleve, og full kjøring fanger
også opp filer som er commitet med `--no-verify`.

**Ikke foreslå lint-staged eller annen inkrementell linting på nytt.**

# Designsystem

Appen bruker Aksels designsystem https://aksel.nav.no/. Foretrekk komponenter herfra; beta-komponenter er også ok. Foretrekk Aksels CSS-klasser over rene Tailwind-klasser.

# Testing

- Test framework: Vitest (konfigurert i `test`-blokken i `vite.config.ts`)
- Test environment: `jsdom`
- Test pattern: `src/**/*.spec.{js,jsx,ts,tsx}`
- Setup: `setup/setup-test-env.ts`
- Ingen globals: importer `describe`, `it`, `expect` og `vi` eksplisitt fra `vitest`.
- Tidssonen er låst til `Europe/Oslo`, så datoassertions kan være eksakte.
- Bruk `screen` fra Testing Library framfor returverdien til `render()`.
- Bruk `userEvent.setup()` per test framfor å kalle `userEvent` direkte.

Kjøre tester:

```bash
pnpm test                                    # alle tester
pnpm vitest run src/.../dateUtils.spec.ts    # spesifikk fil
pnpm vitest run dateUtils                    # pattern
pnpm test:watch                              # watch
pnpm test:coverage                           # coverage
```
