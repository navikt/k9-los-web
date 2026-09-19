import { BodyShort, Box, Button, Heading, Loader, LocalAlert, VStack } from '@navikt/ds-react';
import { useInnloggetBrukersOmråder } from 'fleromrade/api/områdeQueries';
import { OmrådeProvider } from 'fleromrade/OmrådeContext';
import { basisstiForOmråde, områdenavn, urlSegmentForOmråde } from 'fleromrade/områder';
import { type FunctionComponent, type ReactElement, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

interface OwnProps {
	/** K9 på legacy-API. */
	k9: ReactElement;
	/** Skallet for områder på ny API. Rendres med området i konteksten. */
	fleromrade: ReactElement;
}

const aktivitetspengerSti = basisstiForOmråde.AKTIVITETSPENGER;
const k9NyApiSti = basisstiForOmråde.K9;
// Fagsystemene lenker tilbake med `/k9`. Den sendes til legacy-K9 uten prefiks.
const k9Sti = `/${urlSegmentForOmråde.K9}`;

const harPrefiks = (sti: string, prefiks: string) => sti === prefiks || sti.startsWith(`${prefiks}/`);

const Side = ({ children }: { children: ReactElement }) => (
	<Box as="main" padding={{ xs: 'space-16', md: 'space-40' }}>
		<Box maxWidth="36rem" marginInline="auto">
			{children}
		</Box>
	</Box>
);

const IngenTilgang = ({ tittel }: { tittel: string }) => (
	<Side>
		<LocalAlert status="warning">
			<LocalAlert.Header>
				<LocalAlert.Title>{tittel}</LocalAlert.Title>
			</LocalAlert.Header>
			<LocalAlert.Content>Kontakt brukerstøtte hvis du skal ha tilgang.</LocalAlert.Content>
		</LocalAlert>
	</Side>
);

/**
 * Velger område og modus ut fra URL-en. Aktivitetspenger ligger under `/akt`. K9 har to moduser: legacy på
 * dagens stier uten prefiks, og ny API under `/k9-ny`. Fagsystemene lenker tilbake med `/k9/...`, som skrives
 * om til legacy-stien uten prefiks. Brukere med bare ett område sendes automatisk til riktig sted.
 */
const OmrådeResolver: FunctionComponent<OwnProps> = ({ k9, fleromrade }) => {
	const { data: områder, isPending, isError, refetch } = useInnloggetBrukersOmråder();
	const { pathname, search, hash } = useLocation();
	const navigate = useNavigate();
	// Husker at brukeren har valgt K9, slik at navigering tilbake til `/` i K9 ikke viser velgeren igjen.
	const [k9Valgt, setK9Valgt] = useState(false);

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

	if (områder.length === 0) {
		return <IngenTilgang tittel="Du har ikke tilgang til et område" />;
	}

	const harK9 = områder.includes('K9');
	const harAktivitetspenger = områder.includes('AKTIVITETSPENGER');

	if (harPrefiks(pathname, aktivitetspengerSti)) {
		if (!harAktivitetspenger) {
			return <IngenTilgang tittel={`Du har ikke tilgang til ${områdenavn.AKTIVITETSPENGER.toLowerCase()}`} />;
		}
		if (k9Valgt) {
			setK9Valgt(false);
		}
		return <OmrådeProvider område="AKTIVITETSPENGER">{fleromrade}</OmrådeProvider>;
	}

	if (harPrefiks(pathname, k9NyApiSti)) {
		if (!harK9) {
			return <IngenTilgang tittel={`Du har ikke tilgang til ${områdenavn.K9.toLowerCase()}`} />;
		}
		if (k9Valgt) {
			setK9Valgt(false);
		}
		return <OmrådeProvider område="K9">{fleromrade}</OmrådeProvider>;
	}

	if (harPrefiks(pathname, k9Sti)) {
		if (!harK9) {
			return <IngenTilgang tittel={`Du har ikke tilgang til ${områdenavn.K9.toLowerCase()}`} />;
		}
		if (!k9Valgt) {
			setK9Valgt(true);
		}
		return <Navigate replace to={{ pathname: pathname.slice(k9Sti.length) || '/', search, hash }} />;
	}

	if (!harK9) {
		return (
			<Navigate replace to={{ pathname: `${aktivitetspengerSti}${pathname === '/' ? '' : pathname}`, search, hash }} />
		);
	}

	if (harAktivitetspenger && pathname === '/' && !k9Valgt) {
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
						<Button variant="secondary" onClick={() => setK9Valgt(true)}>
							{områdenavn.K9}
						</Button>
						<Button variant="secondary" onClick={() => navigate(aktivitetspengerSti)}>
							{områdenavn.AKTIVITETSPENGER}
						</Button>
					</VStack>
				</VStack>
			</Side>
		);
	}

	if (harAktivitetspenger && !k9Valgt) {
		setK9Valgt(true);
	}

	return k9;
};

export default OmrådeResolver;
