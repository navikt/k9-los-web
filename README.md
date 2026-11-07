# Komme i gang

## Dependencies

`k9-los-web` har dependencies til pakker publisert fra [k9-saksbehandling-frontend](https://github.com/navikt/k9-saksbehandling-frontend).

## Oppsett for Lokal Utvikling

### Autentisering med GitHub's Package Registry

Før du kjører `pnpm install`, sett opp lokal NPM for autentisering mot GitHub ved hjelp av en Personal Access Token (PAT) med `read:packages`-tilgang. For mer informasjon, se den [offisielle GitHub-guiden](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

**Korte Trinn**:

1. Opprett en GitHub PAT med `read:packages`-tilgang.
2. Aktiver SSO.
3. Registry-mappingen for `@navikt` ligger allerede i `.npmrc` i repoet. Selve tokenet må ligge i din globale `~/.npmrc` (pnpm ekspanderer av sikkerhetsgrunner ikke miljøvariabler i prosjektets innsjekkede `.npmrc`):

   ```
   //npm.pkg.github.com/:_authToken=<token>
   ```

⚠️ Merk: Dette skal ikke sjekkes inn i versjonskontroll.

#### Lokal utvikling

0. Legg inn azure-mock i /etc/hosts. Hvis ikke dette er utført får man følgende feilmelding: ErrorCaused by: java.net.UnknownHostException: azure-mock.
   Verdi som skal legges inn i hosts filen:

```

127.0.0.1 azure-mock

```

1. Kjør opp docker-containerene i verdikjede (https://github.com/navikt/k9-verdikjede)

```
   docker-compose up -d k9-los
```

2. Kjør opp k9-los-web lokalt med pnpm dev
3. Opprett ønsket kø i avdelingslederpanelet og legg til saksbehandler i køen
4. Kjør tester i verdikjede for å opprette saker. Man kan slette deler av testene for å få behandlinger som ikke er ferdigstilt.
   Les dokumentasjon i https://github.com/navikt/k9-verdikjede for å kjøre tester.
5. Det KAN hende localhost:8020/mock kan brukes for å opprette oppgaver i LOS.
   Vedlikehold av denne mocken er ikke prioritert og den kan derfor være utdatert og ustabil.

Nå kan du søke opp saksnummeret eller søkeren i k9-los-web. Dersom oppgaven matcher kriteriene i en av dine køer vil den også dukke opp i listen over oppgaver.

##### Bygge k9-los-web i docker og kjøre mot k9-los-web i veridkjede

1. pnpm build
2. docker build -t k9-los-web:din-valgfrie-tag
3.

```
   docker run -p 8031:8031 --env IS_VERDIKJEDE=true --env PORT=8031 --env PROXY_CONFIG='{"apis":[{"path":"/api/k9-los-api","url":"http://host.docker.internal:8020","auth":"obo","scopes":"api://k9-los-web/.default", "backendPath":"/api"}]}' k9-los-web:din-valgfrie-tag
```

## Playwright mot lokal LOS

Testene i `e2e/` bruker ekte LOS-backend, uten å opprette saker i k9-sak.

1. Behold de vanlige støttetjenestene i Podman. Start `K9LosDev` fra `k9-los-api` i IntelliJ på port 8020. Starteren aktiverer testdata-API-et i LOCAL-profilen.
2. Kjør `pnpm dev` i dette repoet på port 8031.
3. Installer Chromium én gang med `pnpm exec playwright install chromium`.
4. Kjør `pnpm test:e2e`, eller `pnpm test:e2e:ui` for interaktiv kjøring.

Du trenger ikke starte Compose-servicen `k9-los` eller stoppe IntelliJ-backenden. Playwright starter ingen tjenester lokalt. En annen frontend-adresse kan angis med `PLAYWRIGHT_BASE_URL`.

Suiten dekker køadministrasjon, plukking og fem reservasjonsflyter: tilbakelegging, forlengelse, flytting til en annen saksbehandler og avdelingsleders oppheving og endring av reservasjoner. Alle testene kontrollerer at det LOCAL-avgrensede testdata-API-et er tilgjengelig før de endrer data.

Reservasjonstestene oppretter egne oppgaver gjennom testdata-API-et og reserverer dem gjennom ordinært LOS-API. Køadministrasjonstesten trenger ingen oppgave. Plukktesten oppretter en egen kø avgrenset til testoppgavens UUID, samt en annen oppgave som skal bli liggende ureservert.

Plukktesten stubber lagring av «siste oppgaver», fordi den ellers kan skyve ut eksisterende historikk for den lokale saksbehandleren Sara. Navigasjonsmålet erstattes med en statisk side, slik at k9-sak-web ikke må kjøre. Køfiltrering og reservering bruker ekte LOS-backend i både lokal kjøring og CI.

Oppryddingen kjører også ved testfeil og sletter bare testenes registrerte kø-ID-er og egne oppgaver. Ikke start backend på nytt mens testen kjører: oversikten over hvilke oppgaver testdata-API-et eier, ligger i minnet.

Enkelte flyter kan kjøres separat, for eksempel `pnpm test:e2e reservasjoner` eller `pnpm test:e2e plukke-oppgave`.

### GitHub Actions

Workflowen `los-e2e.yml` bygger backend fra kildekode og starter PostgreSQL, Kafka og azure-mock. VTP og k9-sak inngår ikke. CI starter frontend med Vite og kjører samme `pnpm test:e2e` som lokalt. Dette tester ikke produksjonsinnlogging eller frontendens Node-proxy.

Før første automatiske kjøring må backend-endringene være tilgjengelige på GitHub. Sett repo-variabelen `LOS_E2E_API_REF` til en full commit-SHA i `k9-los-api` som inneholder testdatastøtten og `.github/e2e/`. Workflowen bruker eksisterende `READER_TOKEN` til lesing av backend-repoet og pakker. Ingen flytende `latest` brukes for applikasjonskoden.

Ved manuell kjøring kan `api_ref` overstyre backend-versjonen. Workflowen kan også kalles fra backend-repoet med eksplisitte `api_ref` og `web_ref`. Fest da workflow-referansen til en publisert commit-SHA. Begge applikasjonsversjonene vises i kjøringsrapporten. Playwright-rapport og tjenestelogger lastes opp som artifacts.

`k9-verdikjede/frontend/k9-los-web-e2e` inneholder én smal test av faktisk hendelsesleveranse fra k9-sak til en plukkbar oppgave i LOS. Den brede kriteriematrisen er flyttet til 12 komponenttester i `src/client/app/filter/KøKriterieEditor.spec.tsx`, som kontrollerer verdier, operatorer og gruppering gjennom lagring og gjenåpning av editoren. HTTP-valideringen mockes i komponenttestene; ekte frontend/backend-lagring dekkes av Playwright-suiten her.

### For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen **#k9-los**.

## Kode generert av GitHub Copilot

Dette repoet bruker GitHub Copilot til å generere kode.
