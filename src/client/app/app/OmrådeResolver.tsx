import { BodyShort, Box, Button, Heading, Loader, LocalAlert, VStack } from '@navikt/ds-react';
import { useInnloggetBrukersOmråder } from 'fleromrade/api/områdeQueries';
import { OmrådeProvider } from 'fleromrade/OmrådeContext';
import { basisstiForOmråde, områdenavn } from 'fleromrade/områder';
import type { FunctionComponent, ReactElement } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

interface OwnProps {
	/** K9 på legacy-API. */
	k9: (kanBytteOmråde: boolean) => ReactElement;
	/** Skallet for områder på ny API. Rendres med området i konteksten. */
	fleromrade: ReactElement;
}

type Appvalg = 'K9_LEGACY' | 'K9_NY' | 'AKTIVITETSPENGER';

const erProd = window.location.hostname.includes('intern.nav.no');

// Enkle, midlertidige funksjonsbrytere. Endre verdien lokalt for å teste kombinasjonene.
const visLegacyOgNyK9 = !erProd;
const aktiverAktivitetspenger = !erProd;

const k9LegacySti = '/k9';
const k9NySti = basisstiForOmråde.K9;
const aktivitetspengerSti = basisstiForOmråde.AKTIVITETSPENGER;
const områdevelgerSti = '/velg-omrade';

const harPrefiks = (sti: string, prefiks: string) => sti === prefiks || sti.startsWith(`${prefiks}/`);

const Side = ({ children }: { children: ReactElement }) => (
	<Box as="main" padding={{ xs: 'space-16', md: 'space-40' }}>
		<Box maxWidth="36rem" marginInline="auto">
			{children}
		</Box>
	</Box>
);

const IngenTilgang = () => (
	<Side>
		<LocalAlert status="warning">
			<LocalAlert.Header>
				<LocalAlert.Title>Du har ikke tilgang til systemet</LocalAlert.Title>
			</LocalAlert.Header>
			<LocalAlert.Content>Kontakt brukerstøtte hvis du skal ha tilgang.</LocalAlert.Content>
		</LocalAlert>
	</Side>
);

const stiForValg: Record<Appvalg, string> = {
	K9_LEGACY: k9LegacySti,
	K9_NY: k9NySti,
	AKTIVITETSPENGER: aktivitetspengerSti,
};

const OmrådeResolver: FunctionComponent<OwnProps> = ({ k9, fleromrade }) => {
	const { data: områder, isPending, isError, refetch } = useInnloggetBrukersOmråder();
	const { pathname, search, hash } = useLocation();
	const navigate = useNavigate();

	if (isPending) {
		return (
			<Side>
				<VStack align="center" gap="space-12">
					<Loader size="2xlarge" title="Henter områdene dine" />
					<BodyShort>Henter områdene dine</BodyShort>
				</VStack>
			</Side>
		);
	}

	if (isError) {
		return (
			<Side>
				<VStack gap="space-16">
					<LocalAlert status="error">
						<LocalAlert.Header>
							<LocalAlert.Title>Kunne ikke hente områdene dine</LocalAlert.Title>
						</LocalAlert.Header>
						<LocalAlert.Content>Prøv på nytt. Last siden på nytt hvis problemet fortsetter.</LocalAlert.Content>
					</LocalAlert>
					<Button variant="secondary" onClick={() => refetch()}>
						Prøv på nytt
					</Button>
				</VStack>
			</Side>
		);
	}

	const valg: Appvalg[] = [];
	if (områder.includes('K9')) {
		valg.push('K9_LEGACY');
		if (visLegacyOgNyK9) valg.push('K9_NY');
	}
	if (aktiverAktivitetspenger && områder.includes('AKTIVITETSPENGER')) valg.push('AKTIVITETSPENGER');

	if (valg.length === 0) return <IngenTilgang />;

	const kanBytteOmråde = valg.length > 1;

	if (harPrefiks(pathname, k9NySti)) {
		return valg.includes('K9_NY') ? (
			<OmrådeProvider område="K9" kanBytteOmråde={kanBytteOmråde}>
				{fleromrade}
			</OmrådeProvider>
		) : (
			<IngenTilgang />
		);
	}
	if (harPrefiks(pathname, k9LegacySti)) {
		return valg.includes('K9_LEGACY') ? k9(kanBytteOmråde) : <IngenTilgang />;
	}
	if (harPrefiks(pathname, aktivitetspengerSti)) {
		return valg.includes('AKTIVITETSPENGER') ? (
			<OmrådeProvider område="AKTIVITETSPENGER" kanBytteOmråde={kanBytteOmråde}>
				{fleromrade}
			</OmrådeProvider>
		) : (
			<IngenTilgang />
		);
	}

	if (pathname === områdevelgerSti || valg.length > 1) {
		return (
			<Side>
				<VStack gap="space-24">
					<VStack gap="space-8">
						<Heading level="1" size="large">
							Velg område
						</Heading>
						<BodyShort>Velg hvilket område du skal arbeide med.</BodyShort>
					</VStack>
					<VStack align="start" gap="space-12">
						{valg.includes('K9_LEGACY') && (
							<Button variant="secondary" onClick={() => navigate(k9LegacySti)}>
								{områdenavn.K9} (legacy)
							</Button>
						)}
						{valg.includes('K9_NY') && (
							<Button variant="secondary" onClick={() => navigate(k9NySti)}>
								{områdenavn.K9} (ny)
							</Button>
						)}
						{valg.includes('AKTIVITETSPENGER') && (
							<Button variant="secondary" onClick={() => navigate(aktivitetspengerSti)}>
								{områdenavn.AKTIVITETSPENGER}
							</Button>
						)}
					</VStack>
				</VStack>
			</Side>
		);
	}

	const målsti = stiForValg[valg[0]];
	return <Navigate replace to={{ pathname: `${målsti}${pathname === '/' ? '' : pathname}`, search, hash }} />;
};

export default OmrådeResolver;
