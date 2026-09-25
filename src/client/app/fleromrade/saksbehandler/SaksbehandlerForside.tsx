import { Box, HGrid, VStack } from '@navikt/ds-react';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import { LegacySaksbehandlerNøkkeltall } from 'fleromrade/k9legacy/legacyKomponenter';
import type { ReactNode } from 'react';
import KøPanel from './ko/KøPanel';
import SisteOppgaver from './SisteOppgaver';
import Søkeboks from './sok/Søkeboks';

const Panel = ({ children }: { children: ReactNode }) => (
	<Box background="raised" borderRadius="4" padding="space-16">
		{children}
	</Box>
);

const SaksbehandlerForside = () => {
	const { data: bruker } = useInnloggetBruker();

	return (
		<Box as="main" padding={{ xs: 'space-16', md: 'space-24' }}>
			<HGrid columns={{ xs: 1, xl: '2fr 1fr' }} gap="space-24" align="start">
				<VStack gap="space-24">
					<Panel>
						<Søkeboks />
					</Panel>
					{bruker.finnesISaksbehandlerTabell && (
						<Panel>
							<KøPanel />
						</Panel>
					)}
				</VStack>
				<Panel>
					<VStack gap="space-24">
						<SisteOppgaver />
						<LegacySaksbehandlerNøkkeltall />
					</VStack>
				</Panel>
			</HGrid>
		</Box>
	);
};

export default SaksbehandlerForside;
