import { FilesIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import type { OppgavekøV3Enkel } from 'types/OppgavekøV3Type';
import KopierKøModal from './KopierKøModal';

interface Props {
	kø: OppgavekøV3Enkel;
}

const KopierKø = ({ kø }: Props) => {
	const [visKopierKøModal, setVisKopierKøModal] = useState(false);

	return (
		<>
			<Button variant="tertiary" size="small" icon={<FilesIcon />} onClick={() => setVisKopierKøModal(true)}>
				Kopier
			</Button>
			{visKopierKøModal && <KopierKøModal lukk={() => setVisKopierKøModal(false)} eksisterendeKø={kø} />}
		</>
	);
};

export default KopierKø;
