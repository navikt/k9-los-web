# Pakkebehandler

Dette prosjektet bruker **pnpm**. Bruk alltid `pnpm` – aldri `npm` eller `yarn`.

- Installere dependencies: `pnpm install`
- Legge til pakke: `pnpm add <pakke>` / `pnpm add -D <pakke>`
- Fjerne pakke: `pnpm remove <pakke>`
- Kjøre script: `pnpm <script>` (f.eks. `pnpm test`, `pnpm build`)

Kun `pnpm-lock.yaml` skal være i repoet.

# Designsystem

Appen bruker Aksels designsystem https://aksel.nav.no/. Foretrekk komponenter herfra; beta-komponenter er også ok. Foretrekk Aksels CSS-klasser over rene Tailwind-klasser.

# Testing

- Test framework: Vitest (konfigurert i `test`-blokken i `vite.config.ts`)
- Test environment: `jsdom`
- Test pattern: `src/**/*.spec.{js,jsx,ts,tsx}`
- Setup: `setup/setup-test-env.ts`
- `describe`/`it`/`expect` er globale (`globals: true`). `vi` må importeres fra `vitest`.

Kjøre tester:

```bash
pnpm test                                    # alle tester
pnpm vitest run src/.../dateUtils.spec.ts    # spesifikk fil
pnpm vitest run dateUtils                    # pattern
pnpm test:watch                              # watch
pnpm test:coverage                           # coverage
```
