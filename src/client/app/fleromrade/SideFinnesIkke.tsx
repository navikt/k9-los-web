import { BodyShort, Box, Link, VStack } from '@navikt/ds-react';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { Link as RouterLink } from 'react-router';

const SideFinnesIkke = () => {
	const { basissti } = useOmråde();

	return (
		<Box as="main" padding={{ xs: 'space-16', md: 'space-40' }}>
			<Box maxWidth="36rem" marginInline="auto">
				<VStack gap="space-16" align="center">
					<BodyShort>Denne siden finnes ikke. Hvis du mener dette er en feil, vennligst meld fra i porten.</BodyShort>
					<Link as={RouterLink} to={basissti}>
						Gå til forsiden
					</Link>
				</VStack>
			</Box>
		</Box>
	);
};

export default SideFinnesIkke;
