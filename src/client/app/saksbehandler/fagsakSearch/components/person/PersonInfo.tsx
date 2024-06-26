import React, { FunctionComponent } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import urlKvinne from 'images/kvinne.svg';
import urlMann from 'images/mann.svg';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import Image from 'sharedComponents/Image';
import Person from '../../personTsType';
import AlderVisning from './Aldervisning';
import * as styles from './personInfo.css';

interface OwnProps {
	person: Person;
}

/**
 * PersonInfo
 *
 * Presentasjonskomponent. Definerer visning av personen relatert til fagsak. (Søker)
 *
 * Eksempel:
 * ```html
 * <PersonInfo person={navn:"Ola" alder:{40} personnummer:"12345678910" erKvinne:false
 * erDod:false diskresjonskode:"6" dodsdato:"1990.03.03"} medPanel />
 * ```
 */
const PersonInfo: FunctionComponent<OwnProps & WrappedComponentProps> = ({ person, intl }) => {
	const { navn, personnummer, kjoenn, doedsdato } = person;
	return (
		<div>
			<Image
				className={styles.icon}
				src={kjoenn === 'KVINNE' ? urlKvinne : urlMann}
				alt={intl.formatMessage({ id: 'Person.ImageText' })}
			/>
			<div className={styles.infoPlaceholder}>
				<div>
					<Undertittel>
						{navn} {doedsdato && <AlderVisning doedsdato={doedsdato} />}
					</Undertittel>
					<Undertekst>{personnummer}</Undertekst>
				</div>
			</div>
		</div>
	);
};

export default injectIntl(PersonInfo);
