# Pakkebehandler

Dette prosjektet bruker **yarn** (Yarn 4). Bruk alltid `yarn` – aldri `npm`.

- Installere dependencies: `yarn install`
- Legge til pakke: `yarn add <pakke>` / `yarn add -D <pakke>`
- Fjerne pakke: `yarn remove <pakke>`
- Kjøre script: `yarn <script>` (f.eks. `yarn test`, `yarn build`)

Ikke kjør `npm install` eller commit `package-lock.json` – kun `yarn.lock` skal være i repoet.

# Designsystem

Appen bruker Aksels designsystem https://aksel.nav.no/. Foretrekk komponenter herfra; beta-komponenter er også ok. Foretrekk Aksels CSS-klasser over rene Tailwind-klasser.

# Testing

- Test framework: Jest
- Test environment: `jest-fixed-jsdom`
- Test pattern: `**/?(*.)+(spec).+(js|jsx|ts|tsx)`
- Setup: `setup/setup.js`, `setup/setup-test-env.ts`

Kjøre tester:

```bash
yarn test                                          # alle tester
yarn jest --colors src/.../dateUtils.spec.ts       # spesifikk fil
yarn jest --colors dateUtils                       # pattern
yarn jest --colors --watch                         # watch
yarn jest --colors --coverage                      # coverage
```
