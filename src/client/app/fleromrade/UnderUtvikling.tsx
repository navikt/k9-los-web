import { BodyLong, Box, Heading, VStack } from '@navikt/ds-react';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { områdenavn } from 'fleromrade/områder';

const UnderUtvikling = ({ tittel }: { tittel: string }) => {
	const { område } = useOmråde();

	return (
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
						{tittel}
					</Heading>
					<BodyLong>{`Denne siden er under utvikling for ${områdenavn[område].toLowerCase()}.`}</BodyLong>
				</VStack>
			</Box>
		</Box>
	);
};

export default UnderUtvikling;
