import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import { BodyShort, ErrorMessage, Loader, Table } from '@navikt/ds-react';
import { useNesteOppgaverFraKø } from 'api/queries/saksbehandlerQueries';
import * as styles from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgaverTabell.module.css';
import { getKoId } from 'saksbehandler/behandlingskoer/utils';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

export const OppgavetabellV3 = ({ køId }: { køId: string }) => {
	const { data: { rader, kolonner } = {}, error, isLoading, isSuccess } = useNesteOppgaverFraKø(getKoId(køId));

	if (isLoading) {
		return <Loader size="2xlarge" className={styles.spinner} />;
	}
	if (error) {
		return (
			<ErrorMessage>
				<FormattedMessage id="OppgaverTabell.KunneIkkeHenteOppgaver" />
			</ErrorMessage>
		);
	}

	if (isSuccess && rader.length === 0) {
		return (
			<>
				<VerticalSpacer eightPx />
				<BodyShort size="small">
					<FormattedMessage id="OppgaverTabell.IngenOppgaver" />
				</BodyShort>
			</>
		);
	}

	const kolonnekoder = Object.keys(kolonner);

	return (
		<Table>
			<Table.Header>
				<Table.Row>
					{kolonnekoder.map((kode) => (
						<Table.HeaderCell key={kode}>{kolonner[kode]}</Table.HeaderCell>
					))}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{rader.map((rad) => {
					const { id } = rad;
					return (
						<Table.Row key={id}>
							{kolonnekoder.map((kode) => {
								const verdi = rad[kode] ?? '';
								if (/^\d{4}-\d{2}-\d{2}/.test(verdi)) {
									const dato = dayjs(verdi).format('DD.MM.YYYY');
									const tidspunkt = dayjs(verdi).format('DD.MM.YYYY kl. HH:mm:ss');
									return (
										<Table.DataCell key={kode} title={tidspunkt}>
											{dato}
										</Table.DataCell>
									);
								}
								return <Table.DataCell key={kode}>{verdi}</Table.DataCell>;
							})}
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table>
	);
};
