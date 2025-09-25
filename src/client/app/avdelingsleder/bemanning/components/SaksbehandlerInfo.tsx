import React, { FunctionComponent, useState } from 'react';
import { TrashIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, List, Skeleton } from '@navikt/ds-react';
import { useHentAndreSaksbehandleresKøer, useSlettSaksbehandler } from 'api/queries/avdelingslederQueries';
import SletteSaksbehandlerModal from 'avdelingsleder/bemanning/components/SletteSaksbehandlerModal';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import { OppgaveKoIdOgTittel } from 'types/OppgavekøV3Type';

const KøListe = ({
	title,
	data,
	isSuccess = true,
	isLoading = false,
}: {
	title: string;
	data: OppgaveKoIdOgTittel[];
	isSuccess?: boolean;
	isLoading?: boolean;
}) => {
	const skeleton = <Skeleton width={80} />;
	return (
		<List title={title} size="small">
			{isLoading && (
				<>
					<List.Item>{skeleton}</List.Item>
					<List.Item>{skeleton}</List.Item>
					<List.Item>{skeleton}</List.Item>
				</>
			)}
			{isSuccess && data.length === 0 && <BodyShort size="small">Ingen køer tildelt</BodyShort>}
			{isSuccess && data.length > 0 && data.map(({ id, tittel }) => <List.Item key={id}>{tittel}</List.Item>)}
		</List>
	);
};

interface OwnProps {
	saksbehandler: Saksbehandler;
}

const SaksbehandlerInfo: FunctionComponent<OwnProps> = ({ saksbehandler }) => {
	const [visSlettModal, setVisSlettModal] = useState(false);
	const lukkSlettModal = () => {
		setVisSlettModal(false);
	};
	const {
		data: køerV3,
		isLoading: isLoadingKøerV3,
		isSuccess: isSuccessKøerV3,
	} = useHentAndreSaksbehandleresKøer(saksbehandler.id);
	const { mutate, isPending: isLoadingSlett } = useSlettSaksbehandler();
	const slettSaksbehandler = () => mutate({ epost: saksbehandler.epost }, { onSuccess: lukkSlettModal });

	return (
		<div>
			<div className="flex">
				<KøListe title="Køer" data={køerV3} isSuccess={isSuccessKøerV3} isLoading={isLoadingKøerV3} />
			</div>
			{}
			<Button
				onClick={() => {
					setVisSlettModal(true);
				}}
				className="bg-red-400 hover:bg-red-600 mt-6"
				size="small"
				icon={<TrashIcon height="1.5rem" width="1.5rem" />}
			>
				Slett saksbehandler
			</Button>
			{visSlettModal && (
				<SletteSaksbehandlerModal
					valgtSaksbehandler={saksbehandler}
					closeSletteModal={lukkSlettModal}
					slettSaksbehandler={slettSaksbehandler}
					loading={isLoadingSlett}
				/>
			)}
		</div>
	);
};

export default SaksbehandlerInfo;
