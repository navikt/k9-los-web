import { BodyShort, Box, Button, Loader, LocalAlert, VStack } from '@navikt/ds-react';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import type { ReactNode } from 'react';

const InnloggetBrukerResolver = ({ children }: { children: ReactNode }) => {
	const { isPending, isError, refetch } = useInnloggetBruker();

	if (isPending) {
		return (
			<Box as="main" padding={{ xs: 'space-16', md: 'space-40' }}>
				<VStack align="center" gap="space-12">
					<Loader size="2xlarge" title="Henter brukeren din" />
					<BodyShort>Henter brukeren din</BodyShort>
				</VStack>
			</Box>
		);
	}

	if (isError) {
		return (
			<Box as="main" padding={{ xs: 'space-16', md: 'space-40' }}>
				<Box maxWidth="36rem" marginInline="auto">
					<VStack gap="space-16">
						<LocalAlert status="error">
							<LocalAlert.Header>
								<LocalAlert.Title>Kunne ikke hente brukeren din</LocalAlert.Title>
							</LocalAlert.Header>
							<LocalAlert.Content>Prøv på nytt. Last siden på nytt hvis problemet fortsetter.</LocalAlert.Content>
						</LocalAlert>
						<Button variant="secondary" onClick={() => refetch()}>
							Prøv på nytt
						</Button>
					</VStack>
				</Box>
			</Box>
		);
	}

	return children;
};

export default InnloggetBrukerResolver;
