# Testinstruksjoner for k9-los-web

Dette prosjektet bruker Jest for testing. Testfiler ligger i `src/` og følger navnekonvensjonen `*.spec.ts` eller `*.spec.tsx`.

## Kjøre tester

```bash
# Alle tester
yarn test

# Spesifikk fil
jest --colors src/client/app/utils/dateUtils.spec.ts

# Med pattern matching
jest --colors dateUtils

# Alle tester i en mappe
jest --colors src/client/app/utils/
```

## Watch-modus (kontinuerlig under utvikling)

```bash
jest --colors --watch
```

## Coverage

```bash
jest --colors --coverage
```

## Nyttige Jest-flagg

| Flagg | Beskrivelse |
|-------|-------------|
| `--verbose` | Detaljert output for hver test |
| `--silent` | Skjuler console.log output |
| `--bail` | Stopper ved første feil |
| `--maxWorkers=4` | Begrenser parallelle workers |
| `--no-cache` | Sletter Jest cache |

## Testoppsett

- **Test framework:** Jest
- **Test pattern:** `**/?(*.)+(spec).+(js|jsx|ts|tsx)`
- **Test environment:** jest-fixed-jsdom
- **Setup files:** `setup/setup.js`, `setup/setup-test-env.ts`

## Ignored paths

- `/node_modules/`
- `/dist/`
- `/jest_cache/`
