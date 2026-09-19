import { BarChartIcon, FileSearchIcon, PersonGroupIcon, TasklistIcon, TimerPauseIcon } from '@navikt/aksel-icons';
import { Box, Heading, InlineMessage, Loader, Tabs, VStack } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { useOppgavefelter } from 'fleromrade/api/oppgaveQueries';
import { useVisK9Legacy } from 'fleromrade/k9legacy/KunK9Legacy';
import { LegacyAvdelingslederNøkkeltall, LegacyAvdelingslederStatus } from 'fleromrade/k9legacy/legacyKomponenter';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import BehandlingskoerIndex from './koer/BehandlingskoerIndex';
import { LagredeSøk } from './lagredeSøk/LagredeSøk';
import AvdelingslederReservasjonerTabell from './reservasjoner/components/AvdelingslederReservasjonerTabell';
import SaksbehandlereTabell from './saksbehandlere/components/SaksbehandlereTabell';

/** Fanene i avdelingslederpanelet. Verdiene er de samme som i K9, slik at lenker med `?fane=` virker likt. */
const fellesFaner = [
	{
		verdi: 'behandlingskoerV3',
		navn: 'Oppgavekøer',
		ikon: <TasklistIcon aria-hidden />,
		innhold: <BehandlingskoerIndex />,
	},
	{ verdi: 'lagredesok', navn: 'Lagrede søk', ikon: <FileSearchIcon aria-hidden />, innhold: <LagredeSøk /> },
	{
		verdi: 'reservasjoner',
		navn: 'Reservasjoner',
		ikon: <TimerPauseIcon aria-hidden />,
		innhold: <AvdelingslederReservasjonerTabell />,
	},
	{
		verdi: 'saksbehandlere',
		navn: 'Saksbehandlere',
		ikon: <PersonGroupIcon aria-hidden />,
		innhold: <SaksbehandlereTabell />,
	},
];

/** Nøkkeltall-fanen bruker fortsatt legacy-API og finnes bare for K9. Den står etter lagrede søk, som i K9. */
const legacyNøkkeltallFane = {
	verdi: 'nokkeltall',
	navn: 'Nøkkeltall',
	ikon: <BarChartIcon aria-hidden />,
	innhold: <LegacyAvdelingslederNøkkeltall />,
};

/**
 * Avdelingslederpanelet. For K9 vises også statuslinjen og nøkkeltall-fanen, som fortsatt bruker legacy-API.
 * Komponentene i `filter/` leser oppgavefeltene fra `AppContext`, så panelet gir dem feltene for området fra
 * den nye klienten.
 */
const AvdelingslederPanel = () => {
	const [søkeparametere, setSøkeparametere] = useSearchParams();
	const { data: felter, isPending, isError } = useOppgavefelter();
	const appContext = useMemo(() => ({ felter: felter ?? [] }), [felter]);
	const visK9Legacy = useVisK9Legacy();
	const faner = visK9Legacy ? fellesFaner.toSpliced(2, 0, legacyNøkkeltallFane) : fellesFaner;

	const valgtFane = faner.some((fane) => fane.verdi === søkeparametere.get('fane'))
		? søkeparametere.get('fane')
		: faner[0].verdi;

	const velgFane = (fane: string) =>
		setSøkeparametere((forrige) => {
			const neste = new URLSearchParams(forrige);
			neste.set('fane', fane);
			return neste;
		});

	return (
		<Box as="main" padding={{ xs: 'space-16', md: 'space-24' }}>
			<VStack gap="space-24" className="max-w-[1400px]">
				<Heading level="1" size="large">
					Avdelingslederpanel
				</Heading>
				{isPending && <Loader title="Henter oppgavefelter" />}
				{isError && <InlineMessage status="error">Kunne ikke hente oppgavefeltene for området</InlineMessage>}
				{felter && (
					<AppContext.Provider value={appContext}>
						<LegacyAvdelingslederStatus />
						<Tabs value={valgtFane} onChange={velgFane}>
							<Tabs.List>
								{faner.map((fane) => (
									<Tabs.Tab key={fane.verdi} value={fane.verdi} label={fane.navn} icon={fane.ikon} />
								))}
							</Tabs.List>
							{faner.map((fane) => (
								<Tabs.Panel key={fane.verdi} value={fane.verdi} lazy>
									<Box background="raised" padding="space-24">
										{fane.innhold}
									</Box>
								</Tabs.Panel>
							))}
						</Tabs>
					</AppContext.Provider>
				)}
			</VStack>
		</Box>
	);
};

export default AvdelingslederPanel;
