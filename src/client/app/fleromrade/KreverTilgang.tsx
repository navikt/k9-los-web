import type { Tilganger } from 'api/generated/los.schemas';
import IkkeTilgang from 'avdelingsleder/components/IkkeTilgang';
import { useInnloggetBruker } from 'fleromrade/api/innloggetBrukerQueries';
import type { ReactNode } from 'react';

interface Props {
	tilgang: keyof Tilganger;
	children: ReactNode;
}

const KreverTilgang = ({ tilgang, children }: Props) => {
	const { data: bruker } = useInnloggetBruker();

	if (!bruker?.tilganger[tilgang]) {
		return <IkkeTilgang />;
	}

	return children;
};

export default KreverTilgang;
