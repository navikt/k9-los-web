import React, { FunctionComponent, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Table } from '@navikt/ds-react';
import LeggTilSaksbehandlerForm from 'avdelingsleder/bemanning/components/LeggTilSaksbehandlerForm';
import SaksbehandlerInfo from 'avdelingsleder/bemanning/components/SaksbehandlerInfo';
import { AvdelingslederContext } from 'avdelingsleder/context';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import saksbehandlereGra from '../../../../images/saksbehandlereGra.svg';
import styles from './saksbehandlereTabell.css';

/**
 * SaksbehandlereTabell
 */

const SaksbehandlereTabell: FunctionComponent = () => {
	const { saksbehandlere } = useContext(AvdelingslederContext);

	return (
		<>
			<Element className={styles.tableHeader}>
				<Image src={saksbehandlereGra} className={styles.icon} />
				<FormattedMessage id="SaksbehandlereTabell.Saksbehandlere" />
			</Element>
			<LeggTilSaksbehandlerForm />
			{saksbehandlere.length === 0 && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						<FormattedMessage id="SaksbehandlereTabell.IngenSaksbehandlere" />
					</Normaltekst>
					<VerticalSpacer eightPx />
				</>
			)}
			{saksbehandlere.length > 0 && (
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
							{saksbehandlere.map((saksbehandler) => (
								<Table.ExpandableRow
									key={saksbehandler.epost}
									content={<SaksbehandlerInfo saksbehandler={saksbehandler} />}
								>
									<Table.DataCell scope="row">{saksbehandler.navn || saksbehandler.epost}</Table.DataCell>
									<Table.DataCell>{saksbehandler.brukerIdent}</Table.DataCell>
									<Table.DataCell>{saksbehandler.epost}</Table.DataCell>
								</Table.ExpandableRow>
							))}
						</Table.Body>
					</Table>
				</div>
			)}
		</>
	);
};

export default SaksbehandlereTabell;
