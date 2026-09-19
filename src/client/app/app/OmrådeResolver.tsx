import { BodyShort, Box, Button, Heading, Loader, LocalAlert, VStack } from '@navikt/ds-react';
import { useInnloggetBrukersOmråder } from 'api/queries/områdeQueries';
import { type Område, områdenavn } from 'fleromrade/områder';
import { type FunctionComponent, type ReactElement, useState } from 'react';

interface OwnProps {
	k9: ReactElement;
	aktivitetspenger: ReactElement;
}

const Side = ({ children }: { children: ReactElement }) => (
	<Box as="main" padding={{ xs: 'space-16', md: 'space-40' }}>
		<Box maxWidth="36rem" marginInline="auto">
			{children}
		</Box>
	</Box>
);

const OmrådeResolver: FunctionComponent<OwnProps> = ({ k9, aktivitetspenger }) => {
	const { data: områder, isPending, isError, refetch } = useInnloggetBrukersOmråder();
	const [valgtOmråde, setValgtOmråde] = useState<Område>();

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
		return (
			<Side>
				<LocalAlert status="warning">
					<LocalAlert.Header>
						<LocalAlert.Title>Du har ikke tilgang til et område</LocalAlert.Title>
					</LocalAlert.Header>
					<LocalAlert.Content>Kontakt brukerstøtte hvis du skal ha tilgang.</LocalAlert.Content>
				</LocalAlert>
			</Side>
		);
	}

	const område = valgtOmråde ?? (områder.length === 1 ? områder[0] : undefined);

	if (område === 'K9') {
		return k9;
	}

	if (område === 'AKTIVITETSPENGER') {
		return aktivitetspenger;
	}

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
					{områder.map((tilgjengeligOmråde) => (
						<Button key={tilgjengeligOmråde} variant="secondary" onClick={() => setValgtOmråde(tilgjengeligOmråde)}>
							{områdenavn[tilgjengeligOmråde]}
						</Button>
					))}
				</VStack>
			</VStack>
		</Side>
	);
};

export default OmrådeResolver;
