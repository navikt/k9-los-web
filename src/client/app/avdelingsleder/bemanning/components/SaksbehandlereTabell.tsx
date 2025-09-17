import React, { FunctionComponent, useState } from 'react';
import { Skeleton, Table } from '@navikt/ds-react';
import { useHentSaksbehandlereAvdelingsleder } from 'api/queries/avdelingslederQueries';
import LeggTilSaksbehandlerForm from 'avdelingsleder/bemanning/components/LeggTilSaksbehandlerForm';
import SaksbehandlerInfo from 'avdelingsleder/bemanning/components/SaksbehandlerInfo';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';

const SkeletonRad = () => (
	<Table.ExpandableRow content={null}>
		<Table.DataCell>
			<Skeleton />
		</Table.DataCell>
		<Table.DataCell>
			<Skeleton />
		</Table.DataCell>
		<Table.DataCell>
			<Skeleton />
		</Table.DataCell>
	</Table.ExpandableRow>
);

const SaksbehandlerRad = ({ saksbehandler }: { saksbehandler: Saksbehandler }) => {
	const [ekspandert, setEkspandert] = useState(false);
	return (
		<Table.ExpandableRow
			content={ekspandert && <SaksbehandlerInfo saksbehandler={saksbehandler} />}
			onOpenChange={(open) => setEkspandert(open)}
		>
			<Table.DataCell scope="row">{saksbehandler.navn || saksbehandler.epost}</Table.DataCell>
			<Table.DataCell>{saksbehandler.brukerIdent}</Table.DataCell>
			<Table.DataCell>{saksbehandler.epost}</Table.DataCell>
		</Table.ExpandableRow>
	);
};

const SaksbehandlereTabell: FunctionComponent = () => {
	const { data: saksbehandlere, isLoading, isSuccess } = useHentSaksbehandlereAvdelingsleder();

	return (
		<>
			<div className="mt-4 mb-10">
				<LeggTilSaksbehandlerForm />
			</div>
			<div className="max-w-screen-xl">
				<Table zebraStripes>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell />
							<Table.HeaderCell scope="col">Navn</Table.HeaderCell>
							<Table.HeaderCell scope="col">Brukerident</Table.HeaderCell>
							<Table.HeaderCell scope="col">Epost</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{isLoading && (
							<>
								<SkeletonRad />
								<SkeletonRad />
								<SkeletonRad />
							</>
						)}
						{isSuccess &&
							saksbehandlere.map((saksbehandler) => (
								<SaksbehandlerRad key={saksbehandler.epost} saksbehandler={saksbehandler} />
							))}
					</Table.Body>
				</Table>
			</div>
		</>
	);
};

export default SaksbehandlereTabell;
