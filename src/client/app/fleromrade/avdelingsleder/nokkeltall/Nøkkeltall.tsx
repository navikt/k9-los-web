import { VStack } from '@navikt/ds-react';
import { useOmråde } from 'fleromrade/OmrådeContext';
import FerdigstiltePerEnhet from './FerdigstiltePerEnhet';
import InngangOgFerdigstilte from './InngangOgFerdigstilte';

export default function Nøkkeltall() {
	const { urlSegment } = useOmråde();
	return (
		<VStack gap="space-20" key={urlSegment}>
			<InngangOgFerdigstilte />
			<FerdigstiltePerEnhet />
		</VStack>
	);
}
