import { BodyLong, Box, Heading, VStack } from '@navikt/ds-react';

const AktivitetspengerLandingPage = () => (
	<Box as="main" padding={{ xs: 'space-16', md: 'space-40' }}>
		<Box
			background="default"
			borderColor="neutral-subtle"
			borderRadius="12"
			borderWidth="1"
			maxWidth="48rem"
			marginInline="auto"
			padding={{ xs: 'space-24', md: 'space-40' }}
		>
			<VStack gap="space-16">
				<Heading level="1" size="large">
					Aktivitetspenger
				</Heading>
				<BodyLong>Denne siden er klar for videre utvikling av oppgavestyring for aktivitetspenger.</BodyLong>
			</VStack>
		</Box>
	</Box>
);

export default AktivitetspengerLandingPage;
