import React, { FunctionComponent } from 'react';
import * as styles from './oppgaverTabellMenyAntallOppgaver.css';

interface OwnProps {
	tekst: string;
}

const OppgaveTabellMenyAntallOppgaver: FunctionComponent<OwnProps> = ({ tekst }) => (
	<div className={styles.container}>
		<div className="m-1">{tekst}</div>
	</div>
);

export default OppgaveTabellMenyAntallOppgaver;
