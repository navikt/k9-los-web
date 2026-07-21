# Pakkebehandler

Dette prosjektet bruker **pnpm**. Bruk alltid `pnpm` – aldri `npm` eller `yarn`.

- Installere dependencies: `pnpm install`
- Legge til pakke: `pnpm add <pakke>` / `pnpm add -D <pakke>`
- Fjerne pakke: `pnpm remove <pakke>`
- Kjøre script: `pnpm <script>` (f.eks. `pnpm test`, `pnpm build`)

Ikke kjør `npm install`/`yarn install` eller commit `package-lock.json`/`yarn.lock` – kun `pnpm-lock.yaml` skal være i repoet.

# Designsystem

Appen bruker Aksels designsystem https://aksel.nav.no/. Foretrekk komponenter herfra; beta-komponenter er også ok. Foretrekk Aksels CSS-klasser over rene Tailwind-klasser.

# Testing

- Test framework: Jest
- Test environment: `jest-fixed-jsdom`
- Test pattern: `**/?(*.)+(spec).+(js|jsx|ts|tsx)`
- Setup: `setup/setup.js`, `setup/setup-test-env.ts`

Kjøre tester:

```bash
pnpm test                                          # alle tester
pnpm jest --colors src/.../dateUtils.spec.ts       # spesifikk fil
pnpm jest --colors dateUtils                       # pattern
pnpm jest --colors --watch                         # watch
pnpm jest --colors --coverage                      # coverage
```
