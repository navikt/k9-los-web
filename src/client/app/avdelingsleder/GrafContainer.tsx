import { useIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { Heading, Panel, Select } from '@navikt/ds-react';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { lagreTilLocalStorageCallback } from 'utils/localStorageHelper';
import * as styles from './grafContainer.module.css';
import { fremtidigeUker, uker, ytelseTyper } from './nokkeltall/nokkeltallUtils';

interface OwnProps {
	setAntallUkerSomSkalVises?: (uker: string) => void;
	setValgtYtelseType: (ytelse: string) => void;
	tittel: string;
	children: JSX.Element;
	valgtYtelseType: string;
	fremITid?: boolean;
	antallUkerSomSkalVises?: string;
	id?: string;
	hjelpetekst?: string;
	utenPunsj?: boolean;
}

const GrafContainer = ({
	valgtYtelseType,
	antallUkerSomSkalVises,
	setAntallUkerSomSkalVises,
	setValgtYtelseType,
	utenPunsj,
	tittel,
	fremITid,
	hjelpetekst,
	id,
	children,
}: OwnProps) => {
	const velgUkeHandler = (value) => {
		lagreTilLocalStorageCallback(`${id}-uker`, value, setAntallUkerSomSkalVises);
	};
	const velgYtelsesTypeHandler = (value) => {
		lagreTilLocalStorageCallback(`${id}-ytelsestype`, value, setValgtYtelseType);
	};
	const intl = useIntl();

	const ukeOptions = fremITid ? fremtidigeUker : uker;

	return (
		<Panel border>
			<div className={styles.tittel}>
				<Heading spacing level="3" size="small">
					{tittel}
				</Heading>
				{hjelpetekst && (
					<div className={styles.hjelpetekst}>
						<Hjelpetekst>{hjelpetekst}</Hjelpetekst>
					</div>
				)}
			</div>
			<VerticalSpacer eightPx />
			<Row>
				{setAntallUkerSomSkalVises && (
					<Column xs="3" lg="2">
						<Select
							onChange={(e) => velgUkeHandler(e.target.value)}
							label="Antall uker som skal vises"
							hideLabel
							size="small"
							value={antallUkerSomSkalVises}
						>
							{ukeOptions.map((u) => (
								<option key={u.kode} value={u.kode}>
									{intl.formatMessage({ id: u.tekstKode })}
								</option>
							))}
						</Select>
					</Column>
				)}
				{setValgtYtelseType && (
					<Column xs="3" lg="2">
						<Select
							onChange={(e) => velgYtelsesTypeHandler(e.target.value)}
							label="Valgt ytelse"
							hideLabel
							size="small"
							value={valgtYtelseType}
						>
							{ytelseTyper
								.filter((ytelsestype) => (utenPunsj ? ytelsestype.navn !== 'Punsj' : true))
								.map((u) => (
									<option key={u.kode} value={u.kode}>
										{u.navn}
									</option>
								))}
						</Select>
					</Column>
				)}
			</Row>
			<VerticalSpacer sixteenPx />
			{children}
		</Panel>
	);
};

export default GrafContainer;
