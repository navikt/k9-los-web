import React, { useState } from 'react';
import { OppgavekøV2Enkel } from 'types/OppgavekøV2Type';
import { FilesIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import KopierKøModal from './KopierKøModal';

interface Props {
	kø: OppgavekøV2Enkel;
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
